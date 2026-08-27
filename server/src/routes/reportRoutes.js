import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import {
  submitReport,
  getReportByTrackingId,
  getAssignedReports,
  updateReportStatus,
} from "../controllers/reportController.js";

const router = Router();

// Public — no auth required (supports fully anonymous submission)
router.post("/", submitReport);
router.get("/track/:trackingId", getReportByTrackingId);

// Reviewer-only
router.get("/assigned", requireAuth, requireRole("reviewer"), getAssignedReports);
router.patch("/:id/status", requireAuth, requireRole("reviewer"), updateReportStatus);

export default router;
