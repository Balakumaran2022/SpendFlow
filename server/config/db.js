import mongoose from "mongoose";

const DEFAULT_MONGO_URI = "mongodb://balakumarancse2022:tZzf6qGmo3sE4R6d@ac-c526wla-shard-00-00.wbinumd.mongodb.net:27017,ac-c526wla-shard-00-01.wbinumd.mongodb.net:27017,ac-c526wla-shard-00-02.wbinumd.mongodb.net:27017/spendflow?ssl=true&replicaSet=atlas-1044do-shard-0&authSource=admin&retryWrites=true&w=majority";

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || DEFAULT_MONGO_URI;

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      family: 4, // Force IPv4 to avoid IPv6 DNS resolution issues
    });

    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ Database Connection Warning:", error.message);
    // DO NOT call process.exit(1) so Express server stays alive on Render
  }
};

export default connectDB;
