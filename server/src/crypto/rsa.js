/**
 * RSA — implemented FROM SCRATCH per assignment rules.
 * Do NOT import Node's `crypto` module or any npm crypto/RSA library here.
 * Use native BigInt for modular exponentiation, prime generation, etc.
 *
 * Used for: encrypting report fields (title, description, category, evidence).
 * Reviewer keypairs are generated/stored/rotated via keyManager.js.
 */

/**
 * Generate an RSA keypair.
 * @param {number} bits - key size in bits (e.g. 1024/2048 — pick something your
 *   from-scratch modexp can handle in reasonable time; smaller for a class demo is fine
 *   as long as you document the tradeoff).
 * @returns {{ publicKey: {e: bigint, n: bigint}, privateKey: {d: bigint, n: bigint} }}
 */
export function generateKeyPair(bits = 1024) {
  // TODO:
  // 1. Generate two large primes p, q (Miller-Rabin primality test, from scratch)
  // 2. n = p * q
  // 3. phi = (p-1) * (q-1)
  // 4. choose e (commonly 65537n) coprime with phi
  // 5. compute d = modInverse(e, phi) (extended Euclidean algorithm)
  throw new Error("generateKeyPair: not implemented");
}

/**
 * Encrypt a UTF-8 string with an RSA public key.
 * @param {string} plaintext
 * @param {{e: bigint, n: bigint}} publicKey
 * @returns {string} ciphertext, base64 or hex encoded
 */
export function encrypt(plaintext, publicKey) {
  // TODO: convert plaintext -> bigint (with padding scheme, e.g. simple OAEP-like padding
  // or at minimum a documented naive scheme), then c = m^e mod n (fast modexp)
  throw new Error("encrypt: not implemented");
}

/**
 * Decrypt ciphertext with an RSA private key.
 * @param {string} ciphertext
 * @param {{d: bigint, n: bigint}} privateKey
 * @returns {string} plaintext
 */
export function decrypt(ciphertext, privateKey) {
  // TODO: m = c^d mod n (fast modexp), strip padding, decode back to UTF-8
  throw new Error("decrypt: not implemented");
}
