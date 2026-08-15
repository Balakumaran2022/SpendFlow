import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },

    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: 1,
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Food",
        "Travel",
        "Shopping",
        "Bills",
        "Health",
        "Entertainment",
        "Others",
      ],
    },

    date: {
      type: Date,
      default: Date.now,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for ultra-fast query performance
expenseSchema.index({ user: 1, date: -1 });
expenseSchema.index({ date: -1 });
expenseSchema.index({ category: 1, date: -1 });


const Expense = mongoose.model("Expense", expenseSchema);

export default Expense;
