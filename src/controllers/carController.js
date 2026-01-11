import { addCar, carDetails, getCarById, removeCar, updateCarDetails, getCarRatings, getCarRecalls, getCarComplaints, returnColour } from "../manager/car.js";


async function addCarController(req, res) {
    const {make, model, year, vin, licensePlate, color, currentMileage, mileageUnit, purchaseDate, purchasePrice, purchaseMileage, img} = req.body;

    try {
        const result = await addCar(req.user, make, model, year, vin, licensePlate, color, currentMileage, mileageUnit, purchaseDate, purchasePrice, purchaseMileage, img);
        return res.status(201).json(result);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

async function carDetailsController(req, res) {
    try {
        const result = await carDetails(req.user)
        return res.status(201).json(result);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

async function removeCarController(req, res) {
    const { id } = req.params;

    try {
        const result = await removeCar(req.user, id)
        return res.status(201).json(result);
    } catch (error) {
        return res.json({ error: error.message });
    }
}

async function updateCarController(req, res) {
    const { id } = req.params;
    const {make, model, year, vin, licensePlate, color, currentMileage, mileageUnit, purchaseDate, purchasePrice, purchaseMileage, img} = req.body;
    
    try {
        const result = await updateCarDetails(req.user, id, make, model, year, vin, licensePlate, color, currentMileage, mileageUnit, purchaseDate, purchasePrice, purchaseMileage, img);
        return res.status(201).json(result);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }

}

async function getCarByIdController(req, res) {
    const { id } = req.params;
    
    try {
        const result = await getCarById(id);
        return res.status(201).json(result);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }

}

async function getCarRatingsController(req, res) {
    const { id } = req.params;
    
    try {
        const result = await getCarRatings(id);
        return res.status(201).json(result);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }

}

async function getCarRecallsController(req, res) {
    const { id } = req.params;
    
    try {
        const result = await getCarRecalls(id);
        return res.status(201).json(result);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }

}

async function getCarComplaintsController(req, res) {
    const { id } = req.params;
    
    try {
        const result = await getCarComplaints(id);
        return res.status(201).json(result);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }

}


async function returnColourController(req, res) {
    const carId = req.query.carId;

    try {
        const result = await returnColour(carId);
        return res.status(201).json(result);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}


export { addCarController, removeCarController, updateCarController, carDetailsController, getCarByIdController, getCarRatingsController, getCarRecallsController, getCarComplaintsController, returnColourController };