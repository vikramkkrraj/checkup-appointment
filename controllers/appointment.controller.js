import { ApiError } from "../utils/ApiError.js";
import { asyncHanlder } from "../utils/asyncHanlder.js";
import { User } from "../models/user.model.js";
import { Appointment } from "../models/appointment.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const bookAppointment = asyncHanlder(async (req, res) => {
  const {
    appointment_date,
    doctor_firstname,
    doctor_lastname,
    hasVisited,
    address,
    department,
  } = req.body;

  const { firstname, lastname, phone, email, gender, dob, _id } = req.patient;

  if (
    [
      firstname,
      lastname,
      email,
      phone,
      dob,
      gender,
      appointment_date,
      address,
      hasVisited,
      department,
      doctor_firstname,
      doctor_lastname,
    ].some((field) => field === "")
  ) {
    throw new ApiError(400, "All fields are required!!");
  }

  const doctor = await User.findOne({
    firstname: doctor_firstname,
    lastname: doctor_lastname,
    role: "Doctor",
    doctorDepartment: department,
  });
  const doctorId = doctor?._id;
  const patientId = _id;

  const appointment = await Appointment.create({
    firstname,
    lastname,
    phone,
    gender,
    dob,
    email,
    appointment_date,
    department,
    hasVisited,
    doctorId,
    patientId,
    address,
    doctor: {
      firstname: doctor_firstname,
      lastname: doctor_lastname,
    },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, appointment, "Appointment Booked!!"));
});

export const getAllAppointment = asyncHanlder(async (req, res) => {
  if (req.patient) {
    throw new ApiError(409, "Unthorized Request");
  }
  const appointments = await Appointment.find();
  return res.status(200).json(new ApiResponse(200, appointments));
});

export const updateAppointmentStatus = asyncHanlder(async (req, res) => {
  if (req.patient) {
    throw new ApiError(409, "Unthorized Request");
  }
  try {
    const { id } = req.params;
    const appointment = await Appointment.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Apppointment Status Updated"));
  } catch (error) {
    console.log(error);
    throw new ApiError(
      500,
      "Something  went wrong in update appointment status api"
    );
  }
});

export const deleteAppointment = asyncHanlder(async (req, res) => {
  if (req.patient) {
    throw new ApiError(409, "Unthorized Request");
  }
  try {
    const { id } = req.params;
    await Appointment.findByIdAndDelete(id);
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Appointment Deleted!!"));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Something is wrong in delete api");
  }
});
