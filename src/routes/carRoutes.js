import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { addCarController, carDetailsController, getCarByIdController, removeCarController, updateCarController } from "../controllers/carController.js";

const router = express.Router();

router.use(authMiddleware)

router.post("/add", addCarController);

router.get("/details", carDetailsController);

router.get("/details/:id", getCarByIdController);

router.delete("/delete/:id", removeCarController);

router.put("/update/:id", updateCarController);

export default router;