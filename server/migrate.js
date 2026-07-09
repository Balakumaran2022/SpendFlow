import mongoose from "mongoose";
import Expense from "./models/Expense.js";

const LOCAL_URI = "mongodb://localhost:27017/expense-tracker";
const CLOUD_URI = "mongodb://balakumarancse2022_db_user:9ajujk2uWqRGxbtW@ac-kmg9bmy-shard-00-00.xdbkx95.mongodb.net:27017,ac-kmg9bmy-shard-00-01.xdbkx95.mongodb.net:27017,ac-kmg9bmy-shard-00-02.xdbkx95.mongodb.net:27017/expense-tracker?ssl=true&replicaSet=atlas-mt8b0q-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

async function migrate() {
  try {
    console.log("Connecting to Local DB...");
    const localDb = await mongoose.createConnection(LOCAL_URI).asPromise();
    const LocalExpense = localDb.model("Expense", Expense.schema);
    
    console.log("Fetching local expenses...");
    const localData = await LocalExpense.find({}).lean();
    console.log(`Found ${localData.length} expenses in local DB.`);

    if (localData.length === 0) {
      console.log("Nothing to migrate!");
      process.exit(0);
    }

    console.log("Connecting to Cloud DB...");
    const cloudDb = await mongoose.createConnection(CLOUD_URI).asPromise();
    const CloudExpense = cloudDb.model("Expense", Expense.schema);

    console.log("Clearing existing cloud data to avoid duplicates...");
    await CloudExpense.deleteMany({});

    console.log("Inserting into Cloud DB...");
    await CloudExpense.insertMany(localData);

    console.log(`Successfully migrated ${localData.length} records to the cloud!`);
    
    await localDb.close();
    await cloudDb.close();
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrate();
