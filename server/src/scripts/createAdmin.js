/**
 * One-time bootstrap: creates the very first admin account.
 * Self-registration (POST /api/auth/register) can only ever create
 * "reporter" accounts, and every admin-management endpoint requires an
 * existing admin — so without this script there's no way to get started.
 *
 * Usage:
 *   node src/scripts/createAdmin.js <username> <password> <email>
 */
import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { hashPassword } from "../crypto/hash.js";
import { encryptPlatformField } from "../crypto/keyManager.js";
import User from "../models/User.js";

dotenv.config();

async function main() {
  const [, , username, password, email] = process.argv;
  if (!username || !password || !email) {
    console.error("Usage: node src/scripts/createAdmin.js <username> <password> <email>");
    process.exit(1);
  }

  await connectDB();

  const existing = await User.findOne({ username });
  if (existing) {
    console.error(`User "${username}" already exists (role: ${existing.role})`);
    process.exit(1);
  }

  const { hash, salt } = hashPassword(password);
  const emailEncrypted = await encryptPlatformField(email);

  const admin = await User.create({
    username,
    passwordHash: hash,
    passwordSalt: salt,
    emailEncrypted,
    role: "admin",
  });

  console.log(`Admin user created: ${admin.username} (${admin._id})`);
  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error("Failed to create admin:", err);
  process.exit(1);
});