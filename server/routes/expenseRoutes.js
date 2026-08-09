import express from "express";
import { createExpense, getExpenses, updateExpense, deleteExpense, deleteBulkExpenses } from "../controllers/expenseController.js";

const router = express.Router();

// GET /api/expenses - Fetch all expenses
router.get("/", getExpenses);

// POST /api/expenses - Create new expense
router.post("/", createExpense);

// POST /api/expenses/bulk-delete - Bulk delete expenses
router.post("/bulk-delete", deleteBulkExpenses);

// PUT /api/expenses/:id - Update expense (Full)
router.put("/:id", updateExpense);

// PATCH /api/expenses/:id - Update expense (Partial)
router.patch("/:id", updateExpense);

// DELETE /api/expenses/:id - Delete expense
router.delete("/:id", deleteExpense);

export default router;

