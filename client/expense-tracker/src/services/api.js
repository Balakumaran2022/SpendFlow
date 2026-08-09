const PRIMARY_URL = import.meta.env.VITE_API_URL || 'https://spendflow-zh3z.onrender.com';
const FALLBACK_URL = 'https://spendflow-zh3z.onrender.com';

const API_PATH = '/api/expenses';

let memoryCache = null;
let cacheTime = 0;
const CACHE_TTL = 30000; // 30 seconds cache TTL

const fetchWithFallback = async (endpoint, options = {}) => {
  const primaryEndpoint = `${PRIMARY_URL}${endpoint}`;
  try {
    const res = await fetch(primaryEndpoint, options);
    if (res.ok) return res;
    throw new Error(`Primary request failed with status ${res.status}`);
  } catch (err) {
    if (PRIMARY_URL !== FALLBACK_URL) {
      console.warn("Primary API failed, attempting fallback to Render server:", err.message);
      const fallbackEndpoint = `${FALLBACK_URL}${endpoint}`;
      return await fetch(fallbackEndpoint, options);
    }
    throw err;
  }
};

export const fetchExpenses = async (forceRefresh = false) => {
  if (!forceRefresh && memoryCache && (Date.now() - cacheTime < CACHE_TTL)) {
    return memoryCache;
  }

  try {
    const response = await fetchWithFallback(API_PATH);
    if (!response.ok) throw new Error('Failed to fetch expenses');
    const data = await response.json();
    memoryCache = data;
    cacheTime = Date.now();
    return data;
  } catch (error) {
    if (memoryCache) return memoryCache;
    throw error;
  }
};

export const createExpense = async (expenseData) => {
  memoryCache = null;
  const response = await fetchWithFallback(API_PATH, {
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
  memoryCache = null;
  const response = await fetchWithFallback(`${API_PATH}/${id}`, {
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
  memoryCache = null;
  const response = await fetchWithFallback(`${API_PATH}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete expense');
  return response.json();
};

export const bulkDeleteExpenses = async (ids) => {
  memoryCache = null;
  const response = await fetchWithFallback(`${API_PATH}/bulk-delete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ids }),
  });
  if (!response.ok) throw new Error('Failed to perform bulk delete');
  return response.json();
};

