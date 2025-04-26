import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("✅ Connected to Primary MongoDB");
  } catch (err) {
    console.warn("⚠️ Failed to connect to primary, trying backup...");
    try {
      await mongoose.connect(process.env.MONGO_URI_BACKUP as string);
      console.log("✅ Connected to Backup MongoDB");
    } catch (backupErr) {
      console.error("❌ Failed to connect to both primary and backup MongoDB");
      process.exit(1);
    }
  }
};

export default connectDB;
