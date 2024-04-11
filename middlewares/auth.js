import dotenv from "dotenv";
import { asyncHanlder } from "../utils/asyncHanlder.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

dotenv.config({ path: "../config/.env" });

export const verifyJWT = asyncHanlder(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request!");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken._id).select(
      "-password, -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, " Invalid Access Token!");
    }

    if (user.role === "Admin") {
      req.admin = user;
      next();
    } else {
      req.patient = user;
      next();
    }
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
