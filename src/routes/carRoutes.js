import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { addCarController, carDetailsController, getCarByIdController, removeCarController, updateCarController, getCarRatingsController, getCarRecallsController, getCarComplaintsController, addPredictorController } from "../controllers/carController.js";

const router = express.Router();

router.use(authMiddleware)

router.post("/add", addCarController);

router.post("/add-predictor", addPredictorController);

router.get("/details", carDetailsController);

router.get("/details/:id", getCarByIdController);

router.delete("/delete/:id", removeCarController);

router.put("/update/:id", updateCarController);

router.get("/car-ratings/:id", getCarRatingsController);

router.get("/car-recalls/:id", getCarRecallsController);

router.get("/car-complaints/:id", getCarComplaintsController);

export default router;