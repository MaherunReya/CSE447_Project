/**
 * Registration / login / 2FA verification.
 * Password hashing+salting: using bcrypt for now (hashing, not "encryption" —
 * flag this choice with your TA given the from-scratch rule; swap for a
 * from-scratch scheme, e.g. a manual salted hash construction, if required).
 */
// import bcrypt from "bcrypt";
// import * as rsa from "../crypto/rsa.js";
// import * as ecc from "../crypto/ecc.js";
// import { computeMAC } from "../crypto/mac.js";
// import User from "../models/User.js";

export async function register(req, res) {
  // TODO:
  // 1. hash+salt password (bcrypt or from-scratch)
  // 2. encrypt email/contact info (RSA) before storing
  // 3. if role === reviewer/admin, provision RSA+ECC keypairs via keyManager
  // 4. optionally set up 2FA (TOTP secret) and return QR/otpauth URL
  res.status(501).json({ error: "register not implemented" });
}

export async function login(req, res) {
  // TODO:
  // 1. look up user, verify password hash
  // 2. if 2FA enabled, require verify2FA step before issuing session
  // 3. issue MAC-signed short-lived session token, set as httpOnly cookie
  res.status(501).json({ error: "login not implemented" });
}

export async function verify2FA(req, res) {
  // TODO: verify TOTP code against stored secret (otplib), then issue session
  res.status(501).json({ error: "verify2FA not implemented" });
}

export async function logout(req, res) {
  res.clearCookie("session");
  res.json({ ok: true });
}
