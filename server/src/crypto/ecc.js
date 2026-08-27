/**
 * ECC — implemented FROM SCRATCH per assignment rules.
 * Do NOT import Node's `crypto` module or any npm elliptic-curve library here.
 * Implement point addition/doubling and scalar multiplication over a chosen curve
 * (e.g. a small toy curve over F_p, or secp256k1 params entered manually) using BigInt.
 *
 * Used specifically for: encrypting the optional reporter-identity field, so the
 * "two different asymmetric algorithms for different parts" requirement is met.
 */

/**
 * Generate an ECC keypair.
 * @returns {{ publicKey: {x: bigint, y: bigint}, privateKey: bigint }}
 */
export function generateKeyPair() {
  // TODO: pick curve params (a, b, p, G, n) as module-level constants,
  // privateKey = random bigint in [1, n-1], publicKey = privateKey * G (scalar mult)
  throw new Error("generateKeyPair: not implemented");
}

/**
 * Encrypt a UTF-8 string with an ECC public key (ECIES-style: derive a shared
 * secret via ECDH, then combine with the message — e.g. simple XOR stream or
 * a from-scratch symmetric-free combination scheme, since symmetric ciphers
 * are disallowed by the assignment).
 * @param {string} plaintext
 * @param {{x: bigint, y: bigint}} publicKey
 * @returns {string} ciphertext
 */
export function encrypt(plaintext, publicKey) {
  // TODO
  throw new Error("encrypt: not implemented");
}

/**
 * Decrypt with an ECC private key.
 * @param {string} ciphertext
 * @param {bigint} privateKey
 * @returns {string} plaintext
 */
export function decrypt(ciphertext, privateKey) {
  // TODO
  throw new Error("decrypt: not implemented");
}
