import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { User } from '../models';
import { registerSchema, loginSchema } from '@edu-hub/types';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '1d';
const REFRESH_SECRET = process.env.REFRESH_SECRET;
const REFRESH_EXPIRES_IN = '7d';

if (!JWT_SECRET || !REFRESH_SECRET) {
  console.error('CRITICAL: JWT_SECRET and REFRESH_SECRET must be set in environment variables');
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
}

// Fallback only for development if strictly needed, but better to fail fast
const SAFE_JWT_SECRET = JWT_SECRET || 'dev_secret_only';
const SAFE_REFRESH_SECRET = REFRESH_SECRET || 'dev_refresh_secret_only';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateTokens = (userId: string, role: string) => {
  const accessToken = jwt.sign({ userId, role }, SAFE_JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  const refreshToken = jwt.sign({ userId, role }, SAFE_REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES_IN });
  return { accessToken, refreshToken };
};

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const parsed = registerSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ success: false, message: 'Validation failed', errors: parsed.error.errors });
        return;
      }

      const { name, email, password } = parsed.data;

      const userExists = await User.findOne({ email });
      if (userExists) {
        res.status(400).json({ success: false, message: 'User already exists' });
        return;
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
        role: email === 'eduhubinformation@gmail.com' ? 'admin' : 'student'
      });

      const { accessToken, refreshToken } = generateTokens(user.id, user.role);

      res.status(201).json({
        success: true,
        data: {
          user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, stream: user.stream },
          accessToken,
          refreshToken
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ success: false, message: 'Validation failed', errors: parsed.error.errors });
        return;
      }

      const { email, password } = parsed.data;

      const user = await User.findOne({ email, isActive: true });
      if (!user || !user.password) {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
        return;
      }

      user.lastLoginAt = new Date();
      await user.save();

      const { accessToken, refreshToken } = generateTokens(user.id, user.role);

      res.json({
        success: true,
        data: {
          user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, stream: user.stream },
          accessToken,
          refreshToken
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  }

  static async google(req: Request, res: Response) {
    try {
      const { idToken } = req.body;
      if (!idToken) {
        res.status(400).json({ success: false, message: 'Google ID token is required' });
        return;
      }

      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        res.status(400).json({ success: false, message: 'Invalid Google token' });
        return;
      }

      let user = await User.findOne({ email: payload.email });

      if (!user) {
        user = await User.create({
          name: payload.name || 'Student',
          email: payload.email,
          googleId: payload.sub,
          avatar: payload.picture || `https://api.dicebear.com/7.x/initials/svg?seed=${payload.name}`,
          role: payload.email === 'eduhubinformation@gmail.com' ? 'admin' : 'student'
        });
      } else if (!user.googleId) {
        // Link Google ID if email exists
        user.googleId = payload.sub;
        await user.save();
      }

      if (!user.isActive) {
        res.status(403).json({ success: false, message: 'Account is deactivated' });
        return;
      }

      user.lastLoginAt = new Date();
      await user.save();

      const { accessToken, refreshToken } = generateTokens(user.id, user.role);

      res.json({
        success: true,
        data: {
          user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, stream: user.stream },
          accessToken,
          refreshToken
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Google Auth Error' });
    }
  }

  static async refresh(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        res.status(400).json({ success: false, message: 'Refresh token is required' });
        return;
      }

      const decoded = jwt.verify(refreshToken, SAFE_REFRESH_SECRET) as { userId: string; role: string };
      const { accessToken: newAccess, refreshToken: newRefresh } = generateTokens(decoded.userId, decoded.role);

      res.json({
        success: true,
        data: {
          accessToken: newAccess,
          refreshToken: newRefresh
        }
      });
    } catch (error) {
      res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }
  }
}
