import { Router } from "express";
import { getAllMessage, sendMessage } from "../controllers/message.controller.js";
import { verifyJWT } from '../middlewares/auth.js';

const router = Router();


router.post("/send-message", sendMessage);
router.get("/get-all-messages", verifyJWT, getAllMessage)



export default router;