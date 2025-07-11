import mongoose, { connect } from "mongoose";
import { DB_NAME } from "../consants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await connect(`${process.env.MONGO_URL}`);
    console.log(`\n✅ ✅ ✅ Database connected successfully! DB Host: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log("❌❌❌ [MongoDB] Connection Failed 😢", error);
    process.exit(1);
  }
};

export default connectDB;
