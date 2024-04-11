import mongoose from "mongoose";
import validator from "validator";

const messageSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      validate: [validator.isEmail, "Provide A Valid Email!"],
    },
    phone: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
      minLength: [10, "Message Must Contain At Least 10 Characters!"],
    },
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);
