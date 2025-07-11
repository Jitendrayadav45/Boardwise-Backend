import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGO_URL, {
      dbName: process.env.DB_NAME,
    });
    console.log(`\n✅ ✅ ✅ Database connected successfully! DB Host: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log("❌❌❌ [MongoDB] Connection Failed 😢", error);
    process.exit(1);
  }
};

export default connectDB;
