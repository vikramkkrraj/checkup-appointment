import { asyncHanlder } from "../utils/asyncHanlder.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateAccessTokenAndRefreshToken } from "../services/generateToken.js";
import { uploadOnCloudinary } from "../services/cloudinary.js";

export const register = asyncHanlder(async (req, res) => {
  const { firstname, lastname, email, phone, dob, gender, password } = req.body;

  if (
    [firstname, lastname, email, phone, dob, gender, password].some(
      (field) => field === ""
    )
  ) {
    throw new ApiError(400, "All Fields are required!");
  }

  const isExist = await User.findOne({ email }).select(
    "-password, -refreshToken"
  );

  if (isExist) {
    throw new ApiError(409, "User Already exists with this email");
  }

  const user = await User.create({
    firstname,
    lastname,
    email,
    phone,
    dob,
    gender,
    password,
    role: "Patient",
  });

  return res.status(201).json(new ApiResponse(201, user, "User Registered!"));
});

export const login = asyncHanlder(async (req, res) => {
  const { email, password, role } = req.body;

  if ([email, password, role].some((field) => field === "")) {
    throw new ApiError(400, "All fields are Required");
  }

  const user = await User.findOne({ email });

  if (!user) throw new ApiError(404, "User not found!!");

  if (user.role !== role) {
    throw new ApiError(401, "You are not authorized for this resources");
  }

  const verifyPassword = await user.comparePassword(password);
  if (!verifyPassword) throw new ApiError(401, "Invalid user password!");

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user?._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = { httpOnly: true, secure: true };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User LoggedIn Successfully!"
      )
    );
});

export const addNewAdmin = asyncHanlder(async (req, res) => {
  if (!req.admin) {
    throw new ApiError(409, "You are not authorized for this resouces");
  }
  const { firstname, lastname, email, phone, dob, gender, password } = req.body;

  if (
    [firstname, lastname, email, phone, dob, gender, password].some(
      (field) => field === ""
    )
  ) {
    throw new ApiError(400, "All Fields are required!!");
  }

  const isRegistered = await User.findOne({ email });

  if (isRegistered)
    throw new ApiError(400, "Admin with this email id already Registered!");

  const admin = await User.create({
    firstname,
    lastname,
    email,
    phone,
    dob,
    gender,
    password,
    role: "Admin",
  });
  return res
    .status(201)
    .json(new ApiResponse(201, admin, "New Admin Added Successfully!!"));
});

export const addNewDoctor = asyncHanlder(async (req, res) => {
  if (!req.admin) {
    throw new ApiError(409, "You are not authorized for this resouces");
  }

  const {
    firstname,
    lastname,
    email,
    phone,
    dob,
    gender,
    password,
    doctorDepartment,
  } = req.body;

  if (
    [
      firstname,
      lastname,
      email,
      phone,
      dob,
      gender,
      password,
      doctorDepartment,
    ].some((field) => field === "")
  ) {
    throw new ApiError(400, "All fields are required!");
  }

  console.log(req.file);
  let avatarLocalPath;
  if (req.file && Object.keys(req.file).length !== 0) {
    avatarLocalPath = req.file.path;
  } else {
    throw new ApiError(400, "Avatar file is required!!");
  }
  console.log(avatarLocalPath);

  const isExist = await User.findOne({ email });
  if (isExist)
    throw new ApiError(400, "Doctor with this email id already exists");

  const cloudinaryRespone = await uploadOnCloudinary(avatarLocalPath);

  const doctor = await User.create({
    firstname,
    lastname,
    email,
    phone,
    dob,
    gender,
    password,
    doctorDepartment,
    avatar: {
      public_id: cloudinaryRespone.public_id,
      url: cloudinaryRespone.url,
    },
    role: "Doctor",
  });

  return res
    .status(201)
    .json(new ApiResponse(201, doctor, "New Doctor Registered!!"));
});

export const getAllDoctors = asyncHanlder(async (req, res) => {
  const doctors = await User.find({ role: "Doctor" });
  return res.status(200).json(new ApiResponse(200, doctors));
});

export const getCurrentUser = asyncHanlder(async (req, res) => {
  const user = req.patient || req.admin;
  return res.status(200).json(new ApiResponse(200, user));
});

export const logout = asyncHanlder(async (req, res) => {
  const user = req.patient || req.admin;
  await User.findByIdAndUpdate(
    user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const options = { httpOnly: true, secure: true };
  return res
  .status(200)
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json(new ApiResponse(200, {}, "User Logged Out!"))
});
