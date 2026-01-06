import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { addToMaintenanceController, getMaintenanceInfoForStatusController } from "../controllers/maintenanceController.js";

const router = express.Router();

router.use(authMiddleware)

router.post("/add", addToMaintenanceController);

router.get("/get-maintenance", getMaintenanceInfoForStatusController);

export default router;