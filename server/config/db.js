import mongoose from "mongoose";

const DEFAULT_MONGO_URI = "mongodb+srv://balakumaran2022_db_user:Bala2004@spendflow.tndf2.mongodb.net/spendflow?retryWrites=true&w=majority";

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.CLOUD_URI || DEFAULT_MONGO_URI;
    
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ Database Connection Warning:", error.message);
    // DO NOT call process.exit(1) so Express server stays alive and port binds on Render!
  }
};

export default connectDB;
