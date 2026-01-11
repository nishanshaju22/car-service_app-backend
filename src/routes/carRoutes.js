import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { addCarController, carDetailsController, getCarByIdController, removeCarController, updateCarController, getCarRatingsController, getCarRecallsController, getCarComplaintsController, returnColourController } from "../controllers/carController.js";

const router = express.Router();

router.use(authMiddleware)

router.post("/add", addCarController);

router.get("/details", carDetailsController);

router.get("/details/:id", getCarByIdController);

router.delete("/delete/:id", removeCarController);

router.put("/update/:id", updateCarController);

router.get("/car-ratings/:id", getCarRatingsController);

router.get("/car-recalls/:id", getCarRecallsController);

router.get("/car-complaints/:id", getCarComplaintsController);

router.get("/getColour", returnColourController);

export default router;