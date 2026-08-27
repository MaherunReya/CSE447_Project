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
import `crypto`, `crypto-js`, `node-forge`, `elliptic`, `jsrsasign`, or similar — those
implementations must be written by us.**

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

## Getting started

### 1. Clone & install
```bash
git clone <repo-url>
cd whistleblower-tool

# server
cd server
npm install
cp .env.example .env   # fill in MONGO_URI, PORT, SESSION_SECRET (see note below)
npm run dev

# client (new terminal)
cd ../client
npm install
npm run dev
```

### 2. `SESSION_SECRET` note
Since token/session signing must also avoid built-in crypto helpers where the assignment
scopes that as "encryption," we sign session tokens using our own HMAC (`crypto/mac.js`)
rather than the `jsonwebtoken` library. `SESSION_SECRET` is the key fed into that HMAC —
treat it like any other secret, keep it out of git.

## Division of work (suggested — edit as your team decides)
- [ ] RSA implementation (`crypto/rsa.js`) — keygen, encrypt, decrypt
- [ ] ECC implementation (`crypto/ecc.js`) — keygen, encrypt/decrypt (ECIES-style) or sign
- [ ] MAC/HMAC implementation (`crypto/mac.js`) + MAC-chained audit log
- [ ] Key Management Module (`crypto/keyManager.js`) — generation, storage, rotation
- [ ] Auth: registration/login, password hash+salt, 2FA (TOTP)
- [ ] RBAC middleware + Report/Admin controllers & routes
- [ ] React: auth pages, submit/track report, reviewer dashboard, admin panel

## Status
Scaffold only — controllers and crypto modules are stubbed with clear `TODO`s and the
exact function signatures the rest of the app expects. No business logic implemented yet.
