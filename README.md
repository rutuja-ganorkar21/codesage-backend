# CodeSage — Backend

Node.js + Express backend for the [CodeSage](https://codesage-snowy.vercel.app) DSA practice platform.

> For full documentation, features, and setup guide — see the [Frontend Repository](https://github.com/rutuja-ganorkar21/codesage-frontend)

---

## Tech Stack

- Node.js + Express v5
- MongoDB + Mongoose
- Redis
- Google Gemini AI
- Judge0 — code execution
- Cloudinary — media storage
- JWT + bcrypt

## Quick Start

```bash
git clone https://github.com/rutuja-ganorkar21/codesage-backend.git
cd codesage-backend
npm install
```

Create `.env`:
```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
REDIS_URL=your_redis_url
GEMINI_API_KEY=your_gemini_key
JUDGE0_API_URL=your_judge0_url
JUDGE0_API_KEY=your_judge0_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

```bash
node src/index.js
```

---

## Author

**Rutuja Ganorkar**
[![GitHub](https://img.shields.io/badge/GitHub-rutuja--ganorkar21-181717?style=flat&logo=github)](https://github.com/rutuja-ganorkar21)
