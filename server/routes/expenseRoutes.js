import express from "express";
import { createExpense, getExpenses, updateExpense, deleteExpense, deleteBulkExpenses } from "../controllers/expenseController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply protect middleware to all expense routes
router.use(protect);

// GET /api/expenses - Fetch user expenses
router.get("/", getExpenses);

// POST /api/expenses - Create new expense
router.post("/", createExpense);

// POST /api/expenses/bulk-delete - Bulk delete expenses
router.post("/bulk-delete", deleteBulkExpenses);

// PUT /api/expenses/:id - Update expense
router.put("/:id", updateExpense);

// PATCH /api/expenses/:id - Update expense
router.patch("/:id", updateExpense);

// DELETE /api/expenses/:id - Delete expense
router.delete("/:id", deleteExpense);

export default router;
