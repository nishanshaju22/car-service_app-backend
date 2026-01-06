import { addToMaintenance, findServices } from "../manager/maintenance.js";

async function addToMaintenanceController(req, res) {
    const { carId, servId, mileage, mileageServicedAt, cost } = req.body;

    try {
        const result = await addToMaintenance(carId, servId, mileage, mileageServicedAt, cost);
        return res.status(201).json(result);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

async function findServicesController(req, res) {
    const carId = req.query.carId;
    const currMileage = req.query.currMileage;

    try {
        const result = await findServices(carId, currMileage);
        return res.status(201).json(result);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

export { addToMaintenanceController, findServicesController };