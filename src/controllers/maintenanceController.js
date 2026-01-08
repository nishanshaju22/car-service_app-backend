import { addToMaintenance, getMaintenanceInfoForStatus, findServices, changeStatus, getUpcommingMaintainance } from "../manager/maintenance.js";

async function addToMaintenanceController(req, res) {
    const { carId, servId, mileage, mileageServicedAt, cost, status, scheduledDate } = req.body;

    try {
        const result = await addToMaintenance(carId, servId, mileage, mileageServicedAt, cost, status, scheduledDate);
        return res.status(201).json(result);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

async function getMaintenanceInfoForStatusController(req, res) {
    const carId = req.query.carId;

    try {
        const result = await getMaintenanceInfoForStatus(carId);
        return res.status(201).json(result);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

async function findServicesController(req, res) {
    const id = req.query.id;
    const currMileage = req.query.currMileage;

    try {
        const result = await findServices(id, currMileage);
        return res.status(201).json(result);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

async function changeStatusController(req, res) {
    const { carId, servId, mileage, status } = req.body;

    try {
        const result = await changeStatus(carId, servId, mileage, status);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

async function getUpcommingMaintainanceController(req, res) {
    const currMileage = req.query.currMileage;
    const amount = req.query.amount;

    try {
        const result = await getUpcommingMaintainance(currMileage, amount);
        return res.status(201).json(result);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

export { addToMaintenanceController, getMaintenanceInfoForStatusController, findServicesController, changeStatusController, getUpcommingMaintainanceController };
