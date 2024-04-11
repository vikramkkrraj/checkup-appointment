import dotenv from "dotenv";
import mongoose, { Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config({
  path: "./config/.env",
});

const userSchema = new Schema(
  {
    firstname: {
      type: String,
      required: [true, "First Name Is Required!"],
    },
    lastname: {
      type: String,
      required: [true, "Last Name Is Required!"],
    },
    email: {
      type: String,
      required: [true, "Email Is Required!"],
      validate: [validator.isEmail, "Provide A Valid Email!"],
    },
    phone: {
      type: String,
      required: [true, "Phone Is Required!"],
    },
    dob: {
      type: Date,
      required: [true, "DOB Is Required!"],
    },
    gender: {
      type: String,
      required: [true, "Gender Is Required!"],
      enum: ["Male", "Female"],
    },
    password: {
      type: String,
      required: [true, "Password Is Required!"],
      minLength: [6, "Password Must Contain At Least 8 Characters!"],
    },
    role: {
      type: String,
      required: [true, "User Role Required!"],
      enum: ["Patient", "Doctor", "Admin"],
    },
    doctorDepartment: {
      type: String,
    },
    avatar: {
      public_id: String, // cloudinary
      url: String,
    },

    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullname: this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
