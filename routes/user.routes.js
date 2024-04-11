import { Router } from "express";
import { addNewAdmin, addNewDoctor, getAllDoctors, getCurrentUser, login, logout, register } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.js";
import { upload } from '../middlewares/multer.js';

const router = Router();


router.post("/register",register);
router.post("/login", login);
router.post("/add-new-admin", verifyJWT, addNewAdmin);
router.post("/add-new-doctor", verifyJWT, upload.single('avatar') ,addNewDoctor);
router.get("/get-all-doctors", getAllDoctors);
router.get("/get-currentUser-details", verifyJWT, getCurrentUser);
router.get("/logout", verifyJWT, logout);

export default router;