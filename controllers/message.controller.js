import { asyncHanlder } from "../utils/asyncHanlder.js";
import { ApiError } from "../utils/ApiError.js";
import { Message } from "../models/message.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const sendMessage = asyncHanlder(async (req, res) => {
  const { firstname, lastname, email, phone, message } = req.body;
  if (
    [firstname, lastname, email, phone, message].some((field) => field === "")
  ) {
    throw new ApiError(400, "All fields are Required!!");
  }

  await Message.create({
    firstname,
    lastname,
    email,
    phone,
    message,
  });

  return res.status(201).json(new ApiResponse(200, {}, "Message Sent!!"));
});

export const getAllMessage = asyncHanlder(async (req, res) => {
  if (req.patient) {
    throw new ApiError(409, "Unauthorized request!!");
  }
  const message = await Message.find();
  return res.status(200).json(new ApiResponse(200, message));
});
