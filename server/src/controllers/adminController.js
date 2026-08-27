/**
 * Admin-only: manage reviewers, view audit logs.
 * Admin must NOT be able to decrypt report content (no report private keys
 * exposed to admin role) — enforce this by never routing report private keys
 * through any admin-accessible endpoint.
 */
// import User from "../models/User.js";
// import AuditLog from "../models/AuditLog.js";
// import { provisionKeysForReviewer, rotateKeys } from "../crypto/keyManager.js";

export async function createReviewer(req, res) {
  // TODO: create user with role "reviewer", provisionKeysForReviewer, log to AuditLog
  res.status(501).json({ error: "createReviewer not implemented" });
}

export async function rotateReviewerKeys(req, res) {
  // TODO
  res.status(501).json({ error: "rotateReviewerKeys not implemented" });
}

export async function getAuditLogs(req, res) {
  // TODO: return audit log entries (with MAC chain intact for verification)
  res.status(501).json({ error: "getAuditLogs not implemented" });
}
