import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { addToMaintenanceController } from "../controllers/maintenanceController.js";

const router = express.Router();

router.use(authMiddleware)

router.post("/add", addToMaintenanceController);

// router.get("/details", carDetailsController);

// router.get("/details/:id", getCarByIdController);

// router.delete("/delete/:id", removeCarController);

// router.put("/update/:id", updateCarController);

export default router;