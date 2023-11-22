import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_DB_URI!);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
