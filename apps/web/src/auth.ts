import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google,
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
          })
          
          const data = await res.json()
          
          if (res.ok && data.success && data.data) {
            return {
              id: data.data.user.id,
              name: data.data.user.name,
              email: data.data.user.email,
              role: data.data.user.role,
              avatar: data.data.user.avatar,
              accessToken: data.data.accessToken,
              refreshToken: data.data.refreshToken,
            }
          }
          return null
        } catch (error) {
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // If user just logged in via Google, call our backend to sync the user
      if (account?.provider === 'google' && account.id_token) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken: account.id_token }),
          })
          const data = await res.json()
          if (res.ok && data.success) {
            token.accessToken = data.data.accessToken
            token.refreshToken = data.data.refreshToken
            token.id = data.data.user.id
            token.role = data.data.user.role
            token.avatar = data.data.user.avatar
          }
        } catch (e) {
          console.error("Failed to sync Google user with backend", e)
        }
      } 
      // If user logged in via Credentials, user object will have tokens
      else if (user) {
        const u = user as unknown as { accessToken?: string; refreshToken?: string; role?: string; avatar?: string };
        token.accessToken = u.accessToken
        token.refreshToken = u.refreshToken
        token.id = user.id
        token.role = u.role
        token.avatar = u.avatar
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.avatar = token.avatar as string
        session.accessToken = token.accessToken as string
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
})
