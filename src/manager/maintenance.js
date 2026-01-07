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

async function addToMaintenance(carId, servId, mileage, mileageServicedAt, cost, status) {

    const exsits = await prisma.maintenanceRecord.findUnique({
        where: {
            serviceId_scheduledMileage: {
                serviceId: servId,
                scheduledMileage: mileage
            }
        }
    });

    if (exsits) {
        return "This service has already been completed";
    }
    console.log(status)
    if (status !== "COMPLETED" && status !== "SCHEDULED" && status !== "SKIPPED") {
        throw new Error("Invalid status");
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
                status: status
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

async function findServices(carId, currMileage) {
    let servicesDue = {};

    const mileageIntervals = maintenanceData.maintenanceSchedule.mileageIntervals;

    for (const [mileage, interval] of Object.entries(mileageIntervals)) {

        for (const service of interval.services) {
            const exists = await prisma.maintenanceRecord.findUnique({
                where: {
                    serviceId_scheduledMileage: {
                        serviceId: service.id,
                        scheduledMileage: Number(mileage)
                    },
                    carId: carId
                }
            });

            if (Number(mileage) <= currMileage && !exists) {
                if (!servicesDue[mileage]) {
                    servicesDue[mileage] = [];
                }

                console.log(service)

                servicesDue[mileage].push(service.id);
            }
        }

    }

    return servicesDue;
}


export { addToMaintenance, getMaintenanceInfoForStatus, findServices }
