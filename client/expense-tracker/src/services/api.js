const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = `${BASE_URL}/api/expenses`;

let memoryCache = null;
let cacheTime = 0;
const CACHE_TTL = 30000; // 30 seconds cache TTL

export const fetchExpenses = async (forceRefresh = false) => {
  // Return cached data immediately if valid and not forcing refresh
  if (!forceRefresh && memoryCache && (Date.now() - cacheTime < CACHE_TTL)) {
    return memoryCache;
  }

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch expenses');
    const data = await response.json();
    memoryCache = data;
    cacheTime = Date.now();
    return data;
  } catch (error) {
    if (memoryCache) return memoryCache; // Fallback to cached data if network error
    throw error;
  }
};

export const createExpense = async (expenseData) => {
  memoryCache = null; // Invalidate cache
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
  memoryCache = null; // Invalidate cache
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
  memoryCache = null; // Invalidate cache
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete expense');
  return response.json();
};
