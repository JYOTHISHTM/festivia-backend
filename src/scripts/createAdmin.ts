import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { AdminModel } from "../models/Admin"; 

const MONGO_URI = "mongodb://localhost:27017/FESTIVIA-PROJECT"; 

async function createAdmin() {
  try {
    await mongoose.connect(MONGO_URI);

    const existingAdmin = await AdminModel.findOne({ username: "admin" });
    if (existingAdmin) {
      mongoose.disconnect();
      return;
    }

    const hashedPassword = await bcrypt.hash("admin@123", 10);

    const newAdmin = new AdminModel({
      username: "admin",
      password: hashedPassword,
      isAdmin: true,
    });

    await newAdmin.save();

    mongoose.disconnect();
  } catch (error) {
    mongoose.disconnect();
  }
}

createAdmin();
