import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    // Encrypted at rest (RSA) — decrypt only when an admin with proper
    // privilege needs to view it; never expose raw in API responses.
    emailEncrypted: { type: String, required: true },
    contactInfoEncrypted: { type: String },

    passwordHash: { type: String, required: true },
    passwordSalt: { type: String, required: true },

    role: { type: String, enum: ["reporter", "reviewer", "admin"], default: "reporter" },

    // 2FA
    totpSecret: { type: String }, // encrypted/stored per your 2FA design
    is2FAEnabled: { type: Boolean, default: false },

    // Public keys only — private keys live in a separate, tightly-restricted collection
    rsaPublicKey: { type: mongoose.Schema.Types.Mixed },
    eccPublicKey: { type: mongoose.Schema.Types.Mixed },

    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
