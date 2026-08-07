# ExplainingDream Platform Guidelines & Security Rules

## Rules & RBAC (Role-Based Access Control)
This project enforces strict Security-First and Least-Privilege Role-Based Access Control across all frontend views and backend API routes.

### 1. User Roles
The platform strictly supports three distinct user roles:
1. **Admin (الإدارة)**:
   - Reserved exclusively for System Administrators and Sheikh Ahmed Al-Sherif (`ahmedalsherif30@gmail.com`).
   - Access to Admin Control Panel (`/api/admin/*` & `AdminDashboardModal`), User Management, Dreams Management, Sales & Subscriptions, Broadcasts, Site Settings, & System Logs.
2. **Member (العضو)**:
   - Authenticated registered users (`role === 'member'` or `'vip'`/`'free'`).
   - Access to personal profile, personal interpreted visions journal (`/api/client/*`), saved notifications, active subscription status, and member services.
   - Strictly forbidden from viewing other users' private data or admin tools.
3. **Visitor / Client (الزائر أو العميل غير المسجل)**:
   - Public landing page, AI Dream Interpreter form, Dictionary/Encyclopedia, Pricing, Articles, Book Showcase, FAQs, and Login/Register options.
   - Strictly forbidden from accessing private internal pages or administrative features.

### 2. Full Separation of Admin Panel & Public Website
- The Admin Panel and User Site are logically separated.
- No admin buttons, links, or internal administrative components may be rendered for non-admin users.
- Role authorization MUST be enforced on the backend (`server.ts`) for all `/api/admin/*` requests, returning HTTP `403 Forbidden` if unauthorized.
