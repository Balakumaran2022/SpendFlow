import mongoose from "mongoose";

const DEFAULT_MONGO_URI = "mongodb+srv://balakumarancse2022:tZzf6qGmo3sE4R6d@cluster0.wbinumd.mongodb.net/spendflow?retryWrites=true&w=majority&appName=Cluster0";

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || DEFAULT_MONGO_URI;

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ Database Connection Warning:", error.message);
    // DO NOT call process.exit(1) so Express server stays alive on Render
  }
};

export default connectDB;
