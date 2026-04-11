Project: MedSecureAI — AI-Assisted Zero-Trust Medical Data Security Platform
   
Tech Stack:
- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- Auth: JWT with httpOnly cookies + bcryptjs
- AI Engine: Weighted behavior analysis (simulated)

How to run locally:
1. npm install
2. node server.js (runs on port 5001)
3. npm run dev (runs on port 5173)

Deployment:
- Frontend: `Vercel`
- Backend: `Railway`
- Frontend env: copy [.env.frontend.example](/Users/rohantrivedi/Downloads/Project/.env.frontend.example:1) to `.env` locally or add `VITE_API_BASE_URL` in Vercel
- Backend env: set values from [.env.backend.example](/Users/rohantrivedi/Downloads/Project/.env.backend.example:1) in Railway
- Vercel SPA routing is configured in [vercel.json](/Users/rohantrivedi/Downloads/Project/vercel.json:1)
- Backend health check: `GET /api/health`

Test credentials:
Doctors: dr.smith / dr.patel / dr.jones / dr.williams / dr.mehta / dr.chen — password: doctor123
Admins: admin / sysadmin — password: admin123
