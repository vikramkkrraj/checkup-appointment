import mongoose, { Schema } from 'mongoose';
import validator from 'validator';

const appointmentSchema = new Schema({
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
      appointment_date: {
        type: String,
        required: [true, "Appointment Date Is Required!"],
      },
      department: {
        type: String,
        required: [true, "Department Name Is Required!"],
      },
      doctor: {
        firstname: {
          type: String,
          required: [true, "Doctor Name Is Required!"],
        },
        lastname: {
          type: String,
          required: [true, "Doctor Name Is Required!"],
        },
      },
      hasVisited: {
        type: Boolean,
        default: false,
      },
      address: {
        type: String,
        required: [true, "Address Is Required!"],
      },
      doctorId: {
        type: mongoose.Schema.ObjectId,
        required: [true, "Doctor Id Is Invalid!"],
      },
      patientId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "Patient Id Is Required!"],
      },
      status: {
        type: String,
        enum: ["Pending", "Accepted", "Rejected"],
        default: "Pending",
      },
}, { timestamps : true })


export const Appointment = mongoose.model("Appointment", appointmentSchema);