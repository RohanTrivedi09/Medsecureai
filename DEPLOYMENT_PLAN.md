# MedSecureAI Deployment Plan

## Current State

- Frontend: React + Vite static app
- Backend: Node.js + Express API
- Data store: in-memory only
- Authentication: JWT stored in httpOnly cookie

This means the app can be deployed now for demo use, but not for production clinical use until persistence, secret management, and stronger security controls are added.

## Recommended Deployment Architecture

- Deploy frontend on `Vercel`
- Deploy backend on `Railway`
- Keep frontend and backend on separate services
- Use HTTPS on both
- Set the frontend to call the backend using `VITE_API_BASE_URL`
- Set the backend to allow the frontend domain using `CLIENT_ORIGIN`

Example:

- Frontend: `https://medsecureai-frontend.vercel.app`
- Backend: `https://medsecureai-api.up.railway.app`

## Required Environment Variables

### Backend

- `PORT=5001`
- `NODE_ENV=production`
- `JWT_SECRET=<strong-random-secret>`
- `BCRYPT_SALT_ROUNDS=10`
- `CLIENT_ORIGIN=https://your-frontend-domain.com`

If you have multiple allowed frontends:

- `CLIENT_ORIGIN=https://your-frontend-domain.com,https://staging-frontend-domain.com`

### Frontend

- `VITE_API_BASE_URL=https://your-backend-domain.com`

Example files are included:

- [.env.backend.example](/Users/rohantrivedi/Downloads/Project/.env.backend.example:1)
- [.env.frontend.example](/Users/rohantrivedi/Downloads/Project/.env.frontend.example:1)

## Step-by-Step Plan

### Phase 1: Demo Deployment

1. Push the project to GitHub.
2. Deploy the backend first.
3. Set backend environment variables.
4. Deploy the frontend.
5. Set `VITE_API_BASE_URL` to the backend URL.
6. Update backend `CLIENT_ORIGIN` to the frontend URL.
7. Verify login, doctor dashboard, admin dashboard, audit logs, and patient access flow.

### Phase 2: Hardening Before Real Use

1. Replace the in-memory store with a real database.
2. Move seeded users out of source code.
3. Store secrets only in environment variables.
4. Add request validation and centralized error handling.
5. Add rate limiting and audit retention rules.
6. Add automated tests for admin CRUD and auth edge cases.
7. Add logging/monitoring for backend failures.

## Deployment Commands

### Backend

Install dependencies:

```bash
npm install
```

Start backend:

```bash
npm start
```

### Frontend

Install dependencies:

```bash
npm install
```

Build frontend:

```bash
npm run build
```

Preview locally:

```bash
npm run preview
```

## Recommended Platform Setup

### Option 1: Vercel + Railway

- Frontend on Vercel
- Backend on Railway web service
- Best low-friction setup for this repo

### Railway Setup

1. Create a new Railway project from the repo.
2. Set the start command to `npm start` if Railway does not detect it automatically.
3. Add the backend environment variables from `.env.backend.example`.
4. Deploy and confirm `GET /api/health` returns success.

### Vercel Setup

1. Import the same repo into Vercel.
2. Framework preset: `Vite`.
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add `VITE_API_BASE_URL` from `.env.frontend.example`.
6. After Vercel gives you the final frontend domain, add that exact URL to Railway `CLIENT_ORIGIN`.

## Verification Checklist

- Frontend loads over HTTPS
- Backend responds over HTTPS
- Login works for doctor and admin
- Cookies are set correctly in production
- Doctor can request patient access
- Admin can view logs and users
- Admin can create patients
- Admin can create users
- No CORS errors in the browser

## Known Limitation

The current backend uses in-memory arrays from `data.js`. Any restart clears runtime changes such as:

- new users
- new patients
- clinical notes
- notifications
- flags

For a real deployment, a database is mandatory.
