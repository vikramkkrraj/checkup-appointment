import { Router } from "express";
import { verifyJWT } from '../middlewares/auth.js';
import { bookAppointment, deleteAppointment, getAllAppointment, updateAppointmentStatus } from "../controllers/appointment.controller.js";

const router = Router();


router.route("/book-appointment").post(verifyJWT, bookAppointment);
router.route("/update-appointment-status/:id").put(verifyJWT, updateAppointmentStatus);
router.route("/delete-appointment/:id").delete(verifyJWT, deleteAppointment);
router.route("/get-all-appointments").get(verifyJWT,getAllAppointment);

export default router;