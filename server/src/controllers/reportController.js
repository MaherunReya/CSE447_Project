/**
 * Report submission, status lookup by tracking ID, reviewer read/update.
 */
// import Report from "../models/Report.js";
// import * as rsa from "../crypto/rsa.js";
// import * as ecc from "../crypto/ecc.js";
// import { computeMAC, verifyMAC, appendChainedEntry } from "../crypto/mac.js";
// import { generateTrackingId } from "../utils/trackingId.js";

export async function submitReport(req, res) {
  // TODO:
  // 1. generate trackingId
  // 2. encrypt title/description/category/evidence with assigned reviewer's RSA public key
  // 3. if identity provided, encrypt separately with ECC public key
  // 4. computeMAC over the full plaintext payload (before encryption, or over
  //    the ciphertext bundle — decide & document), store alongside record
  // 5. save Report, return trackingId to the reporter (only shown once)
  res.status(501).json({ error: "submitReport not implemented" });
}

export async function getReportByTrackingId(req, res) {
  // TODO: public lookup — return only status + timestamps, never decrypted content
  res.status(501).json({ error: "getReportByTrackingId not implemented" });
}

export async function getAssignedReports(req, res) {
  // TODO: reviewer-only — list reports assigned to req.user, decrypt on read,
  // verify MAC before returning (reject/report if MAC mismatch — tamper detected)
  res.status(501).json({ error: "getAssignedReports not implemented" });
}

export async function updateReportStatus(req, res) {
  // TODO: reviewer-only — append MAC-chained status log entry via appendChainedEntry
  res.status(501).json({ error: "updateReportStatus not implemented" });
}
