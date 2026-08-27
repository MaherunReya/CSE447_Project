/**
 * Session/auth middleware.
 * Session tokens are signed with our own HMAC (crypto/mac.js), not jsonwebtoken,
 * to keep "encryption/signing" in-house per assignment rules. A token is just
 * `payload.base64 + "." + mac` — verify by recomputing the MAC.
 */
import { verifyMAC } from "../crypto/mac.js";

export function requireAuth(req, res, next) {
  const token = req.cookies?.session;
  if (!token) return res.status(401).json({ error: "Not authenticated" });

  // TODO:
  // const [payloadB64, tag] = token.split(".");
  // const payload = JSON.parse(Buffer.from(payloadB64, "base64").toString());
  // if (!verifyMAC(payloadB64, process.env.SESSION_SECRET, tag)) return res.status(401)...
  // if (payload.exp < Date.now()) return res.status(401).json({ error: "Session expired" });
  // req.user = payload; next();

  return res.status(501).json({ error: "requireAuth not implemented" });
}

/**
 * RBAC guard. Usage: router.get('/x', requireAuth, requireRole('admin'), handler)
 */
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Insufficient privileges" });
    }
    next();
  };
}
