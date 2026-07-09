const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = `${BASE_URL}/api/expenses`;

export const fetchExpenses = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Failed to fetch expenses');
  return response.json();
};

export const createExpense = async (expenseData) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(expenseData),
  });
  if (!response.ok) throw new Error('Failed to create expense');
  return response.json();
};

export const updateExpense = async (id, expenseData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(expenseData),
  });
  if (!response.ok) throw new Error('Failed to update expense');
  return response.json();
};

export const deleteExpense = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete expense');
  return response.json();
};
