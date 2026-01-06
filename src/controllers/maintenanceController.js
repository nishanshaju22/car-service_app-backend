import { addToMaintenance } from "../manager/maintenance.js";

async function addToMaintenanceController(req, res) {
    const { carId, servId, mileage, mileageServicedAt, cost } = req.body;

    try {
        const result = await addToMaintenance(carId, servId, mileage, mileageServicedAt, cost);
        return res.status(201).json(result);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

// async function loginController(req, res) {
//     const {email, password} = req.body;

//     try {
//         const result = await login(email, password, res);
//         return res.status(201).json(result);
//     } catch (error) {
//         return res.status(400).json({ error: error.message });
//     }
// }

// async function logoutController(req, res) {
//     res.cookie("jwt", "", {
//         httpOnly: true,
//         expires: new Date(0)
//     });
//     res.status(200).json({
//         status: "success",
//         message: "Logged out successfully"
//     });
// }

// async function removeUserController(req, res) {
//     try {
//         const result = await deleteUser(req.user);
//         return res.status(201).json(result);
//     } catch (error) {
//         return res.status(400).json({ error: error.message });
//     }
// }

// async function updateUserDetailsController(req, res) {
    
//     const {email, password, name} = req.body
    
//     try {
//         const result = await updateUserDetails(req.user, email, password, name);
//         return res.status(201).json(result);
//     } catch (error) {
//         return res.status(400).json({ error: error.message });
//     }

// }

export { addToMaintenanceController };