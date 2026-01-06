import { prisma } from "../config/db.js";
import fs from "fs";
import path from "path";


const __dirname = new URL('.', import.meta.url).pathname;

const maintenanceData = JSON.parse(
    fs.readFileSync(
        path.join(__dirname, "../data/maintenance-schedule.json"),
        "utf-8"
    )
);

async function addToMaintenance(carId, servId, mileage, mileageServicedAt, cost) {

    const exsits = await prisma.maintenanceRecord.findUnique({
        where: {
            serviceId_scheduledMileage: {
                serviceId: servId,
                scheduledMileage: mileage
            }
        }
    });

    if (exsits) {
        throw new Error("This service has already been completed");
    }

    const mileageData = maintenanceData.maintenanceSchedule.mileageIntervals[mileage].services;
    let data = null;

    for (let serviceData of mileageData) {

        if (serviceData.id === servId) {
            const mainData = {
                carId,
                serviceId: serviceData.id,
                serviceType: serviceData.name,
                category: serviceData.category,
                priority: serviceData.priority,
                description: serviceData.description,
                mileageAtService: Number(mileageServicedAt),
                scheduledMileage: Number(mileage),
                serviceCost: cost,
                estimatedCostMin: serviceData.estimatedCost.min,
                estimatedCostMax: serviceData.estimatedCost.max,
                serviceDate: new Date(),
                status: "COMPLETED"
            }

            data = await prisma.maintenanceRecord.create({
                data: mainData
            });
        }
    }

    return data;
}

async function getMaintenanceInfoForStatus(carId) {
    const exsits = await prisma.maintenanceRecord.findMany({
        where: {
            carId: carId
        }
    });

    return exsits
}




export { addToMaintenance, getMaintenanceInfoForStatus }