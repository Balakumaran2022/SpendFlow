import Expense from "../models/Expense.js";

// Get All Expenses
export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 }).lean();
    res.setHeader("Cache-Control", "no-cache");
    res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create Expense
export const createExpense = async (req, res) => {
  try {
    const { title, amount, category, date, description } = req.body;

    const expense = await Expense.create({
      title,
      amount,
      category,
      date,
      description,
    });

    res.status(201).json({
      success: true,
      message: "Expense created successfully",
      data: expense,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Expense
export const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount, category, date, description } = req.body;

    const expense = await Expense.findByIdAndUpdate(
      id,
      { title, amount, category, date, description },
      { new: true, runValidators: true }
    );

    if (!expense) {
      return res.status(404).json({ success: false, message: "Expense not found" });
    }

    res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      data: expense,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Expense
export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const expense = await Expense.findByIdAndDelete(id);

    if (!expense) {
      return res.status(404).json({ success: false, message: "Expense not found" });
    }

    res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
