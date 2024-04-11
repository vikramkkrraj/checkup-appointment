import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

export const generateAccessTokenAndRefreshToken = async(userID) => {
    try {
        const user = await User.findById(userID);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave : false })

        return { accessToken, refreshToken }
    } catch (error) {
        console.log(error);
        throw new ApiError(500, "Something went wrong while generating access and refersh token")
    }
}