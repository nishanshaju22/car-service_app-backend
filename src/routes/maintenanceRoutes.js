import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { addToMaintenanceController, getMaintenanceInfoForStatusController, findServicesController } from "../controllers/maintenanceController.js";
const router = express.Router();

router.use(authMiddleware)

router.post("/add", addToMaintenanceController);

router.get("/get-maintenance", getMaintenanceInfoForStatusController);

router.get("/find-services", findServicesController);

export default router;