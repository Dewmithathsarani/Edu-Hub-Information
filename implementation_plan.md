# Edu Hub — Full-Stack Student Study Platform
# DETAILED IMPLEMENTATION PLAN v2.0

> A premium, mobile-first student learning platform with dark blue + silver aesthetics, built on the MERN stack (Next.js 15 + Express.js + MongoDB + Redis), deployed on Vercel + Railway.

---

## 1. Project Overview

**Edu Hub** is a comprehensive student study platform designed for A/L students in Sri Lanka. It provides smart task management with AI prioritization, MCQ challenges with automated evaluation and leaderboards, collaborative study groups with meeting scheduling, resource sharing with Cloudinary CDN, progress analytics with visual dashboards, and a powerful admin panel — all wrapped in a premium dark-themed glassmorphic UI with smooth animations.

### 1.1 Tech Stack — Complete Dependency List

#### Frontend (Next.js 15 — `apps/web`)
| Package | Version | Purpose | Why This Choice |
|---------|---------|---------|----------------|
| `next` | ^15.x | Framework | App Router, RSC, Server Actions, SSR/SSG |
| `react` | ^19.x | UI Library | Concurrent rendering, Server Components |
| `typescript` | ^5.6 | Type Safety | End-to-end type safety with shared types |
| `tailwindcss` | ^4.x | Styling | Utility-first, mobile-first, CSS-first config |
| `@tanstack/react-query` | ^5.x | Server State | Cache, refetch, optimistic updates for API data |
| `zustand` | ^5.x | Client State | Lightweight (1KB), no boilerplate, devtools |
| `next-auth` | ^5.x (beta) | Auth | Google OAuth, session management, JWT |
| `framer-motion` | ^11.x | Animations | Page transitions, mount/unmount, layout animations |
| `zod` | ^3.x | Validation | Shared schemas with backend (runtime + types) |
| `lucide-react` | latest | Icons | Tree-shakeable, consistent, 1400+ icons |
| `recharts` | ^2.x | Charts | Composable React charts for analytics |
| `date-fns` | ^4.x | Dates | Lightweight date formatting/manipulation |
| `react-hot-toast` | ^2.x | Toasts | Lightweight, customizable notifications |
| `clsx` | ^2.x | Class Merging | Conditional className utility |
| `tailwind-merge` | ^2.x | TW Conflict Resolution | Prevents duplicate Tailwind classes |
| `@radix-ui/react-*` | latest | Primitives | Accessible modal, dropdown, tooltip, tabs |
| `next-themes` | ^0.4 | Theme | System/dark mode toggle (future light mode) |
| `react-hook-form` | ^7.x | Forms | Performant form handling with Zod resolver |
| `@hookform/resolvers` | ^3.x | Form Validation | Zod integration with react-hook-form |

#### Backend (Express.js — `apps/api`)
| Package | Version | Purpose | Why This Choice |
|---------|---------|---------|----------------|
| `express` | ^4.21 | Framework | Mature, extensible, massive ecosystem |
| `typescript` | ^5.6 | Type Safety | Shared types with frontend |
| `mongoose` | ^8.x | ODM | Schema validation, middleware, population |
| `ioredis` | ^5.x | Redis Client | Better reconnection, cluster/sentinel support |
| `jsonwebtoken` | ^9.x | JWT | Sign/verify access & refresh tokens |
| `bcryptjs` | ^2.x | Password Hashing | 12 salt rounds, pure JS (no native deps) |
| `google-auth-library` | ^9.x | Google Auth | Verify Google OAuth tokens server-side |
| `cloudinary` | ^2.x | File CDN | Upload, transform, serve images/documents |
| `multer` | ^1.x | File Parsing | Multipart form-data (memoryStorage) |
| `sharp` | ^0.33 | Image Processing | Resize, compress, strip EXIF before upload |
| `zod` | ^3.x | Validation | Request body/params/query validation |
| `helmet` | ^8.x | Security Headers | XSS, clickjacking, HSTS, CSP |
| `cors` | ^2.x | CORS | Cross-origin request handling |
| `express-rate-limit` | ^7.x | Rate Limiting | DDoS/brute-force protection |
| `rate-limit-redis` | ^4.x | Rate Limit Store | Distributed rate limiting via Redis |
| `express-mongo-sanitize` | ^2.x | NoSQL Injection | Sanitize `$` and `.` from user input |
| `hpp` | ^0.2 | HPP | HTTP parameter pollution prevention |
| `morgan` | ^1.x | Logging | HTTP request logging |
| `cookie-parser` | ^1.x | Cookies | Parse JWT cookies |
| `dotenv` | ^16.x | Env Vars | Load `.env` files |
| `node-cron` | ^3.x | Scheduling | Task reminders, notification cron jobs |
| `compression` | ^1.x | Gzip | Response compression |
| `winston` | ^3.x | Logging | Structured production logging |
| `express-async-errors` | ^3.x | Error Handling | Auto-catch async route errors |

#### Monorepo & Tooling (Root)
| Package | Version | Purpose |
|---------|---------|---------|
| `turbo` | ^2.x | Monorepo orchestration, parallel builds, caching |
| `pnpm` | ^9.x | Fast, disk-efficient package manager |
| `typescript` | ^5.6 | Shared base config |
| `eslint` | ^9.x | Linting |
| `prettier` | ^3.x | Code formatting |
| `tsup` | ^8.x | Bundle shared packages |
| `lint-staged` | ^15.x | Pre-commit checks |
| `husky` | ^9.x | Git hooks |

---

## 2. Complete Requirements Matrix with Acceptance Criteria

### 👨‍🎓 Student Features (13 items)

#### REQ-01: Registration, Login, Profile Management + Google Sign-In
| Attribute | Detail |
|-----------|--------|
| **User Story** | As a student, I want to create an account and sign in securely so I can access personalized features |
| **Acceptance Criteria** | |
| | ✅ Register with name, email, password (min 8 chars, 1 uppercase, 1 number) |
| | ✅ Login with email/password → receive JWT in HttpOnly cookie |
| | ✅ Login with Google OAuth 2.0 → auto-create account if new |
| | ✅ View/edit profile: name, avatar (Cloudinary upload), subjects of interest |
| | ✅ Change password (verify old password first) |
| | ✅ Logout → blacklist refresh token in Redis |
| | ✅ "Forgot password" flow → email reset link (stretch goal) |
| **Error States** | Invalid credentials toast, email already exists, Google auth failure, network error |
| **Loading States** | Button spinner during auth, skeleton on profile page |

#### REQ-02: Smart Task Management
| Attribute | Detail |
|-----------|--------|
| **User Story** | As a student, I want to organize my study activities and deadlines so I stay on track |
| **Acceptance Criteria** | |
| | ✅ Create task: title, description (optional), subject, priority (low/medium/high/urgent), due date |
| | ✅ View tasks in list view with filters (status, priority, subject) and sort (due date, priority, created) |
| | ✅ Edit task inline or in modal |
| | ✅ Mark task as completed → update `completedAt` timestamp |
| | ✅ Delete task with confirmation dialog |
| | ✅ Overdue tasks highlighted with red badge |
| | ✅ Task count badges on sidebar: "3 overdue", "5 due today" |
| **UI Components** | TaskCard, TaskForm (modal), TaskFilters, EmptyState |
| **API Endpoints** | `GET /tasks`, `POST /tasks`, `PATCH /tasks/:id`, `DELETE /tasks/:id` |

#### REQ-03: Notification & Reminder System
| Attribute | Detail |
|-----------|--------|
| **User Story** | As a student, I want to receive reminders for important tasks so I don't miss deadlines |
| **Acceptance Criteria** | |
| | ✅ Auto-generate reminders: 24h before due date, 1h before due date |
| | ✅ Urgent tasks get additional 48h-before reminder |
| | ✅ In-app notification bell with unread count badge |
| | ✅ Notification dropdown: title, message, time-ago, click-to-navigate |
| | ✅ Mark individual or all notifications as read |
| | ✅ Auto-delete notifications after 30 days (TTL index) |
| **Trigger Events** | Task due soon, quiz result ready, group invite, challenge started, resource approved |
| **Backend** | `node-cron` job runs every 30 min → scans tasks → creates notifications |

#### REQ-04: AI Task Prioritization
| Attribute | Detail |
|-----------|--------|
| **User Story** | As a student, I want the system to tell me which tasks I should complete first |
| **Acceptance Criteria** | |
| | ✅ Algorithm calculates a `priorityScore` (0–100) for each pending task |
| | ✅ Tasks sorted by score in "Smart Priority" view |
| | ✅ Visual indicator: 🔴 Do First, 🟡 Schedule, 🟢 Delegate/Later |
| | ✅ Score recalculates on every request (not cached — always fresh) |
| **Algorithm — Eisenhower Matrix Scoring** | |
| | `priorityScore = (urgencyWeight × 0.6) + (importanceWeight × 0.4)` |
| | `urgencyWeight`: based on hours until deadline → `100 - min(hoursLeft, 168) / 168 × 100` |
| | `importanceWeight`: `urgent=100, high=75, medium=50, low=25` |
| | Overdue tasks automatically get score `100` |
| | If two tasks have equal score, earlier `createdAt` wins |

#### REQ-05: Progress Dashboard
| Attribute | Detail |
|-----------|--------|
| **User Story** | As a student, I want to monitor my study progress visually |
| **Acceptance Criteria** | |
| | ✅ KPI cards: Tasks completed (this week), Study hours (this week), Quizzes taken, Average score |
| | ✅ Circular progress ring: overall task completion % |
| | ✅ Weekly study hours bar chart (Mon–Sun) |
| | ✅ Subject-wise quiz performance pie chart |
| | ✅ Current streak counter with fire 🔥 icon |
| | ✅ Quick action buttons: "Start Timer", "Take Quiz", "Add Task" |
| | ✅ Recent activity feed (last 5 actions) |
| **Charts Library** | Recharts (React-native charting, composable) |
| **Data Source** | `GET /analytics/dashboard` — aggregates from tasks, sessions, quiz attempts |

#### REQ-06: Stopwatch & Study Timer
| Attribute | Detail |
|-----------|--------|
| **User Story** | As a student, I want to manage my study time effectively |
| **Acceptance Criteria** | |
| | ✅ Large circular timer display (00:00:00 format) |
| | ✅ Start / Pause / Reset controls |
| | ✅ Select subject before starting (dropdown) |
| | ✅ Timer runs client-side (Zustand store) — persists across page navigation |
| | ✅ On "Save Session": POST to backend with subject + duration |
| | ✅ Session history list: date, subject, duration |
| | ✅ Total study time stats: today / this week / all time |
| | ✅ Optional: Pomodoro mode (25 min work / 5 min break cycles) |
| **State** | `useTimerStore` (Zustand) — `isRunning`, `elapsed`, `subject`, `startTime` |
| **Persistence** | Timer state in `localStorage` for page refresh survival |

#### REQ-07: Study Groups
| Attribute | Detail |
|-----------|--------|
| **User Story** | As a student, I want to collaborate with other students in study groups |
| **Acceptance Criteria** | |
| | ✅ Create group: name, description, subject, max members (default 20) |
| | ✅ Browse public groups with search and subject filter |
| | ✅ Join/leave group |
| | ✅ Group detail page: member list with avatars, group info |
| | ✅ Group creator can remove members |
| | ✅ Member count badge on group cards |
| **UI Components** | GroupCard, GroupForm (create modal), MemberList, GroupSearch |

#### REQ-08: Meeting Scheduler + Zoom Integration
| Attribute | Detail |
|-----------|--------|
| **User Story** | As a student, I want to schedule online study sessions with Zoom links |
| **Acceptance Criteria** | |
| | ✅ Schedule meeting: title, date/time, Zoom link (manual paste), group (optional) |
| | ✅ View upcoming meetings in calendar-style list |
| | ✅ Click "Join" → opens Zoom link in new tab |
| | ✅ Meeting reminders (30 min before via notification) |
| | ✅ Past meetings auto-archive |
| **Note** | Manual Zoom link paste (no API integration required for MVP) |

#### REQ-09: Resource Sharing System
| Attribute | Detail |
|-----------|--------|
| **User Story** | As a student, I want to access educational materials shared by the community |
| **Acceptance Criteria** | |
| | ✅ Browse resources in card grid with thumbnail preview |
| | ✅ Filter by subject, type (notes/short_notes/tutorial/past_paper) |
| | ✅ Search by title keyword |
| | ✅ Sort by newest, most downloaded |
| | ✅ Download resource → increment download counter |
| | ✅ Resource detail modal: title, description, uploader info, download button |
| | ✅ Only admin-approved resources visible to students |

#### REQ-10: Resource Upload Module
| Attribute | Detail |
|-----------|--------|
| **User Story** | As a student, I want to share my educational resources with the community |
| **Acceptance Criteria** | |
| | ✅ Upload form: title, description, subject, type, file (drag-and-drop or click) |
| | ✅ Accepted formats: PDF, DOCX, PPTX, images (JPG/PNG/WEBP) |
| | ✅ Max file size: 10MB |
| | ✅ Upload progress bar |
| | ✅ File goes to Cloudinary → URL stored in MongoDB |
| | ✅ Resource enters "Pending Review" state → visible only after admin approval |
| | ✅ View "My Uploads" with status badges (pending/approved/rejected) |
| **Cloudinary Folder** | `edu-hub/resources/<subject>/` |
| **Transformations** | Auto-generate thumbnail for PDFs (first page), compress images |

#### REQ-11: MCQ Challenge Module
| Attribute | Detail |
|-----------|--------|
| **User Story** | As a student, I want to practice A/L MCQs categorized by subject, lesson, and year |
| **Acceptance Criteria** | |
| | ✅ Browse quizzes in card grid |
| | ✅ Filter by subject, lesson, difficulty (easy/medium/hard), year |
| | ✅ Quiz card shows: title, subject, question count, difficulty badge, time limit |
| | ✅ Start quiz → one question per screen with 4 options (A/B/C/D) |
| | ✅ Progress bar (question 3/20) |
| | ✅ Timer counting down (if time-limited) |
| | ✅ Navigate between questions (Next/Previous) |
| | ✅ Flag/bookmark individual questions for review |
| | ✅ Submit quiz → confirm dialog ("Are you sure?") |
| | ✅ Auto-submit when timer reaches 0 |
| **UI Flow** | Quiz listing → Quiz detail → Quiz attempt → Results |

#### REQ-12: Automated Evaluation System
| Attribute | Detail |
|-----------|--------|
| **User Story** | As a student, I want to receive instant MCQ results after submission |
| **Acceptance Criteria** | |
| | ✅ Instant score calculation on submit |
| | ✅ Results screen: score (%), correct/wrong/skipped counts |
| | ✅ Question-by-question review: show selected vs correct answer |
| | ✅ Explanation shown for each question (if available) |
| | ✅ Color coding: ✅ green (correct), ❌ red (wrong), ⬜ gray (skipped) |
| | ✅ Time taken displayed |
| | ✅ "Retake Quiz" and "Back to Quizzes" buttons |
| **Backend Logic** | Compare `answers[].selected` with `questions[].correctAnswer` → calculate score |

#### REQ-13: Performance Analytics
| Attribute | Detail |
|-----------|--------|
| **User Story** | As a student, I want to identify my weak subject areas |
| **Acceptance Criteria** | |
| | ✅ Subject-wise performance bar chart (average score per subject) |
| | ✅ Weak areas highlighted in red (score < 50%) |
| | ✅ Strong areas highlighted in green (score > 75%) |
| | ✅ Recent quiz history table: quiz name, date, score, time taken |
| | ✅ Performance trend line chart (scores over time) |
| | ✅ Recommendation text: "Focus on Physics — your average is 42%" |
| **MongoDB Aggregation** | Group `quizAttempts` by `quiz.subject` → calculate avg score per subject |

---

### 🛡️ Admin Features (6 items)

#### REQ-14: User Management Module
| Attribute | Detail |
|-----------|--------|
| **User Story** | As an admin, I want to manage user accounts on the platform |
| **Acceptance Criteria** | |
| | ✅ Data table: name, email, role, status (active/inactive), joined date |
| | ✅ Search by name or email |
| | ✅ Filter by role (student/admin), status (active/inactive) |
| | ✅ Activate/deactivate toggle per user (soft ban) |
| | ✅ View user profile details in slide-over panel |
| | ✅ Pagination (20 per page) |

#### REQ-15: Administrative Dashboard
| Attribute | Detail |
|-----------|--------|
| **User Story** | As an admin, I want to monitor overall platform activity |
| **Acceptance Criteria** | |
| | ✅ KPI cards: Total users, Active users (last 7d), Total quizzes, Total resources |
| | ✅ New registrations chart (line chart, last 30 days) |
| | ✅ Most active subjects (bar chart) |
| | ✅ Recent activity log (last 10 actions across platform) |
| | ✅ Resource pending review count with link |
| | ✅ System health status |

#### REQ-16: Resource Management Module
| Attribute | Detail |
|-----------|--------|
| **User Story** | As an admin, I want to review and manage uploaded resources |
| **Acceptance Criteria** | |
| | ✅ Data table: title, type, subject, uploader, status, date |
| | ✅ Filter by status (pending/approved/rejected) |
| | ✅ Preview resource (open in new tab) |
| | ✅ Approve/Reject with one click |
| | ✅ Delete resource → remove from Cloudinary + MongoDB (soft delete) |
| | ✅ Pending review queue highlighted at top |

#### REQ-17: MCQ Management Module
| Attribute | Detail |
|-----------|--------|
| **User Story** | As an admin, I want to create and manage MCQ quizzes |
| **Acceptance Criteria** | |
| | ✅ Create quiz: title, subject, lesson, year, difficulty, time limit |
| | ✅ Add questions to quiz: question text, 4 options, correct answer, explanation |
| | ✅ Optional question image upload (Cloudinary) |
| | ✅ Edit/delete individual questions |
| | ✅ Publish/unpublish quiz toggle |
| | ✅ Question bank table with search |
| | ✅ Drag-and-drop question reordering |

#### REQ-18: Challenge Management Module
| Attribute | Detail |
|-----------|--------|
| **User Story** | As an admin, I want to create engagement challenges for students |
| **Acceptance Criteria** | |
| | ✅ Create challenge: title, description, type, target value, reward badge, date range |
| | ✅ Challenge types: quiz_streak (complete N quizzes), study_hours (study N hours), resource_upload |
| | ✅ View participants and their progress |
| | ✅ Activate/deactivate challenge |
| | ✅ Auto-award badge when student reaches target |

#### REQ-19: Reporting Module
| Attribute | Detail |
|-----------|--------|
| **User Story** | As an admin, I want to generate reports on platform usage |
| **Acceptance Criteria** | |
| | ✅ User activity report: registrations, logins, active users over time |
| | ✅ Resource usage report: uploads, downloads, approvals per subject |
| | ✅ Quiz performance report: average scores by subject, most attempted quizzes |
| | ✅ Date range filter (last 7d / 30d / 90d / custom) |
| | ✅ Export report as CSV |

---

## 3. Architecture

### 3.1 Monorepo Structure (Turborepo + pnpm)

```
edu-hub/
├── apps/
│   ├── web/                              # ═══ NEXT.JS 15 FRONTEND ═══
│   │   ├── app/
│   │   │   ├── (auth)/                  # Route group — auth pages (no sidebar)
│   │   │   │   ├── login/
│   │   │   │   │   └── page.tsx         # Email/password + Google login
│   │   │   │   ├── register/
│   │   │   │   │   └── page.tsx         # Registration form
│   │   │   │   └── layout.tsx           # Centered card layout, mesh bg
│   │   │   │
│   │   │   ├── (student)/               # Route group — student dashboard
│   │   │   │   ├── dashboard/
│   │   │   │   │   └── page.tsx         # KPI cards, progress ring, activity feed
│   │   │   │   ├── tasks/
│   │   │   │   │   └── page.tsx         # Task list, filters, create modal
│   │   │   │   ├── timer/
│   │   │   │   │   └── page.tsx         # Study timer, session history
│   │   │   │   ├── quizzes/
│   │   │   │   │   ├── page.tsx         # Quiz listing with filters
│   │   │   │   │   └── [quizId]/
│   │   │   │   │       ├── page.tsx     # Quiz attempt (one question/screen)
│   │   │   │   │       └── results/
│   │   │   │   │           └── page.tsx # Quiz results + review
│   │   │   │   ├── resources/
│   │   │   │   │   └── page.tsx         # Resource grid, upload modal
│   │   │   │   ├── groups/
│   │   │   │   │   ├── page.tsx         # Group listing
│   │   │   │   │   └── [groupId]/
│   │   │   │   │       └── page.tsx     # Group detail, members, meetings
│   │   │   │   ├── analytics/
│   │   │   │   │   └── page.tsx         # Performance charts, weak areas
│   │   │   │   ├── notifications/
│   │   │   │   │   └── page.tsx         # Full notification list
│   │   │   │   ├── profile/
│   │   │   │   │   └── page.tsx         # Profile edit, change password
│   │   │   │   └── layout.tsx           # Sidebar + top nav + bottom nav (mobile)
│   │   │   │
│   │   │   ├── (admin)/                 # Route group — admin panel
│   │   │   │   ├── dashboard/
│   │   │   │   │   └── page.tsx         # Admin KPIs, charts, activity log
│   │   │   │   ├── users/
│   │   │   │   │   └── page.tsx         # User management table
│   │   │   │   ├── resources/
│   │   │   │   │   └── page.tsx         # Resource review queue
│   │   │   │   ├── mcqs/
│   │   │   │   │   ├── page.tsx         # Quiz list management
│   │   │   │   │   └── [quizId]/
│   │   │   │   │       └── page.tsx     # Question editor for specific quiz
│   │   │   │   ├── challenges/
│   │   │   │   │   └── page.tsx         # Challenge management
│   │   │   │   ├── reports/
│   │   │   │   │   └── page.tsx         # Reports with date filters, CSV export
│   │   │   │   └── layout.tsx           # Admin sidebar layout (different nav items)
│   │   │   │
│   │   │   ├── api/
│   │   │   │   └── auth/
│   │   │   │       └── [...nextauth]/
│   │   │   │           └── route.ts     # Auth.js route handler
│   │   │   ├── layout.tsx               # Root layout (html, body, providers, fonts)
│   │   │   ├── page.tsx                 # Landing page (hero, features, CTA)
│   │   │   ├── not-found.tsx            # Custom 404
│   │   │   ├── error.tsx                # Global error boundary
│   │   │   ├── loading.tsx              # Root loading (skeleton)
│   │   │   └── globals.css              # Tailwind directives + custom tokens
│   │   │
│   │   ├── components/
│   │   │   ├── ui/                      # ═══ BASE DESIGN SYSTEM COMPONENTS ═══
│   │   │   │   ├── button.tsx           # Variants: primary, secondary, outline, ghost, danger
│   │   │   │   ├── input.tsx            # Text input with label, error, icon slots
│   │   │   │   ├── textarea.tsx         # Multi-line input
│   │   │   │   ├── select.tsx           # Dropdown select (Radix)
│   │   │   │   ├── modal.tsx            # Dialog/modal (Radix)
│   │   │   │   ├── card.tsx             # Glass card with hover glow
│   │   │   │   ├── badge.tsx            # Status/priority badge
│   │   │   │   ├── avatar.tsx           # User avatar with fallback
│   │   │   │   ├── toast.tsx            # Custom toast wrapper
│   │   │   │   ├── skeleton.tsx         # Loading skeleton
│   │   │   │   ├── empty-state.tsx      # Empty state with icon + CTA
│   │   │   │   ├── spinner.tsx          # Loading spinner
│   │   │   │   ├── progress-bar.tsx     # Linear progress
│   │   │   │   ├── progress-ring.tsx    # Circular SVG progress
│   │   │   │   ├── data-table.tsx       # Sortable/filterable table (admin)
│   │   │   │   ├── pagination.tsx       # Page navigation
│   │   │   │   ├── tabs.tsx             # Tab navigation (Radix)
│   │   │   │   ├── dropdown-menu.tsx    # Context menu (Radix)
│   │   │   │   ├── tooltip.tsx          # Info tooltip (Radix)
│   │   │   │   └── file-upload.tsx      # Drag-and-drop file upload
│   │   │   │
│   │   │   ├── layout/                  # ═══ LAYOUT COMPONENTS ═══
│   │   │   │   ├── sidebar.tsx          # Desktop sidebar (collapsible)
│   │   │   │   ├── top-navbar.tsx       # Top bar: search, notifications, avatar
│   │   │   │   ├── bottom-nav.tsx       # Mobile bottom navigation (5 tabs)
│   │   │   │   ├── mesh-background.tsx  # Animated gradient blobs
│   │   │   │   ├── page-header.tsx      # Page title + breadcrumb
│   │   │   │   └── footer.tsx           # Landing page footer
│   │   │   │
│   │   │   └── features/               # ═══ FEATURE-SPECIFIC COMPONENTS ═══
│   │   │       ├── auth/
│   │   │       │   ├── login-form.tsx
│   │   │       │   ├── register-form.tsx
│   │   │       │   └── google-button.tsx
│   │   │       ├── tasks/
│   │   │       │   ├── task-card.tsx
│   │   │       │   ├── task-form.tsx
│   │   │       │   ├── task-filters.tsx
│   │   │       │   └── priority-badge.tsx
│   │   │       ├── quizzes/
│   │   │       │   ├── quiz-card.tsx
│   │   │       │   ├── quiz-question.tsx
│   │   │       │   ├── quiz-timer.tsx
│   │   │       │   ├── quiz-progress.tsx
│   │   │       │   └── quiz-results.tsx
│   │   │       ├── resources/
│   │   │       │   ├── resource-card.tsx
│   │   │       │   ├── resource-filters.tsx
│   │   │       │   └── upload-form.tsx
│   │   │       ├── groups/
│   │   │       │   ├── group-card.tsx
│   │   │       │   ├── group-form.tsx
│   │   │       │   └── member-list.tsx
│   │   │       ├── timer/
│   │   │       │   ├── timer-display.tsx
│   │   │       │   ├── timer-controls.tsx
│   │   │       │   └── session-history.tsx
│   │   │       ├── dashboard/
│   │   │       │   ├── kpi-card.tsx
│   │   │       │   ├── progress-ring-card.tsx
│   │   │       │   ├── weekly-chart.tsx
│   │   │       │   ├── subject-pie-chart.tsx
│   │   │       │   ├── streak-counter.tsx
│   │   │       │   ├── quick-actions.tsx
│   │   │       │   └── activity-feed.tsx
│   │   │       ├── analytics/
│   │   │       │   ├── performance-chart.tsx
│   │   │       │   ├── weak-areas.tsx
│   │   │       │   └── trend-line.tsx
│   │   │       ├── notifications/
│   │   │       │   ├── notification-bell.tsx
│   │   │       │   ├── notification-dropdown.tsx
│   │   │       │   └── notification-item.tsx
│   │   │       └── landing/
│   │   │           ├── hero-section.tsx
│   │   │           ├── features-section.tsx
│   │   │           ├── stats-section.tsx
│   │   │           └── cta-section.tsx
│   │   │
│   │   ├── lib/
│   │   │   ├── api-client.ts            # Axios instance with interceptors (base URL, auth header, error handling)
│   │   │   ├── auth.ts                  # Auth.js v5 config (Google + Credentials providers)
│   │   │   ├── utils.ts                 # cn() = clsx + tailwind-merge, formatDate, formatDuration
│   │   │   ├── constants.ts             # Subjects list, priority levels, resource types
│   │   │   └── query-keys.ts            # TanStack Query key factory
│   │   │
│   │   ├── hooks/
│   │   │   ├── use-tasks.ts             # useTasks, useCreateTask, useUpdateTask, useDeleteTask
│   │   │   ├── use-quizzes.ts           # useQuizzes, useQuiz, useSubmitAttempt
│   │   │   ├── use-resources.ts         # useResources, useUploadResource
│   │   │   ├── use-groups.ts            # useGroups, useJoinGroup, useLeaveGroup
│   │   │   ├── use-analytics.ts         # useDashboard, usePerformance
│   │   │   ├── use-notifications.ts     # useNotifications, useMarkRead
│   │   │   ├── use-timer.ts             # Custom hook bridging Zustand timer store
│   │   │   ├── use-debounce.ts          # Debounced value for search
│   │   │   └── use-media-query.ts       # Responsive breakpoint detection
│   │   │
│   │   ├── stores/
│   │   │   ├── auth-store.ts            # User session state (redundant backup of Auth.js)
│   │   │   ├── timer-store.ts           # Timer: isRunning, elapsed, subject — persisted to localStorage
│   │   │   └── ui-store.ts              # Sidebar collapsed, active modal, mobile nav open
│   │   │
│   │   ├── providers/
│   │   │   ├── query-provider.tsx        # TanStack QueryClientProvider
│   │   │   ├── auth-provider.tsx         # SessionProvider from next-auth
│   │   │   └── toast-provider.tsx        # Toaster from react-hot-toast
│   │   │
│   │   ├── public/
│   │   │   ├── favicon.ico
│   │   │   ├── og-image.png             # Open Graph social preview
│   │   │   └── fonts/                   # Self-hosted Space Grotesk + Inter (if not using Google Fonts CDN)
│   │   │
│   │   ├── tailwind.config.ts
│   │   ├── next.config.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── api/                              # ═══ EXPRESS.JS BACKEND ═══
│       ├── src/
│       │   ├── config/
│       │   │   ├── db.ts                # MongoDB singleton connection
│       │   │   ├── redis.ts             # ioredis client with reconnection strategy
│       │   │   ├── cloudinary.ts        # Cloudinary SDK config
│       │   │   ├── env.ts               # Zod-validated environment variables
│       │   │   └── logger.ts            # Winston logger setup
│       │   │
│       │   ├── models/                  # Mongoose schemas (11 models)
│       │   │   ├── User.ts
│       │   │   ├── Task.ts
│       │   │   ├── Quiz.ts
│       │   │   ├── Question.ts
│       │   │   ├── QuizAttempt.ts
│       │   │   ├── Resource.ts
│       │   │   ├── StudyGroup.ts
│       │   │   ├── Meeting.ts
│       │   │   ├── Challenge.ts
│       │   │   ├── Notification.ts
│       │   │   └── StudySession.ts
│       │   │
│       │   ├── routes/                  # Express route definitions (11 route files)
│       │   │   ├── index.ts             # Route aggregator → /api/v1/*
│       │   │   ├── auth.routes.ts
│       │   │   ├── user.routes.ts
│       │   │   ├── task.routes.ts
│       │   │   ├── quiz.routes.ts
│       │   │   ├── resource.routes.ts
│       │   │   ├── group.routes.ts
│       │   │   ├── meeting.routes.ts
│       │   │   ├── challenge.routes.ts
│       │   │   ├── notification.routes.ts
│       │   │   ├── analytics.routes.ts
│       │   │   └── admin.routes.ts
│       │   │
│       │   ├── controllers/             # Thin controllers (parse request → call service → send response)
│       │   │   ├── auth.controller.ts
│       │   │   ├── user.controller.ts
│       │   │   ├── task.controller.ts
│       │   │   ├── quiz.controller.ts
│       │   │   ├── resource.controller.ts
│       │   │   ├── group.controller.ts
│       │   │   ├── meeting.controller.ts
│       │   │   ├── challenge.controller.ts
│       │   │   ├── notification.controller.ts
│       │   │   ├── analytics.controller.ts
│       │   │   └── admin.controller.ts
│       │   │
│       │   ├── services/                # Business logic layer (all DB queries live here)
│       │   │   ├── auth.service.ts
│       │   │   ├── user.service.ts
│       │   │   ├── task.service.ts
│       │   │   ├── quiz.service.ts
│       │   │   ├── resource.service.ts
│       │   │   ├── group.service.ts
│       │   │   ├── meeting.service.ts
│       │   │   ├── challenge.service.ts
│       │   │   ├── notification.service.ts
│       │   │   ├── analytics.service.ts
│       │   │   ├── cache.service.ts      # Redis cache-aside helper
│       │   │   └── upload.service.ts     # Cloudinary upload/delete logic
│       │   │
│       │   ├── middleware/
│       │   │   ├── auth.middleware.ts     # JWT verification → attach user to req
│       │   │   ├── role.middleware.ts     # Role-based access: requireRole('admin')
│       │   │   ├── rateLimiter.ts        # express-rate-limit + Redis store
│       │   │   ├── validate.ts           # Zod schema validation middleware
│       │   │   ├── upload.ts             # Multer config (memoryStorage, file filter, size limit)
│       │   │   └── errorHandler.ts       # Global error handler (catch-all)
│       │   │
│       │   ├── validators/              # Zod schemas for every endpoint
│       │   │   ├── auth.validator.ts     # registerSchema, loginSchema
│       │   │   ├── task.validator.ts     # createTaskSchema, updateTaskSchema
│       │   │   ├── quiz.validator.ts     # createQuizSchema, submitAttemptSchema
│       │   │   ├── resource.validator.ts
│       │   │   ├── group.validator.ts
│       │   │   └── admin.validator.ts
│       │   │
│       │   ├── jobs/                    # Scheduled tasks (node-cron)
│       │   │   ├── reminder.job.ts       # Every 30 min: scan tasks → create notification if due
│       │   │   └── cleanup.job.ts        # Daily: clean expired tokens, old notifications
│       │   │
│       │   ├── utils/
│       │   │   ├── AppError.ts           # Custom error class with statusCode
│       │   │   ├── catchAsync.ts         # Wraps controller in try/catch
│       │   │   ├── apiResponse.ts        # { success, statusCode, message, data, meta }
│       │   │   ├── pagination.ts         # Pagination helper (page, limit, skip, total)
│       │   │   └── priorityAlgo.ts       # AI Task Prioritization scoring algorithm
│       │   │
│       │   ├── types/
│       │   │   └── express.d.ts          # Extend Express Request with user property
│       │   │
│       │   ├── app.ts                    # Express app: middleware pipeline setup
│       │   └── server.ts                 # Server entry: connect DB, Redis, start listening
│       │
│       ├── tsconfig.json
│       └── package.json
│
├── packages/
│   ├── types/                           # @edu-hub/types — SHARED ACROSS FRONTEND & BACKEND
│   │   ├── src/
│   │   │   ├── user.ts                  # IUser, RegisterDTO, LoginDTO, UserResponse
│   │   │   ├── task.ts                  # ITask, CreateTaskDTO, UpdateTaskDTO, TaskFilters
│   │   │   ├── quiz.ts                  # IQuiz, IQuestion, CreateQuizDTO, SubmitAttemptDTO
│   │   │   ├── resource.ts             # IResource, UploadResourceDTO, ResourceFilters
│   │   │   ├── group.ts                # IStudyGroup, CreateGroupDTO
│   │   │   ├── analytics.ts            # DashboardData, PerformanceData
│   │   │   ├── notification.ts         # INotification, NotificationType
│   │   │   ├── api.ts                  # ApiResponse<T>, PaginatedResponse<T>, ApiError
│   │   │   └── index.ts                # Re-export all types
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── typescript-config/               # Shared tsconfig bases
│   │   ├── base.json                   # Strict mode, ES2022, moduleResolution: bundler
│   │   ├── nextjs.json                 # Extends base + JSX, Next.js plugins
│   │   └── node.json                   # Extends base + Node target
│   │
│   └── eslint-config/                  # Shared ESLint rules
│       ├── base.js
│       ├── next.js
│       └── node.js
│
├── turbo.json                          # Pipeline: build, dev, lint, typecheck
├── pnpm-workspace.yaml                 # workspace: ["apps/*", "packages/*"]
├── .gitignore
├── .env.example                        # Template for all env vars
├── .prettierrc
├── .eslintrc.js
└── README.md
```

### 3.2 System Architecture Diagram

```mermaid
graph TB
    subgraph "Client Layer"
        BR[Browser / Mobile] --> NX["Next.js 15 Frontend<br/>(Vercel Edge Network)"]
    end

    subgraph "Auth Layer"
        NX --> AUTH["Auth.js v5<br/>Google OAuth + Credentials"]
        AUTH -->|OAuth 2.0| GP[Google Identity Platform]
        AUTH -->|JWT Cookie| NX
    end

    subgraph "API Layer (Railway)"
        NX -->|"REST API<br/>Authorization: Bearer JWT"| EX["Express.js API<br/>Node.js Runtime"]
        
        subgraph "Middleware Pipeline"
            M1[helmet] --> M2[cors]
            M2 --> M3[compression]
            M3 --> M4[morgan]
            M4 --> M5[express-mongo-sanitize]
            M5 --> M6[hpp]
            M6 --> M7[cookie-parser]
            M7 --> M8[rate-limiter]
            M8 --> M9[auth.middleware]
            M9 --> M10[validate.middleware]
        end
        
        EX --> M1
        M10 --> CTRL[Controllers]
        CTRL --> SVC[Services Layer]
    end

    subgraph "Data Layer"
        SVC -->|Mongoose ODM| MG[("MongoDB Atlas<br/>11 Collections<br/>25+ Indexes")]
        SVC -->|ioredis| RD[("Redis<br/>Cache · Sessions<br/>Leaderboards · Rate Limits")]
        SVC -->|SDK v2| CL["☁️ Cloudinary<br/>Images · Documents<br/>CDN Delivery"]
    end

    subgraph "Background Jobs"
        CRON["node-cron<br/>Every 30 min"] -->|Scan tasks| SVC
        CRON -->|Create notifications| MG
    end
```

### 3.3 Authentication Flow — Sequence Diagram

```mermaid
sequenceDiagram
    actor U as Student
    participant NX as Next.js (Vercel)
    participant AJ as Auth.js v5
    participant G as Google OAuth
    participant EX as Express API (Railway)
    participant DB as MongoDB
    participant RD as Redis

    Note over U,RD: ═══ GOOGLE SIGN-IN FLOW ═══
    U->>NX: Click "Sign in with Google"
    NX->>AJ: signIn("google")
    AJ->>G: Redirect to Google consent
    G->>U: Show consent screen
    U->>G: Approve
    G->>AJ: Return authorization code
    AJ->>G: Exchange code for tokens
    G->>AJ: Return id_token + access_token
    AJ->>EX: POST /auth/google { googleToken }
    EX->>G: Verify id_token (google-auth-library)
    G->>EX: Return { email, name, picture, sub }
    EX->>DB: findOne({ googleId: sub }) or create new user
    DB->>EX: User document
    EX->>EX: Sign JWT (access 15min + refresh 7d)
    EX->>RD: Store refresh token
    EX->>AJ: Return { accessToken, refreshToken, user }
    AJ->>NX: Set HttpOnly cookies
    NX->>U: Redirect to /dashboard

    Note over U,RD: ═══ AUTHENTICATED API CALL ═══
    U->>NX: Navigate to /tasks
    NX->>NX: Server Component: read session cookie
    NX->>EX: GET /tasks (Authorization: Bearer accessToken)
    EX->>EX: auth.middleware: verify JWT
    EX->>DB: Task.find({ userId })
    DB->>EX: Tasks array
    EX->>NX: { success: true, data: tasks[] }
    NX->>U: Render tasks page

    Note over U,RD: ═══ TOKEN REFRESH ═══
    U->>NX: API call (access token expired)
    NX->>EX: GET /tasks → 401 Unauthorized
    NX->>EX: POST /auth/refresh { refreshToken }
    EX->>RD: Verify refresh token exists
    RD->>EX: Valid
    EX->>EX: Sign new access token + rotate refresh token
    EX->>RD: Store new refresh, delete old
    EX->>NX: { accessToken, refreshToken }
    NX->>EX: Retry original request with new token
```

### 3.4 Data Flow — Redis Cache-Aside Pattern

```mermaid
flowchart TD
    REQ[API Request] --> CHECK{Redis Cache<br/>Hit?}
    CHECK -->|HIT| RET1[Return Cached Data<br/>⚡ ~1ms]
    CHECK -->|MISS| DB[Query MongoDB<br/>⏱️ ~50ms]
    DB --> STORE[Store in Redis<br/>with TTL]
    STORE --> RET2[Return Fresh Data]
    
    MUT[Mutation Request<br/>POST/PATCH/DELETE] --> UPD[Update MongoDB]
    UPD --> INV[Invalidate Redis Keys<br/>del / unlink]
    INV --> ACK[Return Success]
```

---

## 4. Database Design (MongoDB Schemas + Indexes)

### 4.1 Complete Collection Schemas

#### Collection: `users`
```typescript
{
  _id: ObjectId,                    // Auto-generated
  email: string,                    // required, unique, lowercase, trim
  name: string,                     // required, trim, 2-50 chars
  password: string | null,          // bcrypt hash (null for Google-only users)
  avatar: string,                   // Cloudinary URL, default: generated avatar
  googleId: string | null,          // Google OAuth sub ID
  role: "student" | "admin",        // default: "student"
  isActive: boolean,                // default: true (admin can deactivate)
  
  // Gamification
  streak: number,                   // current consecutive study days, default: 0
  longestStreak: number,            // all-time best streak
  totalStudyMinutes: number,        // lifetime study time
  xp: number,                      // experience points
  badges: string[],                 // earned badge names
  
  // Preferences
  subjects: string[],               // subjects of interest
  lastLoginAt: Date,
  
  // Timestamps
  createdAt: Date,                  // auto (timestamps: true)
  updatedAt: Date,                  // auto
  deletedAt: Date | null            // soft delete (null = active)
}

// ═══ INDEXES ═══
{ email: 1 }                        — unique
{ googleId: 1 }                     — unique, sparse (only for Google users)
{ role: 1, isActive: 1, createdAt: -1 }  — admin user listing
{ deletedAt: 1 }                    — soft delete filter
```

#### Collection: `tasks`
```typescript
{
  _id: ObjectId,
  userId: ObjectId,                 // ref → users, required, indexed
  title: string,                    // required, 1-200 chars
  description: string,              // optional, max 1000 chars
  subject: string,                  // e.g. "Physics", "Chemistry", "Combined Maths"
  priority: "low" | "medium" | "high" | "urgent",  // required
  status: "pending" | "in_progress" | "completed",  // default: "pending"
  dueDate: Date,                    // required
  completedAt: Date | null,
  createdAt: Date,
  updatedAt: Date
}

// ═══ INDEXES ═══
{ userId: 1, status: 1, dueDate: 1 }      — student task list (ESR: equality→sort→range)
{ userId: 1, priority: -1, dueDate: 1 }   — AI prioritization query
{ userId: 1, completedAt: -1 }            — completed task history
```

#### Collection: `quizzes`
```typescript
{
  _id: ObjectId,
  title: string,                    // required, 3-200 chars
  description: string,              // optional
  subject: string,                  // required
  lesson: string,                   // required (topic within subject)
  year: number,                     // e.g. 2024, 2023
  difficulty: "easy" | "medium" | "hard",
  questionCount: number,            // auto-calculated from questions
  timeLimit: number,                // minutes (0 = no limit)
  isPublished: boolean,             // default: false (draft until admin publishes)
  totalAttempts: number,            // denormalized counter
  averageScore: number,             // denormalized average
  createdBy: ObjectId,              // ref → users (admin)
  createdAt: Date,
  updatedAt: Date
}

// ═══ INDEXES ═══
{ isPublished: 1, subject: 1, createdAt: -1 }   — public quiz listing
{ subject: 1, lesson: 1, year: -1 }             — filtered browse
{ difficulty: 1, subject: 1 }                    — difficulty filter
{ createdBy: 1 }                                 — admin's quizzes
```

#### Collection: `questions`
```typescript
{
  _id: ObjectId,
  quizId: ObjectId,                 // ref → quizzes, required
  questionText: string,             // required, 5-2000 chars
  image: string | null,             // Cloudinary URL for question images
  options: [
    { label: "A", text: string },
    { label: "B", text: string },
    { label: "C", text: string },
    { label: "D", text: string }
  ],
  correctAnswer: "A" | "B" | "C" | "D",  // required
  explanation: string,              // shown after answer
  order: number,                    // display order in quiz
  createdAt: Date,
  updatedAt: Date
}

// ═══ INDEXES ═══
{ quizId: 1, order: 1 }            — ordered question retrieval (covered query)
```

#### Collection: `quizAttempts`
```typescript
{
  _id: ObjectId,
  userId: ObjectId,                 // ref → users
  quizId: ObjectId,                 // ref → quizzes
  answers: [{
    questionId: ObjectId,
    selected: "A" | "B" | "C" | "D" | null,  // null = skipped
    isCorrect: boolean
  }],
  score: number,                    // percentage (0-100)
  totalCorrect: number,
  totalWrong: number,
  totalSkipped: number,
  totalQuestions: number,
  timeTaken: number,                // seconds
  completedAt: Date,
  createdAt: Date
}

// ═══ INDEXES ═══
{ userId: 1, quizId: 1 }                  — check if user attempted quiz
{ userId: 1, completedAt: -1 }            — recent attempts history
{ quizId: 1, score: -1 }                  — leaderboard (top scores per quiz)
{ userId: 1, "answers.isCorrect": 1 }     — performance aggregation
```

#### Collection: `resources`
```typescript
{
  _id: ObjectId,
  title: string,                    // required, 3-200 chars
  description: string,              // optional, max 500 chars
  subject: string,                  // required
  type: "notes" | "short_notes" | "tutorial" | "past_paper" | "other",
  fileUrl: string,                  // Cloudinary URL
  filePublicId: string,             // Cloudinary public_id (for deletion)
  fileType: string,                 // MIME type: "application/pdf", "image/png", etc.
  fileSize: number,                 // bytes
  thumbnailUrl: string | null,      // Auto-generated preview
  uploadedBy: ObjectId,             // ref → users
  downloads: number,                // default: 0
  status: "pending" | "approved" | "rejected",  // default: "pending"
  reviewedBy: ObjectId | null,      // admin who approved/rejected
  reviewedAt: Date | null,
  createdAt: Date,
  updatedAt: Date,
  deletedAt: Date | null            // soft delete
}

// ═══ INDEXES ═══
{ status: 1, subject: 1, createdAt: -1 }  — browse approved resources
{ uploadedBy: 1, createdAt: -1 }          — "My Uploads"
{ subject: 1, type: 1, downloads: -1 }    — most popular per subject
{ status: 1 }                              — admin pending queue count
```

#### Collection: `studyGroups`
```typescript
{
  _id: ObjectId,
  name: string,                     // required, 3-100 chars
  description: string,              // optional, max 500 chars
  subject: string,                  // required
  createdBy: ObjectId,              // ref → users (group owner)
  members: [{
    userId: ObjectId,               // ref → users
    role: "owner" | "member",
    joinedAt: Date
  }],
  memberCount: number,              // denormalized count
  maxMembers: number,               // default: 20
  isActive: boolean,                // default: true
  createdAt: Date,
  updatedAt: Date
}

// ═══ INDEXES ═══
{ "members.userId": 1 }                   — find user's groups
{ subject: 1, isActive: 1, memberCount: -1 }  — browse popular groups
{ createdBy: 1 }                           — user's created groups
```

#### Collection: `meetings`
```typescript
{
  _id: ObjectId,
  title: string,                    // required
  description: string,              // optional
  groupId: ObjectId | null,         // ref → studyGroups (optional)
  createdBy: ObjectId,              // ref → users
  scheduledAt: Date,                // when the meeting is scheduled
  duration: number,                 // estimated minutes
  zoomLink: string,                 // URL (validated format)
  participants: [ObjectId],         // ref → users
  status: "upcoming" | "ongoing" | "completed" | "cancelled",
  createdAt: Date,
  updatedAt: Date
}

// ═══ INDEXES ═══
{ createdBy: 1, scheduledAt: -1 }          — user's meetings
{ groupId: 1, scheduledAt: -1 }            — group meetings
{ scheduledAt: 1, status: 1 }             — upcoming meetings (for reminders)
```

#### Collection: `studySessions`
```typescript
{
  _id: ObjectId,
  userId: ObjectId,                 // ref → users
  subject: string,                  // required
  duration: number,                 // minutes
  startedAt: Date,
  endedAt: Date,
  createdAt: Date
}

// ═══ INDEXES ═══
{ userId: 1, createdAt: -1 }              — session history
{ userId: 1, subject: 1, createdAt: -1 }  — per-subject analytics
{ userId: 1, startedAt: 1 }              — streak calculation
```

#### Collection: `notifications`
```typescript
{
  _id: ObjectId,
  userId: ObjectId,                 // ref → users
  type: "task_reminder" | "quiz_result" | "group_invite" | "challenge_complete" | "resource_approved" | "system",
  title: string,
  message: string,
  isRead: boolean,                  // default: false
  link: string | null,              // in-app navigation path
  metadata: {                       // optional context
    taskId?: ObjectId,
    quizId?: ObjectId,
    groupId?: ObjectId
  },
  createdAt: Date
}

// ═══ INDEXES ═══
{ userId: 1, isRead: 1, createdAt: -1 }   — unread notifications (most used)
{ createdAt: 1 } TTL: 2592000             — auto-delete after 30 days
```

#### Collection: `challenges`
```typescript
{
  _id: ObjectId,
  title: string,
  description: string,
  type: "quiz_streak" | "study_hours" | "resource_upload" | "group_join",
  target: number,                   // e.g., complete 5 quizzes, study 10 hours
  reward: {
    badge: string,                  // badge name/icon
    xp: number                     // XP points awarded
  },
  startDate: Date,
  endDate: Date,
  participants: [{
    userId: ObjectId,
    progress: number,               // current progress toward target
    completed: boolean,
    completedAt: Date | null
  }],
  participantCount: number,         // denormalized
  isActive: boolean,
  createdBy: ObjectId,              // admin
  createdAt: Date,
  updatedAt: Date
}

// ═══ INDEXES ═══
{ isActive: 1, endDate: 1 }                       — active challenges
{ "participants.userId": 1 }                       — user's challenges
{ isActive: 1, participantCount: -1 }              — popular challenges
```

### 4.2 Redis Architecture — Complete Key Map

| Key Pattern | Data Type | TTL | Purpose | Invalidation Trigger |
|---|---|---|---|---|
| `session:<sessionId>` | Hash | 24h | User session data | Logout, password change |
| `user:<userId>:profile` | JSON String | 1h | Cached user profile | Profile update |
| `quiz:<quizId>:questions` | JSON String | 30min | Quiz with questions | Question edit/add/delete |
| `quiz:<quizId>:leaderboard` | Sorted Set | 15min | Top scores | New quiz attempt |
| `resources:<subject>:<type>:p<page>` | JSON String | 1h | Paginated resource list | Resource upload/approve/delete |
| `notifications:<userId>:unread` | String (count) | 5min | Unread notification count | Mark read, new notification |
| `analytics:<userId>:dashboard` | JSON String | 10min | Dashboard KPI data | Any user activity |
| `ratelimit:<ip>:<endpoint>` | String (count) | 15min | Rate limit counter | Auto-expire |
| `refresh:<userId>:<tokenHash>` | String | 7d | Refresh token whitelist | Logout, rotation |
| `challenge:<challengeId>:participants` | JSON String | 10min | Challenge leaderboard | Progress update |

#### Redis Cache Service Pattern
```typescript
// cache.service.ts — reusable cache-aside helper
class CacheService {
  async getOrSet<T>(key: string, ttlSeconds: number, fetchFn: () => Promise<T>): Promise<T> {
    // 1. Try Redis
    const cached = await redis.get(key);
    if (cached) return JSON.parse(cached);

    // 2. Fetch from MongoDB
    const data = await fetchFn();

    // 3. Store in Redis with TTL + jitter (±10%)
    const jitter = Math.floor(ttlSeconds * 0.1 * (Math.random() * 2 - 1));
    await redis.set(key, JSON.stringify(data), 'EX', ttlSeconds + jitter);

    return data;
  }

  async invalidate(pattern: string): Promise<void> {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) await redis.unlink(...keys);
  }
}
```

### 4.3 Cloudinary Configuration

#### Folder Structure
```
edu-hub/
├── avatars/          # User profile pictures (auto-resize 200x200)
├── resources/        # Uploaded study materials
│   ├── notes/
│   ├── past-papers/
│   └── tutorials/
├── quiz-images/      # Question images
└── misc/             # Other uploads
```

#### Transformation Presets
| Preset | Transformation | Use Case |
|---|---|---|
| `avatar` | `w_200,h_200,c_fill,g_face,q_auto,f_auto` | Profile pictures (face detection crop) |
| `thumbnail` | `w_400,h_300,c_fill,q_auto,f_auto` | Resource card thumbnails |
| `quiz_image` | `w_800,q_auto,f_auto` | Quiz question images (max width 800) |
| `resource_preview` | `pg_1,w_600,h_800,c_fit,q_auto,f_auto` | PDF first-page preview |

#### Upload Flow
```
1. Client: File input → FormData → POST /resources (multipart)
2. Multer: Parse file → memoryStorage (buffer in RAM)
3. Validation: Check MIME type + size (≤10MB)
4. Sharp: Strip EXIF, resize if image > 2000px
5. Cloudinary: stream.end(buffer) → upload to folder
6. MongoDB: Save { fileUrl, filePublicId, fileType, fileSize }
7. Response: Return resource object with URLs
```

---

## 5. API Design — Complete Endpoint Reference

### 5.1 Base Configuration
```
Production:  https://api.eduhub.com/api/v1
Development: http://localhost:5000/api/v1
```

### 5.2 Standardized Response Format
```typescript
// Success Response
{
  "success": true,
  "statusCode": 200,
  "message": "Tasks retrieved successfully",
  "data": { ... } | [ ... ],
  "meta": {                     // only for paginated endpoints
    "page": 1,
    "limit": 20,
    "total": 85,
    "totalPages": 5
  }
}

// Error Response
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Email is required" },
    { "field": "password", "message": "Password must be at least 8 characters" }
  ]
}
```

### 5.3 Complete Endpoint Map with Request/Response Bodies

---

#### 🔐 Auth Endpoints

**POST `/auth/register`** — Register new student
```typescript
// Request Body (Zod: registerSchema)
{
  name: string,           // min 2, max 50
  email: string,          // valid email, lowercase
  password: string        // min 8, 1 uppercase, 1 number
}
// Response: { user: UserResponse, accessToken, refreshToken }
// Rate Limit: 5 requests / 15 min per IP
```

**POST `/auth/login`** — Login with credentials
```typescript
// Request Body (Zod: loginSchema)
{
  email: string,
  password: string
}
// Response: { user: UserResponse, accessToken, refreshToken }
// Rate Limit: 5 requests / 15 min per IP
```

**POST `/auth/google`** — Google OAuth token exchange
```typescript
// Request Body
{ googleToken: string }   // ID token from Google
// Response: { user: UserResponse, accessToken, refreshToken }
```

**POST `/auth/refresh`** — Refresh access token
```typescript
// Request: Cookie or Body { refreshToken: string }
// Response: { accessToken, refreshToken }
```

**POST `/auth/logout`** — Logout (invalidate tokens)
```typescript
// Auth: Required
// Response: { message: "Logged out successfully" }
// Side effect: Delete refresh token from Redis
```

---

#### ✅ Task Endpoints

**GET `/tasks`** — Get user's tasks with filters
```typescript
// Query Params
{
  status?: "pending" | "in_progress" | "completed",
  priority?: "low" | "medium" | "high" | "urgent",
  subject?: string,
  sort?: "dueDate" | "priority" | "createdAt",   // default: "dueDate"
  order?: "asc" | "desc",                         // default: "asc"
  page?: number,                                   // default: 1
  limit?: number                                   // default: 20, max: 50
}
// Response: { data: Task[], meta: PaginationMeta }
```

**POST `/tasks`** — Create new task
```typescript
// Request Body (Zod: createTaskSchema)
{
  title: string,          // required, 1-200
  description?: string,   // max 1000
  subject: string,        // required
  priority: "low" | "medium" | "high" | "urgent",
  dueDate: string         // ISO 8601 date
}
// Response: { data: Task }
// Side effect: Invalidate tasks cache
```

**PATCH `/tasks/:id`** — Update task
```typescript
// Request Body (Zod: updateTaskSchema — all optional)
{
  title?: string,
  description?: string,
  subject?: string,
  priority?: string,
  status?: string,
  dueDate?: string
}
// Response: { data: Task }
// Note: If status → "completed", auto-set completedAt = now()
```

**DELETE `/tasks/:id`** — Delete task
```typescript
// Auth: Owner only (userId must match)
// Response: { message: "Task deleted" }
```

**GET `/tasks/prioritized`** — Get AI-prioritized task list
```typescript
// Response: { data: PrioritizedTask[] }
// PrioritizedTask extends Task with:
//   priorityScore: number (0-100)
//   urgencyLabel: "🔴 Do First" | "🟡 Schedule" | "🟢 Later"
// Algorithm runs in-memory on pending tasks (no caching — always fresh)
```

---

#### 📝 Quiz Endpoints

**GET `/quizzes`** — List published quizzes
```typescript
// Query Params
{
  subject?: string,
  lesson?: string,
  difficulty?: "easy" | "medium" | "hard",
  year?: number,
  search?: string,         // title search
  sort?: "newest" | "popular" | "difficulty",
  page?: number,
  limit?: number
}
// Response: { data: Quiz[], meta }
// Redis cached: resources:<subject>:quizzes:p<page> — 30min TTL
```

**GET `/quizzes/:id`** — Get quiz with questions
```typescript
// Response: { data: { quiz: Quiz, questions: Question[] } }
// Note: correctAnswer and explanation HIDDEN during attempt
// Redis cached: quiz:<id>:questions — 30min TTL
```

**POST `/quizzes/:id/attempt`** — Submit quiz attempt
```typescript
// Request Body (Zod: submitAttemptSchema)
{
  answers: [{
    questionId: string,
    selected: "A" | "B" | "C" | "D" | null
  }],
  timeTaken: number         // seconds
}
// Response: { data: QuizAttemptResult }
// QuizAttemptResult: { score, totalCorrect, totalWrong, totalSkipped, review: QuestionReview[] }
// Side effects:
//   1. Calculate score server-side
//   2. Save QuizAttempt document
//   3. Update quiz.totalAttempts and quiz.averageScore
//   4. Update leaderboard sorted set in Redis
//   5. Check challenge progress
//   6. Create notification (quiz_result)
```

**GET `/quizzes/:id/leaderboard`** — Quiz leaderboard (top 50)
```typescript
// Response: { data: [{ userId, name, avatar, score, timeTaken, rank }] }
// Source: Redis sorted set (ZREVRANGE) → fallback to MongoDB aggregation
```

---

#### 📚 Resource Endpoints

**GET `/resources`** — List approved resources
```typescript
// Query Params
{
  subject?: string,
  type?: "notes" | "short_notes" | "tutorial" | "past_paper",
  search?: string,
  sort?: "newest" | "downloads",
  page?: number,
  limit?: number
}
// Response: { data: Resource[], meta }
```

**POST `/resources`** — Upload new resource
```typescript
// Content-Type: multipart/form-data
// Fields: title, description, subject, type
// File: file (max 10MB, PDF/DOCX/PPTX/JPG/PNG/WEBP)
// Response: { data: Resource }   // status: "pending"
// Side effect: Upload to Cloudinary → save URL in MongoDB
```

**GET `/resources/:id/download`** — Download resource
```typescript
// Response: Redirect to Cloudinary URL (or proxy download)
// Side effect: Increment downloads counter
```

**GET `/resources/mine`** — Get user's uploads
```typescript
// Response: { data: Resource[] }   // includes all statuses
```

---

#### 👥 Group & Meeting Endpoints

**GET `/groups`** — List study groups
```typescript
// Query Params: { subject?, search?, page?, limit? }
// Response: { data: StudyGroup[], meta }
```

**POST `/groups`** — Create study group
```typescript
// Request Body: { name, description, subject, maxMembers? }
// Response: { data: StudyGroup }
// Side effect: Creator auto-added as owner member
```

**POST `/groups/:id/join`** — Join group
```typescript
// Auth: Student
// Validation: Check maxMembers not exceeded, not already member
// Response: { data: StudyGroup }
```

**POST `/groups/:id/leave`** — Leave group
```typescript
// Auth: Student (not owner)
// Response: { message: "Left group" }
```

**DELETE `/groups/:id/members/:userId`** — Remove member (owner only)
```typescript
// Auth: Group owner
// Response: { message: "Member removed" }
```

**POST `/meetings`** — Schedule meeting
```typescript
// Request Body: { title, description?, groupId?, scheduledAt, duration, zoomLink }
// Response: { data: Meeting }
// Side effect: Create reminder notification for 30min before
```

**GET `/meetings`** — Get user's upcoming meetings
```typescript
// Response: { data: Meeting[] }
```

---

#### 📊 Analytics Endpoints

**GET `/analytics/dashboard`** — Student dashboard KPIs
```typescript
// Response:
{
  data: {
    tasksCompletedThisWeek: number,
    studyHoursThisWeek: number,
    quizzesTakenThisWeek: number,
    averageScore: number,
    overallTaskCompletion: number,     // percentage
    currentStreak: number,
    recentActivity: Activity[],        // last 5
    weeklyStudyHours: { day: string, hours: number }[]  // Mon-Sun
  }
}
// Redis cached: analytics:<userId>:dashboard — 10min TTL
```

**GET `/analytics/performance`** — Subject-wise performance
```typescript
// Response:
{
  data: {
    subjectScores: [{ subject: string, avgScore: number, totalAttempts: number }],
    weakAreas: string[],               // subjects with avg < 50%
    strongAreas: string[],             // subjects with avg > 75%
    recentAttempts: QuizAttemptSummary[],  // last 10
    trendData: [{ date: string, avgScore: number }]  // weekly averages
  }
}
```

**GET `/analytics/streaks`** — Streak data
```typescript
// Response:
{
  data: {
    currentStreak: number,
    longestStreak: number,
    studyCalendar: [{ date: string, studied: boolean }]  // last 90 days
  }
}
```

---

#### 🔔 Notification Endpoints

**GET `/notifications`** — Get user's notifications
```typescript
// Query Params: { page?, limit?, unreadOnly?: boolean }
// Response: { data: Notification[], meta, unreadCount: number }
```

**PATCH `/notifications/:id/read`** — Mark one as read
**PATCH `/notifications/read-all`** — Mark all as read

---

#### 🛡️ Admin Endpoints

**GET `/admin/dashboard`** — Platform statistics
```typescript
// Response:
{
  data: {
    totalUsers: number,
    activeUsersLast7d: number,
    totalQuizzes: number,
    totalResources: number,
    pendingResources: number,
    newRegistrations: [{ date, count }],  // last 30 days
    topSubjects: [{ subject, quizCount }],
    recentActivity: Activity[]             // last 10 platform actions
  }
}
```

**GET `/admin/users`** — List all users (paginated, searchable)
**PATCH `/admin/users/:id/status`** — Activate/deactivate user
**GET `/admin/resources`** — List resources (all statuses)
**PATCH `/admin/resources/:id/review`** — Approve/reject resource
**DELETE `/admin/resources/:id`** — Delete resource

**POST `/admin/quizzes`** — Create quiz
**PATCH `/admin/quizzes/:id`** — Update quiz
**DELETE `/admin/quizzes/:id`** — Delete quiz
**POST `/admin/quizzes/:id/questions`** — Add question to quiz
**PATCH `/admin/questions/:id`** — Update question
**DELETE `/admin/questions/:id`** — Delete question
**PATCH `/admin/quizzes/:id/publish`** — Publish/unpublish quiz

**POST `/admin/challenges`** — Create challenge
**PATCH `/admin/challenges/:id`** — Update challenge
**GET `/admin/challenges/:id/participants`** — View participants

**GET `/admin/reports`** — Generate reports
```typescript
// Query Params: { type: "users" | "resources" | "quizzes", period: "7d" | "30d" | "90d" | "custom", startDate?, endDate?, format?: "json" | "csv" }
```

---

### 5.4 Express Middleware Pipeline — Execution Order

```typescript
// app.ts — middleware registration order matters!

// 1. Security headers (first — before any response)
app.use(helmet({
  contentSecurityPolicy: { directives: { defaultSrc: ["'self'"], imgSrc: ["'self'", "res.cloudinary.com"] }},
  crossOriginEmbedderPolicy: false
}));

// 2. CORS (before routes — reject bad origins early)
app.use(cors({
  origin: process.env.CORS_ORIGIN,      // "https://eduhub.vercel.app"
  credentials: true,                     // allow cookies
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 3. Compression (gzip responses)
app.use(compression());

// 4. Request logging
app.use(morgan('combined', { stream: winstonStream }));

// 5. Body parsers
app.use(express.json({ limit: '10kb' }));           // prevent large JSON payloads
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 6. Cookie parser
app.use(cookieParser());

// 7. Security: NoSQL injection prevention
app.use(mongoSanitize());

// 8. Security: HTTP parameter pollution
app.use(hpp());

// 9. Global rate limiter (100 req / 15 min)
app.use(globalRateLimiter);

// 10. API routes
app.use('/api/v1', routes);

// 11. 404 handler
app.all('*', (req, res, next) => next(new AppError('Route not found', 404)));

// 12. Global error handler (MUST be last)
app.use(errorHandler);
```

---

## 6. Design System — Dark Blue + Silver (Complete)

### 6.1 Full CSS Custom Properties

```css
:root {
  /* ═══════════════════════════════════════════════════
     EDU HUB — DARK BLUE + SILVER DESIGN TOKENS
     ═══════════════════════════════════════════════════ */

  /* ── BACKGROUNDS ── */
  --bg-primary:        #0A0E1A;   /* Deep navy-black (main app bg) */
  --bg-secondary:      #0F1629;   /* Sidebar, panels */
  --bg-tertiary:       #151D33;   /* Card backgrounds */
  --bg-elevated:       #1A2340;   /* Elevated surfaces, hover states */
  --bg-surface:        #1E2A4A;   /* Active/selected states */
  --bg-input:          #111827;   /* Form input backgrounds */

  /* ── TEXT ── */
  --text-primary:      #E8ECF4;   /* Primary text (NOT pure white — reduces halation) */
  --text-secondary:    #94A3B8;   /* Secondary/muted text */
  --text-tertiary:     #64748B;   /* Disabled/placeholder text */
  --text-inverse:      #0A0E1A;   /* Text on light/accent backgrounds */

  /* ── SILVER ACCENT SCALE ── */
  --silver-50:         #F8FAFC;
  --silver-100:        #E8ECF4;
  --silver-200:        #CBD5E1;
  --silver-300:        #94A3B8;
  --silver-400:        #64748B;
  --silver-500:        #475569;

  /* ── BRAND BLUE SCALE ── */
  --blue-50:           #EFF6FF;
  --blue-100:          #DBEAFE;
  --blue-200:          #BFDBFE;
  --blue-300:          #93C5FD;
  --blue-400:          #60A5FA;   /* Links, interactive elements */
  --blue-500:          #3B82F6;   /* Primary brand blue */
  --blue-600:          #2563EB;   /* CTA buttons */
  --blue-700:          #1D4ED8;   /* CTA hover */
  --blue-800:          #1E40AF;
  --blue-900:          #1E3A8A;

  /* ── SEMANTIC COLORS ── */
  --accent-cyan:       #06B6D4;   /* Progress bars, achievements */
  --accent-green:      #10B981;   /* Success, correct answers */
  --accent-gold:       #F59E0B;   /* Badges, streaks, XP */
  --accent-red:        #EF4444;   /* Errors, wrong answers */
  --accent-purple:     #8B5CF6;   /* Special highlights */

  /* ── GLOW VARIANTS ── */
  --glow-blue:         rgba(59, 130, 246, 0.25);
  --glow-cyan:         rgba(6, 182, 212, 0.25);
  --glow-green:        rgba(16, 185, 129, 0.2);
  --glow-gold:         rgba(245, 158, 11, 0.2);
  --glow-red:          rgba(239, 68, 68, 0.2);

  /* ── BORDERS ── */
  --border-subtle:     rgba(148, 163, 184, 0.08);
  --border-default:    rgba(148, 163, 184, 0.15);
  --border-strong:     rgba(148, 163, 184, 0.25);
  --border-accent:     rgba(59, 130, 246, 0.5);

  /* ── SHADOWS ── */
  --shadow-sm:         0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md:         0 4px 12px rgba(0, 0, 0, 0.4);
  --shadow-lg:         0 8px 32px rgba(0, 0, 0, 0.5);
  --shadow-xl:         0 16px 48px rgba(0, 0, 0, 0.6);
  --shadow-glow-blue:  0 0 40px -10px rgba(59, 130, 246, 0.35);
  --shadow-glow-cyan:  0 0 40px -10px rgba(6, 182, 212, 0.3);

  /* ── GLASSMORPHISM ── */
  --glass-bg:          rgba(15, 22, 41, 0.65);
  --glass-bg-dense:    rgba(15, 22, 41, 0.85);
  --glass-border:      rgba(255, 255, 255, 0.08);
  --glass-border-hover: rgba(59, 130, 246, 0.2);
  --glass-blur:        16px;

  /* ── RADII ── */
  --radius-sm:         6px;
  --radius-md:         10px;
  --radius-lg:         16px;
  --radius-xl:         24px;
  --radius-full:       9999px;

  /* ── TYPOGRAPHY ── */
  --font-display:      'Space Grotesk', system-ui, sans-serif;
  --font-body:         'Inter', system-ui, sans-serif;
  --font-mono:         'JetBrains Mono', monospace;

  /* ── SPACING (4px base) ── */
  --space-1: 4px;  --space-2: 8px;   --space-3: 12px;
  --space-4: 16px; --space-5: 20px;  --space-6: 24px;
  --space-8: 32px; --space-10: 40px; --space-12: 48px;
  --space-16: 64px; --space-20: 80px;

  /* ── TRANSITIONS ── */
  --ease-out-expo:     cubic-bezier(0.16, 1, 0.3, 1);
  --ease-spring:       cubic-bezier(0.34, 1.56, 0.64, 1);
  --duration-fast:     150ms;
  --duration-normal:   300ms;
  --duration-slow:     500ms;

  /* ── Z-INDEX SCALE ── */
  --z-dropdown:  50;
  --z-sticky:    100;
  --z-overlay:   200;
  --z-modal:     300;
  --z-toast:     400;
}
```

### 6.2 Component CSS Patterns

#### Glassmorphism Card (with hover glow)
```css
.glass-card {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  transition: all var(--duration-normal) var(--ease-out-expo);
}
.glass-card:hover {
  border-color: var(--glass-border-hover);
  box-shadow: var(--shadow-glow-blue);
  transform: translateY(-2px);
}
```

#### Animated Mesh Background
```css
.mesh-background {
  position: fixed; inset: 0; z-index: -1;
  background-color: var(--bg-primary);
  overflow: hidden;
}
.mesh-background::before,
.mesh-background::after {
  content: ""; position: absolute;
  width: 600px; height: 600px;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.3;
  mix-blend-mode: screen;
  will-change: transform;
}
.mesh-background::before {
  background: radial-gradient(circle, var(--blue-500) 0%, transparent 70%);
  top: -10%; left: 10%;
  animation: meshBlob1 25s ease-in-out infinite alternate;
}
.mesh-background::after {
  background: radial-gradient(circle, var(--accent-cyan) 0%, transparent 70%);
  bottom: -10%; right: 10%;
  animation: meshBlob2 25s ease-in-out infinite alternate;
}
@keyframes meshBlob1 {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(120px, 80px) scale(1.2); }
  100% { transform: translate(-80px, 150px) scale(0.9); }
}
@keyframes meshBlob2 {
  0% { transform: translate(0, 0) scale(1.1); }
  50% { transform: translate(-100px, -120px) scale(0.8); }
  100% { transform: translate(140px, 60px) scale(1.1); }
}

/* Reduced motion safety */
@media (prefers-reduced-motion: reduce) {
  .mesh-background::before,
  .mesh-background::after {
    animation: none;
  }
}
```

#### Gradient Text Shimmer
```css
.gradient-text {
  background: linear-gradient(135deg, var(--blue-400), var(--accent-cyan), var(--blue-500));
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: textShimmer 4s linear infinite;
}
@keyframes textShimmer {
  0% { background-position: 0% center; }
  100% { background-position: 200% center; }
}
```

#### Border Sweep Animation (Premium cards)
```css
@property --angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
.border-sweep {
  position: relative; border-radius: var(--radius-lg);
  background: var(--bg-tertiary); padding: 1px;
}
.border-sweep::before {
  content: ""; position: absolute; inset: -1px;
  border-radius: inherit;
  background: conic-gradient(from var(--angle), transparent 70%, var(--blue-500) 90%, var(--accent-cyan) 100%);
  animation: sweep 4s linear infinite;
  z-index: -1;
}
@keyframes sweep { to { --angle: 360deg; } }
```

### 6.3 Page-by-Page Wireframe Descriptions

#### Screen 1: Landing Page
```
┌──────────────────────────────────────────────────────┐
│ [Navbar] Logo: "Edu Hub" | Links: Features, About   │
│           | [Sign In] [Get Started ▸] (glowing CTA)  │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ░░ MESH GRADIENT BACKGROUND (animated blobs) ░░     │
│                                                      │
│  [HERO SECTION]                                      │
│  "Master Your Studies"  ← gradient text shimmer      │
│  "with AI-Powered Learning"                          │
│  Subtitle: "Smart tasks, MCQ challenges..."          │
│  [Start Learning Free ▸]  [Watch Demo ▸]             │
│                                                      │
│  ┌──────┐  ┌──────┐  ┌──────┐  ← floating 3D cards  │
│  │📊    │  │📝    │  │⏱️    │    (3D tilt on hover)  │
│  │ 1000+│  │ AI   │  │Smart │                        │
│  │ MCQs │  │Tasks │  │Timer │                        │
│  └──────┘  └──────┘  └──────┘                        │
├──────────────────────────────────────────────────────┤
│ [FEATURES SECTION] — 6 glass cards in bento grid     │
│  Each card: icon + title + description               │
│  Hover: border-sweep animation + lift                │
├──────────────────────────────────────────────────────┤
│ [STATS SECTION] — counter animation on scroll        │
│  "500+ Students" | "1000+ MCQs" | "50+ Subjects"    │
├──────────────────────────────────────────────────────┤
│ [CTA SECTION] — dark glass card with glow border     │
│  "Ready to ace your A/Ls?" [Join Edu Hub ▸]          │
├──────────────────────────────────────────────────────┤
│ [Footer] Links, copyright, social icons              │
└──────────────────────────────────────────────────────┘
```

#### Screen 2: Login / Register
```
┌──────────────────────────────────────────────────────┐
│  ░░ MESH GRADIENT BACKGROUND ░░                      │
│                                                      │
│        ┌─────────────────────────────┐               │
│        │  GLASS CARD (centered)      │               │
│        │                             │               │
│        │  Logo + "Welcome Back"      │               │
│        │                             │               │
│        │  [🔵 Continue with Google]  │  ← full width │
│        │                             │               │
│        │  ──── or ────               │               │
│        │                             │               │
│        │  Email:    [____________]   │               │
│        │  Password: [____________]   │               │
│        │                             │               │
│        │  [Sign In ▸]  (full width)  │               │
│        │                             │               │
│        │  Don't have an account?     │               │
│        │  → Register                 │               │
│        └─────────────────────────────┘               │
└──────────────────────────────────────────────────────┘
```

#### Screen 3: Student Dashboard
```
┌────────────┬─────────────────────────────────────────┐
│ SIDEBAR    │ TOP NAVBAR: Search | 🔔(3) | Avatar ▾   │
│ (240px)    ├─────────────────────────────────────────┤
│            │                                         │
│ 🏠 Dashboard│ [KPI CARDS — 4 glass cards in row]     │
│ ✅ Tasks    │ ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│ ⏱️ Timer   │ │ Tasks ✓  │ │ Study   │ │ Quizzes │   │
│ 📝 Quizzes │ │ 12 done  │ │ 8.5 hrs │ │ 5 taken │   │
│ 📚 Resources│ │ this week│ │this week│ │ avg 72% │   │
│ 👥 Groups  │ └─────────┘ └─────────┘ └─────────┘   │
│ 📊 Analytics│                                        │
│ 🔔 Notifs  │ [BENTO GRID — 2 rows]                  │
│            │ ┌──────────────────┐ ┌────────────┐    │
│ ─────      │ │ PROGRESS RING    │ │ STREAK 🔥  │    │
│ 👤 Profile │ │ 68% tasks done   │ │ 7 days     │    │
│ 🚪 Logout  │ │ (animated SVG)   │ │ (fire anim)│    │
│            │ └──────────────────┘ └────────────┘    │
│            │ ┌──────────────────┐ ┌────────────┐    │
│            │ │ WEEKLY STUDY HRS │ │ QUICK      │    │
│            │ │ (bar chart)      │ │ ACTIONS    │    │
│            │ │ Mon-Sun          │ │ ▸Start Timer│    │
│            │ └──────────────────┘ │ ▸Take Quiz │    │
│            │                      │ ▸Add Task  │    │
│            │ [RECENT ACTIVITY]    └────────────┘    │
│            │ • Completed "Physics Ch.5" — 2h ago    │
│            │ • Scored 85% on Chemistry Quiz — 5h ago│
└────────────┴─────────────────────────────────────────┘

MOBILE (< 640px):
┌─────────────────────────┐
│ TOP: Logo | 🔔 | Avatar  │
├─────────────────────────┤
│ KPI cards (horizontal   │
│ scroll, snap)           │
├─────────────────────────┤
│ Progress ring (full w)  │
├─────────────────────────┤
│ Weekly chart (full w)   │
├─────────────────────────┤
│ Quick actions (grid 2x2)│
├─────────────────────────┤
│ Recent activity         │
├─────────────────────────┤
│ [🏠] [✅] [⏱️] [📝] [⋯] │ ← Bottom nav (fixed)
└─────────────────────────┘
```

#### Screen 4: Task Manager
```
Desktop:
┌────────────┬─────────────────────────────────────────┐
│ SIDEBAR    │ Page Header: "My Tasks"  [+ Add Task]   │
│            ├─────────────────────────────────────────┤
│            │ [FILTERS BAR]                           │
│            │ Status: [All ▾] Priority: [All ▾]       │
│            │ Subject: [All ▾] Sort: [Due Date ▾]     │
│            │ View: [📋 List] [🧠 Smart Priority]     │
│            ├─────────────────────────────────────────┤
│            │ ┌───────────────────────────────────┐   │
│            │ │ 🔴 URGENT │ Physics Ch.7 Notes    │   │
│            │ │ Due: Tomorrow │ In Progress       │   │
│            │ │ Score: 95/100 ████████████░        │   │
│            │ └───────────────────────────────────┘   │
│            │ ┌───────────────────────────────────┐   │
│            │ │ 🟡 HIGH │ Chemistry Lab Report    │   │
│            │ │ Due: Jun 25 │ Pending             │   │
│            │ └───────────────────────────────────┘   │
│            │ ... more task cards ...                 │
└────────────┴─────────────────────────────────────────┘

[+ Add Task] opens Modal:
┌─────────────────────────────┐
│ Create New Task        [✕]  │
│                             │
│ Title: [__________________] │
│ Subject: [Physics       ▾]  │
│ Priority: ○Low ○Med ●High  │
│ Due Date: [📅 Pick date  ]  │
│ Description: [____________] │
│             [____________]  │
│                             │
│ [Cancel]  [Create Task ▸]   │
└─────────────────────────────┘
```

#### Screen 5: Quiz Attempt
```
┌─────────────────────────────────────────┐
│ Quiz: "Physics 2024 MCQ"    ⏱️ 12:34    │
│ ████████░░░░░░░░░░░░  Question 5 of 20  │
├─────────────────────────────────────────┤
│                                         │
│  Q5. What is the unit of force?         │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ A) Joule                        │    │
│  └─────────────────────────────────┘    │
│  ┌─────────────────────────────────┐    │
│  │ B) Newton              ✓ SELECTED│   │  ← blue border + glow
│  └─────────────────────────────────┘    │
│  ┌─────────────────────────────────┐    │
│  │ C) Watt                         │    │
│  └─────────────────────────────────┘    │
│  ┌─────────────────────────────────┐    │
│  │ D) Pascal                       │    │
│  └─────────────────────────────────┘    │
│                                         │
│  [🚩 Flag]                              │
│                                         │
│  [◀ Previous]              [Next ▶]     │
│                                         │
│  [Submit Quiz]  (appears on last Q)     │
└─────────────────────────────────────────┘
```

---

## 7. Security Architecture — 12 Layers of Defense

| # | Layer | Implementation | Package/Config |
|---|-------|----------------|----------------|
| 1 | **HTTPS** | Enforced by Vercel + Railway (TLS termination) | Platform-level |
| 2 | **Security Headers** | XSS protection, clickjacking, HSTS, CSP, CORP | `helmet` |
| 3 | **CORS** | Whitelist `eduhub.vercel.app` only, `credentials: true` | `cors` |
| 4 | **Rate Limiting** | Auth: 5/15min, General: 100/15min, File upload: 10/15min | `express-rate-limit` + `rate-limit-redis` |
| 5 | **Authentication** | JWT in HttpOnly Secure SameSite=Strict cookies | `jsonwebtoken` + `cookie-parser` |
| 6 | **Token Strategy** | Access (15min) + Refresh (7d, rotating, Redis-backed) | Custom + `ioredis` |
| 7 | **Input Validation** | Zod schemas on EVERY request body, params, and query | `zod` |
| 8 | **NoSQL Injection** | Strip `$` and `.` operators from user input | `express-mongo-sanitize` |
| 9 | **HPP** | Prevent duplicate query parameter pollution | `hpp` |
| 10 | **Password Security** | bcrypt (12 salt rounds), min 8 chars, complexity rules | `bcryptjs` |
| 11 | **File Upload Safety** | MIME type filter, 10MB limit, EXIF stripping, Cloudinary virus scan | `multer` + `sharp` + `cloudinary` |
| 12 | **Soft Deletes** | Never hard-delete user data; `deletedAt` timestamp pattern | Mongoose middleware |

---

## 8. Performance Optimization

### 8.1 Core Web Vitals Targets

| Metric | Target | Strategy |
|---|---|---|
| **LCP** (Largest Contentful Paint) | < 2.5s | Next.js `<Image>` with `priority`, self-hosted fonts, RSC |
| **FID** (First Input Delay) | < 100ms | Minimal client JS, code splitting, `"use client"` only when needed |
| **CLS** (Cumulative Layout Shift) | < 0.1 | Explicit dimensions on images, skeleton loaders, font `size-adjust` |
| **TTFB** (Time to First Byte) | < 800ms | Vercel Edge, ISR for static pages, Redis caching |
| **Bundle Size** | < 150KB (first load JS) | Tree-shaking, dynamic imports, barrel file elimination |

### 8.2 Optimization Checklist

| Area | Technique |
|---|---|
| **Images** | Next.js `<Image>` with `sizes`, Cloudinary `f_auto,q_auto`, lazy loading below fold |
| **Fonts** | Self-host Space Grotesk + Inter, `font-display: swap`, `next/font` |
| **Code Splitting** | Dynamic imports for modals, charts, heavy components |
| **RSC** | Default to Server Components; `"use client"` only for interactivity |
| **Data Fetching** | TanStack Query with `staleTime: 5min`, `gcTime: 30min`, prefetch on hover |
| **API** | Redis cache-aside on read-heavy endpoints, gzip compression, pagination |
| **DB** | Compound indexes (ESR rule), `lean()` for read queries, projection (select fields) |
| **Animations** | `will-change: transform` only on animated elements, `transform` only (no layout) |
| **Mobile** | Disable heavy blur on low-power devices, reduce mesh blob count |

---

## 9. SEO & Accessibility

### 9.1 SEO
- `<title>` and `<meta description>` on every page via Next.js `metadata` API
- Open Graph tags for social sharing (`og:title`, `og:image`, `og:description`)
- Structured data (JSON-LD): `WebSite`, `Organization`, `FAQPage` on landing
- Sitemap via `next-sitemap` package
- Canonical URLs on all pages
- `robots.txt` with proper crawl directives

### 9.2 Accessibility (WCAG 2.1 AA)
- All interactive elements: min 44×44px touch target
- Focus visible rings on all focusable elements (`outline: 2px solid var(--blue-400)`)
- ARIA labels on icon-only buttons
- Keyboard navigation: `Tab`, `Enter`, `Escape` for all modals and dropdowns
- Color contrast ratio ≥ 4.5:1 for text (verified with Silver `#94A3B8` on `#0A0E1A` = 7.1:1 ✅)
- `role="alert"` on toast notifications
- `aria-live="polite"` on dynamic content (notification count, timer)
- Skip-to-content link
- Radix UI primitives handle ARIA automatically for modals, tabs, dropdowns

---

## 10. Error Handling

### Custom Error Class
```typescript
class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;  // expected errors (vs programming bugs)
  }
}

// Usage
throw new AppError('Task not found', 404);
throw new AppError('You are not authorized', 403);
throw new AppError('Email already registered', 409);
```

### Global Error Handler
```typescript
// Handles: AppError, Mongoose ValidationError, Mongoose CastError, JWT errors, Multer errors
// Production: send { success: false, message } — no stack traces
// Development: send full error + stack trace
```

---

## 11. Testing Strategy

| Type | Tool | Coverage Target | What We Test |
|---|---|---|---|
| **Unit Tests** | Vitest | 80% services | Business logic: prioritization algo, score calculation, validators |
| **Integration Tests** | Vitest + Supertest | Key API flows | Auth flow, CRUD operations, middleware pipeline |
| **E2E Tests** | Playwright | Critical paths | Login → dashboard, quiz attempt → results, resource upload |
| **Type Checking** | `tsc --noEmit` | 100% | Full type coverage across monorepo |
| **Lint** | ESLint | 0 errors | Code quality, import order, unused vars |

---

## 12. Deployment Configuration

### 12.1 Vercel (Frontend)
```json
// vercel.json
{
  "buildCommand": "pnpm turbo build --filter=web",
  "outputDirectory": "apps/web/.next",
  "installCommand": "pnpm install",
  "framework": "nextjs"
}
```

### 12.2 Railway (Backend)
```toml
# railway.toml
[build]
builder = "nixpacks"
buildCommand = "pnpm install && pnpm turbo build --filter=api"
watchPatterns = ["apps/api/**", "packages/**"]

[deploy]
startCommand = "node apps/api/dist/server.js"
healthcheckPath = "/api/v1/health"
restartPolicyType = "ON_FAILURE"
```

### 12.3 Environment Variables Summary

| Variable | Where | Value |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Vercel | `https://api-eduhub.up.railway.app/api/v1` |
| `AUTH_SECRET` | Vercel | Random 32+ char secret |
| `AUTH_GOOGLE_ID` | Vercel | Google Cloud Console Client ID |
| `AUTH_GOOGLE_SECRET` | Vercel | Google Cloud Console Client Secret |
| `AUTH_URL` | Vercel | `https://eduhub.vercel.app` |
| `PORT` | Railway | `5000` (auto-detected) |
| `NODE_ENV` | Railway | `production` |
| `MONGODB_URI` | Railway | `mongodb+srv://user:pass@cluster.mongodb.net/eduhub` |
| `REDIS_URL` | Railway | Auto-injected by Redis add-on |
| `JWT_SECRET` | Railway | Random 64+ char secret |
| `JWT_REFRESH_SECRET` | Railway | Different random 64+ char secret |
| `JWT_ACCESS_EXPIRY` | Railway | `15m` |
| `JWT_REFRESH_EXPIRY` | Railway | `7d` |
| `CLOUDINARY_CLOUD_NAME` | Railway | From Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | Railway | From Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | Railway | From Cloudinary dashboard |
| `CORS_ORIGIN` | Railway | `https://eduhub.vercel.app` |

---

## 13. Phased Implementation Roadmap (Detailed)

### Phase 1 — Foundation (Week 1–2)

**Week 1: Scaffolding & Infrastructure**
- [ ] Day 1: Initialize Turborepo monorepo, configure pnpm workspaces
- [ ] Day 1: Create `packages/types`, `packages/typescript-config`, `packages/eslint-config`
- [ ] Day 2: Scaffold Next.js 15 app (`apps/web`) with App Router
- [ ] Day 2: Configure Tailwind v4, setup `globals.css` with all design tokens
- [ ] Day 2: Install + configure fonts (Space Grotesk, Inter)
- [ ] Day 3: Scaffold Express.js app (`apps/api`) with TypeScript
- [ ] Day 3: Setup middleware pipeline (helmet, cors, rate-limit, etc.)
- [ ] Day 3: MongoDB connection with singleton pattern + Redis connection
- [ ] Day 4: Create ALL 11 Mongoose models with schemas, validations, and indexes
- [ ] Day 4: Setup Cloudinary config + upload service
- [ ] Day 5: Build base UI components: Button, Input, Card, Modal, Badge, Skeleton, Toast

**Week 2: Auth + Landing Page**
- [ ] Day 6: Auth.js v5 setup (Google + Credentials providers)
- [ ] Day 7: Express auth routes: register, login, google, refresh, logout
- [ ] Day 7: JWT middleware, role middleware, Redis session store
- [ ] Day 8: Login page UI + Register page UI (glassmorphic cards)
- [ ] Day 9: Landing page: Hero, Features, Stats, CTA sections
- [ ] Day 9: Mesh gradient background component
- [ ] Day 10: Layout components: Sidebar, TopNav, BottomNav
- [ ] Day 10: Shared types package (`@edu-hub/types`)

### Phase 2 — Core Student Features (Week 3–4)

**Week 3: Dashboard, Tasks, Timer**
- [ ] Day 11-12: Student dashboard (KPI cards, progress ring, charts, activity feed)
- [ ] Day 13-14: Task management (CRUD, filters, sort, priority badges)
- [ ] Day 14: AI task prioritization endpoint + "Smart Priority" view
- [ ] Day 15: Study timer page (circular display, controls, session save)

**Week 4: Notifications, Profile**
- [ ] Day 16: Notification system (bell, dropdown, mark read, full page)
- [ ] Day 17: Backend cron job for task reminders
- [ ] Day 18: Profile page (edit name, avatar upload to Cloudinary, change password)
- [ ] Day 19-20: Polish + fix bugs from Phase 2

### Phase 3 — Assessment & Resources (Week 5–6)

**Week 5: MCQ System**
- [ ] Day 21-22: Quiz listing page (card grid, filters, search)
- [ ] Day 23-24: Quiz attempt page (single question view, option selection, timer, progress bar, flags)
- [ ] Day 25: Quiz submission + auto-evaluation + results page

**Week 6: Resources + Leaderboard**
- [ ] Day 26: Resource listing (grid, filters, search, download)
- [ ] Day 27: Resource upload (Cloudinary integration, drag-and-drop, progress)
- [ ] Day 28: Performance analytics page (subject charts, weak areas, trends)
- [ ] Day 29: Leaderboard (Redis sorted sets, top 50 per quiz)
- [ ] Day 30: "My Uploads" page with status badges

### Phase 4 — Collaboration & Admin (Week 7–8)

**Week 7: Groups + Admin Foundation**
- [ ] Day 31-32: Study groups (listing, create, join, leave, detail page)
- [ ] Day 33: Meeting scheduler (create meeting, upcoming list, Zoom link)
- [ ] Day 34-35: Admin dashboard (platform stats, charts, activity log)

**Week 8: Admin Modules**
- [ ] Day 36: User management (data table, search, activate/deactivate)
- [ ] Day 37: Resource management (review queue, approve/reject/delete)
- [ ] Day 38-39: MCQ management (CRUD quizzes + questions, publish/unpublish)
- [ ] Day 40: Challenge management + Reporting module (charts, CSV export)

### Phase 5 — Polish & Deploy (Week 9)

- [ ] Day 41: Mobile responsiveness sweep (ALL pages on iPhone SE, iPad, Desktop)
- [ ] Day 42: Animation polish (mesh bg, 3D card tilts, page transitions, micro-interactions)
- [ ] Day 43: Performance audit (Lighthouse, bundle analysis, lazy loading)
- [ ] Day 44: Security audit (test rate limits, CORS, auth bypass, injection)
- [ ] Day 45: SEO (meta tags, OG images, sitemap, JSON-LD) + Accessibility (ARIA, keyboard nav)
- [ ] Day 45: Deploy frontend to Vercel + backend to Railway + configure env vars
- [ ] Day 45: Production smoke testing + final bug fixes

---

## 14. Figma Prototype Plan

> [!IMPORTANT]
> You mentioned needing a Figma prototype with the same design. I have two approaches:

**Option A (Recommended):** Build high-fidelity **UI mockup images** for every screen using the exact design system above — these serve as Figma reference frames or can be directly imported.

**Option B:** Build the actual pages in code first (Next.js + Tailwind), then use **html.to.design** Figma plugin to convert live pages into Figma components.

### Screens to Design (14 total)
| # | Screen | Key Components |
|---|--------|---------------|
| 1 | Landing Page | Hero + mesh bg, feature bento grid, stats counters, CTA |
| 2 | Login | Glass card, Google button, email/password form |
| 3 | Register | Glass card, name/email/password fields, Google button |
| 4 | Student Dashboard | KPI cards, progress ring, bar chart, streak, activity feed |
| 5 | Task Manager | Task list, filters bar, create task modal |
| 6 | Study Timer | Circular timer, controls, subject selector, history |
| 7 | Quiz Listing | Quiz cards grid, filters, difficulty badges |
| 8 | Quiz Attempt | Single question, 4 options, progress bar, timer |
| 9 | Quiz Results | Score card, question review, correct/wrong indicators |
| 10 | Resources | Resource cards grid, upload modal, filters |
| 11 | Study Groups | Group cards, create group modal, member list |
| 12 | Analytics | Bar charts, pie chart, trend line, weak area callouts |
| 13 | Admin Dashboard | Platform KPIs, user table, charts |
| 14 | Admin MCQ Editor | Quiz form, question list, add question form |

---

## User Review Required

> [!IMPORTANT]
> ### Decisions Needed Before I Start Coding:

1. **Figma Prototype**: Should I go with **Option A** (generate UI mockup images first) or **Option B** (code-first, then export to Figma)?

2. **Turborepo Monorepo**: Are you okay with Turborepo + pnpm monorepo, or do you prefer **separate Git repos** for frontend and backend?

3. **Tailwind CSS Version**: **Tailwind v4** (latest, CSS-first config) or **Tailwind v3** (stable, JS config)?

4. **shadcn/ui**: Should I use **shadcn/ui** for base components (Button, Input, Modal, etc.) or build all components **from scratch** for full control?

5. **AI Task Prioritization**: **Simple algorithm** (Eisenhower Matrix scoring as described above) or integrate with an **actual LLM API** (OpenAI/Gemini) for smarter prioritization?

6. **Zoom Integration**: **Manual link paste** (user pastes their Zoom link) or **actual Zoom API** integration (auto-generates meeting links — requires Zoom developer account)?

7. **Testing**: Should I write **unit + integration tests** during development, or focus on building first and add tests later?

---

## Verification Plan

### Automated
```bash
# TypeScript type checking (both apps + packages)
pnpm turbo typecheck

# Lint check
pnpm turbo lint

# Build both apps (catches compile errors)
pnpm turbo build

# Run backend tests (if added)
pnpm --filter api test

# Run E2E tests (if added)
pnpm --filter web test:e2e
```

### Manual
- Google Sign-In flow end-to-end (register new user, re-login)
- CRUD operations on every module (tasks, quizzes, resources, groups)
- Quiz attempt → auto-evaluation → results → leaderboard
- Resource upload → admin approval → student access
- Mobile responsiveness: Chrome DevTools (iPhone SE 375px, iPad 768px, Desktop 1440px)
- Lighthouse: Performance > 90, Accessibility > 95, SEO > 95
- Security: rate limit test (hit 6th request → 429), CORS block from unauthorized domain
