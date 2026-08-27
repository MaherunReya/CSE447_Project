/**
 * MAC / HMAC — implemented FROM SCRATCH per assignment rules.
 * Do NOT import Node's `crypto` module for HMAC/hashing here.
 * Implement a hash function (or reuse a simple from-scratch one, e.g. a basic
 * SHA-256-like construction or CBC-MAC over a from-scratch block cipher-ish
 * transform) and the HMAC construction (ipad/opad) on top of it, documented
 * clearly for the report.
 *
 * Used for:
 *  - integrity tag stored alongside every report, recomputed on every read
 *  - MAC-chaining the append-only status-change log (each entry's MAC covers
 *    the previous entry's MAC + the new status, so history can't be rewritten)
 *  - signing short-lived reviewer session tokens
 */

/**
 * @param {string} message
 * @param {string} key
 * @returns {string} MAC/tag, hex encoded
 */
export function computeMAC(message, key) {
  // TODO: implement hash-then-HMAC (or CBC-MAC) from scratch
  throw new Error("computeMAC: not implemented");
}

/**
 * Constant-time-ish comparison to verify a MAC without leaking timing info.
 * @param {string} message
 * @param {string} key
 * @param {string} tag
 * @returns {boolean}
 */
export function verifyMAC(message, key, tag) {
  const computed = computeMAC(message, key);
  if (computed.length !== tag.length) return false;
  let diff = 0;
  for (let i = 0; i < computed.length; i++) diff |= computed.charCodeAt(i) ^ tag.charCodeAt(i);
  return diff === 0;
}

/**
 * Build the next entry of a MAC-chained audit/status log.
 * @param {string} previousMAC - MAC of the previous log entry (or a fixed genesis value for the first)
 * @param {object} entry - e.g. { reportId, newStatus, changedBy, timestamp }
 * @param {string} key
 * @returns {{ entry: object, mac: string }}
 */
export function appendChainedEntry(previousMAC, entry, key) {
  const payload = previousMAC + JSON.stringify(entry);
  return { entry, mac: computeMAC(payload, key) };
}
