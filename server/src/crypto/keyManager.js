/**
 * Key Management Module.
 * Responsible for: generating RSA/ECC keypairs for reviewers, storing private
 * keys securely (never in plaintext in the DB — at minimum encrypt-at-rest with
 * a server master key held outside the DB, e.g. in an env var), distributing
 * public keys to whoever needs to encrypt data for a reviewer, and rotating
 * keys on a schedule or on demand.
 */
import * as rsa from "./rsa.js";
import * as ecc from "./ecc.js";

/**
 * Generate and persist a fresh RSA + ECC keypair for a reviewer.
 * @param {string} userId
 */
export async function provisionKeysForReviewer(userId) {
  // TODO:
  // const rsaKeys = rsa.generateKeyPair();
  // const eccKeys = ecc.generateKeyPair();
  // store public keys openly on the User doc; store private keys encrypted
  // (e.g. wrapped with a server-held master secret) in a separate collection
  throw new Error("provisionKeysForReviewer: not implemented");
}

/**
 * Rotate a reviewer's keys (generate new pair, mark old as retired but keep
 * long enough to decrypt reports encrypted before rotation, or re-encrypt
 * existing reports with the new key — decide & document the policy).
 * @param {string} userId
 */
export async function rotateKeys(userId) {
  // TODO
  throw new Error("rotateKeys: not implemented");
}

/**
 * Fetch a reviewer's current public keys (safe to expose).
 * @param {string} userId
 */
export async function getPublicKeys(userId) {
  // TODO
  throw new Error("getPublicKeys: not implemented");
}
