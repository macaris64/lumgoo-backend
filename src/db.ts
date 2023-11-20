import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    console.log('url: ', process.env.MONGO_DB_URI)
    const conn = await mongoose.connect(process.env.MONGO_DB_URI!);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
