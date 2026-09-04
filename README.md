# Anonymous Whistleblower Reporting Tool — CSE447 Lab Project

A MERN-stack system for anonymous misconduct reporting with role-based access control,
from-scratch asymmetric encryption (RSA + ECC), MAC-based integrity verification, and 2FA.

## Stack
- **MongoDB** — data storage (all sensitive fields stored as ciphertext)
- **Express** — REST API
- **React (Vite)** — frontend
- **Node.js** — backend runtime

## Why MERN satisfies the assignment constraints
The assignment's hard requirements (asymmetric-only encryption, ≥2 different asymmetric
algorithms, from-scratch crypto, MAC-chained audit logs, RBAC, 2FA, secure sessions) are
about *what we implement*, not the stack. Node's native `BigInt` lets us implement modular
exponentiation (RSA) and elliptic-curve point arithmetic (ECC) by hand without relying on
Node's `crypto` module or any npm crypto library. **Nothing under `server/src/crypto/` may
import `crypto`, `crypto-js`, `node-forge`, `elliptic`, `jsrsasign`.**

## Roles
| Role | Capabilities |
|---|---|
| Reporter | Submit reports (optionally anonymous), check status via tracking ID |
| Reviewer/Committee | Decrypt & read assigned reports (own RSA private key), update status |
| Admin | Manage reviewer accounts, view audit/status logs — **cannot** decrypt report content |

## Project layout
```
whistleblower-tool/
├── server/                 # Express API
│   └── src/
│       ├── config/         # DB connection, env loading
│       ├── models/         # Mongoose schemas (User, Report, AuditLog)
│       ├── middleware/     # auth (JWT-alternative), RBAC guard
│       ├── crypto/         # RSA, ECC, MAC/HMAC — IMPLEMENT FROM SCRATCH HERE
│       ├── controllers/    # Route handlers
│       ├── routes/         # Express routers
│       └── utils/          # tracking-ID generator, TOTP for 2FA, etc.
└── client/                 # React (Vite) frontend
    └── src/
        ├── pages/          # Login, Register, Dashboard, SubmitReport, TrackReport
        ├── components/     # ProtectedRoute, forms, tables
        ├── context/        # Auth context
        └── api/            # axios instance
```



### 1. Clone & install
```bash
git clone https://github.com/MaherunReya/CSE447_Project
cd whistleblower-tool

# server
cd server
npm install
npm run dev

# client (new terminal)
cd ../client
npm install
npm run dev
```

