import { prisma } from "../config/db.js";
import { fetchCarImage } from "../services/scraper_services.js";

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
        make: capitaliseWords(make),
        model: capitaliseWords(model),
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

    console.log(img)

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

async function carDetails() {
    const cars = await prisma.car.findMany();
    return cars;
}

async function getCarById(id) {
    const car = await prisma.car.findUnique({
        where: {id: id}
    });

    return car;
}



export { addCar, removeCar, updateCarDetails, carDetails, getCarById }