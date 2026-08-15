import { getExpenseModelForUser } from "../config/multiDb.js";

// Get All Expenses for logged in user
export const getExpenses = async (req, res) => {
  try {
    const ExpenseModel = await getExpenseModelForUser(req.user);
    const query = req.user 
      ? { $or: [{ user: req.user._id }, { user: { $exists: false } }, { user: null }] } 
      : {};
    const expenses = await ExpenseModel.find(query).sort({ date: -1 }).lean();
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

// Create Expense for logged in user
export const createExpense = async (req, res) => {
  try {
    const ExpenseModel = await getExpenseModelForUser(req.user);
    const { title, amount, category, date, description } = req.body;

    const expense = await ExpenseModel.create({
      title,
      amount,
      category,
      date,
      description,
      user: req.user ? req.user._id : undefined,
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
    const ExpenseModel = await getExpenseModelForUser(req.user);
    const { id } = req.params;
    const { title, amount, category, date, description } = req.body;

    const filter = req.user 
      ? { _id: id, $or: [{ user: req.user._id }, { user: { $exists: false } }, { user: null }] } 
      : { _id: id };

    const expense = await ExpenseModel.findOneAndUpdate(
      filter,
      { title, amount, category, date, description },
      { new: true, runValidators: true }
    );

    if (!expense) {
      return res.status(404).json({ success: false, message: "Expense not found or unauthorized" });
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

// Delete Expense (PERMANENT REMOVAL FROM MONGODB)
export const deleteExpense = async (req, res) => {
  try {
    const ExpenseModel = await getExpenseModelForUser(req.user);
    const { id } = req.params;

    const filter = req.user 
      ? { _id: id, $or: [{ user: req.user._id }, { user: { $exists: false } }, { user: null }] } 
      : { _id: id };

    const expense = await ExpenseModel.findOneAndDelete(filter);

    if (!expense) {
      // Try fallback delete by _id alone in user model
      const fallbackExpense = await ExpenseModel.findByIdAndDelete(id);
      if (!fallbackExpense) {
        return res.status(404).json({ success: false, message: "Expense not found or already deleted" });
      }
    }

    res.status(200).json({
      success: true,
      message: "Expense deleted successfully from database",
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Bulk Delete Expenses (PERMANENT REMOVAL FROM MONGODB)
export const deleteBulkExpenses = async (req, res) => {
  try {
    const ExpenseModel = await getExpenseModelForUser(req.user);
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide an array of expense IDs to delete",
      });
    }

    const filter = req.user
      ? { _id: { $in: ids }, $or: [{ user: req.user._id }, { user: { $exists: false } }, { user: null }] }
      : { _id: { $in: ids } };

    let result = await ExpenseModel.deleteMany(filter);

    // If result deletedCount is less than requested, try deleteMany by _id array
    if (result.deletedCount < ids.length) {
      const fallbackResult = await ExpenseModel.deleteMany({ _id: { $in: ids } });
      result = { deletedCount: Math.max(result.deletedCount, fallbackResult.deletedCount) };
    }

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} expenses deleted successfully from database`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
