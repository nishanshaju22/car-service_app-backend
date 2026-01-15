import { prisma } from "../config/db.js";
import { fetchCarImage } from "../services/scraper_services.js";
import { findServices, getUpcommingMaintainance } from "./maintenance.js";

async function addCar(user, make, model, year, vin, licensePlate, color, currentMileage, mileageUnit, purchaseDate, purchasePrice, purchaseMileage) {
    if (!user) {
        throw new Error("Unauthorized");
    }

    const currentUser = await prisma.user.findUnique({
        where: { id: user.id },
    });

    if (!currentUser) {
        throw new Error("User not found");
    }

    if (vin != "" && await prisma.car.findUnique({ where: { vin: vin}})) {
        throw new Error("This vin already exsits");
    }

    if (vin == "") {
        vin = null;
    }

    const yearNum = Number(year);
    const currentYear = new Date().getFullYear();

    if (!Number.isInteger(yearNum)) {
        throw new Error('Year must be a valid number');
    }

    if (yearNum < 1886) {
        throw new Error('Year is unrealistically old');
    }

    if (yearNum > currentYear) {
        throw new Error('Year cannot be in the future');
    }

    const img = await fetchCarImage(make, model, year)

    const carData = {
        userId: user.id,
        make: capitaliseWords(make).trim(),
        model: capitaliseWords(model).trim(),
        year: Number(year),
        vin,
        licensePlate: licensePlate.toUpperCase(),
        color,
        currentMileage: Number(currentMileage),
        mileageUnit,
        purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
        purchasePrice: Number(purchasePrice),
        purchaseMileage: Number(purchaseMileage),
        img
    }

    const car = await prisma.car.create({
        data: carData
    });

    return car;
}

function capitaliseWords(str) {
    return str
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

async function removeCar(user, id) {
    
    if (!id) {
        throw new Error("This car does not exsits");
    }

    const car = await prisma.car.delete({
        where: {
            id,
            userId: user.id
        }
    });

    if (!car) {
        throw new Error("Car not found or not authorized");
    }

    const data = {
        status: "success",
        message: "Car deleted succesfully"
    };

    return data
}

async function updateCarDetails(user, id, make, model, year, vin, licensePlate, color, currentMileage, mileageUnit, purchaseDate, purchasePrice, purchaseMileage) {
    
    if (!user) {
        throw new Error("Unauthorized");
    }

    const currentUser = await prisma.user.findUnique({
        where: { id: user.id },
    });

    if (!currentUser) {
        throw new Error("User not found");
    }

    const carFound = await prisma.car.findFirst({
        where: {
            id,
            userId: user.id
        }
    });

    if (!carFound) {
        throw new Error("Car not found or not authorized");
    }

    const yearNum = Number(year);
    const currentYear = new Date().getFullYear();

    if (!Number.isInteger(yearNum)) {
        throw new Error('Year must be a valid number');
    }

    if (yearNum < 1886) {
        throw new Error('Year is unrealistically old');
    }

    if (yearNum > currentYear) {
        throw new Error('Year cannot be in the future');
    }

    const img = await fetchCarImage(make, model, year)

    const carData = {
        userId: user.id,
        make: capitaliseWords(make) ?? carFound.make,
        model: capitaliseWords(model) ?? carFound.model,
        year: Number(year) ?? carFound.year,
        vin: vin ?? carFound.vin,
        licensePlate: licensePlate.toUpperCase() ?? carFound.licensePlate,
        color: color ?? carFound.color,
        currentMileage: Number(currentMileage) ?? carFound.currentMileage,
        mileageUnit: mileageUnit ?? carFound.mileageUnit,
        purchaseDate: purchaseDate ? new Date(purchaseDate) : carFound.purchaseDate,
        purchasePrice: Number(purchasePrice) ?? carFound.purchasePrice,
        purchaseMileage: Number(purchaseMileage) ?? carFound.purchaseMileage,
        img
    };

    const car = await prisma.car.update({
        where: { id: id },
        data: carData
    });

    return car;
}

async function carDetails(user) {

    if (!user) {
        throw new Error("the user does not exsist");
    }

    const cars = await prisma.car.findMany({
        where: { userId: user.id }
    });

    let colours = {};
    let reasons = {};

    let carsList = [];

    for (const car of cars) {

        const status = await returnColour(car.id);

        const newMileage = calculateNewMileage(car);
        if (newMileage !== 0) {
            await updateMileage(car.id, newMileage);
        }

        carsList.push(car)

        colours[car.id] = status.colour;
        reasons[car.id] = status.reason;
    }

    return {
        cars: carsList,
        colours,
        reasons
    };
}

function calculateNewMileage(car) {
    if (!car) {
        throw new Error("the car passed is null");
    }

    const currMileageDate = new Date(car.updatedAt);
    const currDate = new Date();

    const MS_PER_DAY = 1000 * 60 * 60 * 24;
    const diff = Math.floor((currDate - currMileageDate) / MS_PER_DAY)
    const newMileage = car.currentMileage + (car.predictor * diff)

    return newMileage;
}

async function updateMileage(carId, newMileage) {
    
    if (!carId) {
        throw new Error("the car id is null");
    }

    const data = {
        currentMileage: newMileage,
        updatedAt: new Date()
    }

    const car = await prisma.car.update({
        where: {id: carId},
        data: data
    });

    if (!car) {
        throw new Error("the update did not work");
    }

    console.log(car);

    return car;
}


async function returnColour(carId) {

    const car = await prisma.car.findUnique({
        where: {id: carId}
    });

    if (!car) {
        throw new Error("car not found");
    }

    const maintainanseRec = await prisma.maintenanceRecord.findMany({
        where: {carId: carId}
    });

    if (maintainanseRec.length < 1 && car.currentMileage > 10000) {
        return {
            colour: "red",
            reason: "Car is overdue service"
        };
    } else if (maintainanseRec.length < 1 && car.currentMileage < 10000 && car.currentMileage > 5000) {
        return {
            colour: "yellow",
            reason: "Car almost due service"
        };
    } else if (maintainanseRec.length < 1) {
        return {
            colour: "green",
            reason: "No serviced required"
        };
    }

    const overdueServices = findServices(car.id, car.currentMileage);
    const overdue = Object.keys(overdueServices).length;

    if (overdue > 0) {
        return {
            colour: "red",
            reason: "Car is overdue service"
        };
    }

    for (let main of maintainanseRec) {
        if (main.priority == "critical" && main.status == "SKIPPED") {
            return {
                colour: "red",
                reason: "Car is overdue service"
            };
        } else if (main.priority == "recommended" && main.status == "SKIPPED") {
            return {
                colour: "yellow",
                reason: "A recommended service has been skipped"
            };
        }
    }

    const services = await getUpcommingMaintainance(car.currentMileage, 1);
    const serviceDueKm = services[0].kilometers;
    

    if (!serviceDueKm) {
        return {
            colour: "green",
            reason: "No upcoming services"
        };
    }

    if (serviceDueKm - car.currentMileage < 1000) {
        return {
            colour: "yellow",
            reason: "Car almost due service"
        };
    }

    return {
        colour: "green",
        reason: "No serviced required"
    };
}

async function getCarById(id) {
    const car = await prisma.car.findUnique({
        where: {id: id}
    });

    return car;
}

async function getCarRatings(id) {
    const car = await getCarById(id);

    const make = car.make;
    const model = car.model;
    const year = car.year;

    try {
        let response = await fetch(`https://api.nhtsa.gov/SafetyRatings/modelyear/${year}/make/${make}/model/${model}`);

        if (!response.ok) {
            throw new Error('Api error');
        }

        let data = await response.json();
        const vehicleId = data.Results[0].VehicleId;

        response = await fetch(`https://api.nhtsa.gov/SafetyRatings/VehicleId/${vehicleId}`);

        if (!response.ok) {
            throw new Error('Api error');
        }

        data = await response.json();

        return data.Results
    } catch (error) {
        console.error('Error fetching data:', error);
    }

}

async function getCarRecalls(id) {
    const car = await getCarById(id);

    const make = car.make;
    const model = car.model.split(' ')[0];
    const year = car.year;

    try {
        const response = await fetch(`https://api.nhtsa.gov/recalls/recallsByVehicle?make=${make}&model=${model}&modelYear=${year}`);

        const data = await response.json();

        return data.results
    } catch (error) {
        console.error('Error fetching data:', error);
    }

}

async function getCarComplaints(id) {
    const car = await getCarById(id);

    const make = car.make;
    const model = car.model.split(' ')[0];
    const year = car.year;

    try {
        const response = await fetch(`https://api.nhtsa.gov/complaints/complaintsByVehicle?make=${make}&model=${model}&modelYear=${year}`);
        const data = await response.json();

        return data.results
    } catch (error) {
        console.error('Error fetching data:', error);
    }

}

async function addPredictor(carId, predictor) {
    
    if (!carId) {
        throw new Error("car id is empty");
    }

    const data = {
        predictor
    }

    const carData = await prisma.car.update({
        where: {id: carId},
        data: data
    })


    if (!carData) {
        throw new Error("the update was not completed");
    }

    return carData;
}

export { addCar, addPredictor, removeCar, updateCarDetails, carDetails, getCarById, getCarRatings, getCarRecalls, getCarComplaints, returnColour }