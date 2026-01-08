import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { addToMaintenanceController, getMaintenanceInfoForStatusController, findServicesController, changeStatusController, getUpcommingMaintainanceController } from "../controllers/maintenanceController.js";
const router = express.Router();

router.use(authMiddleware)

router.post("/add", addToMaintenanceController);

router.get("/get-maintenance", getMaintenanceInfoForStatusController);

router.get("/find-services", findServicesController);

router.put("/change-status", changeStatusController);

router.get("/upcoming-services", getUpcommingMaintainanceController);

export default router;