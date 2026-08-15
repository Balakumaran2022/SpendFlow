const PRIMARY_URL = import.meta.env.VITE_API_URL || 'https://spendflow-zh3z.onrender.com';
const FALLBACK_URL = 'https://spendflow-zh3z.onrender.com';

const API_PATH = '/api/expenses';
const AUTH_PATH = '/api/auth';

let memoryCache = null;
let cacheTime = 0;
const CACHE_TTL = 30000; // 30 seconds cache TTL

const getAuthHeaders = () => {
  const token = localStorage.getItem('balaspend_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const fetchWithFallback = async (endpoint, options = {}) => {
  const headers = {
    ...getAuthHeaders(),
    ...(options.headers || {}),
  };

  const requestOptions = {
    ...options,
    headers,
  };

  const primaryEndpoint = `${PRIMARY_URL}${endpoint}`;
  try {
    const res = await fetch(primaryEndpoint, requestOptions);
    return res;
  } catch (err) {
    if (PRIMARY_URL !== FALLBACK_URL) {
      console.warn("Primary API network error, attempting fallback to Render server:", err.message);
      const fallbackEndpoint = `${FALLBACK_URL}${endpoint}`;
      return await fetch(fallbackEndpoint, requestOptions);
    }
    throw err;
  }
};

// Authentication API Services
export const loginApi = async (credentials) => {
  const response = await fetchWithFallback(`${AUTH_PATH}/login`, {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Login failed. Please check credentials.');
  }
  return data;
};

export const registerApi = async (userData) => {
  const response = await fetchWithFallback(`${AUTH_PATH}/register`, {
    method: 'POST',
    body: JSON.stringify(userData),
  });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Registration failed. Please check inputs.');
  }
  return data;
};

export const getMeApi = async () => {
  const response = await fetchWithFallback(`${AUTH_PATH}/me`, {
    method: 'GET',
  });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to fetch user profile');
  }
  return data;
};

// Expenses API Services
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
    body: JSON.stringify(expenseData),
  });
  if (!response.ok) throw new Error('Failed to create expense');
  return response.json();
};

export const updateExpense = async (id, expenseData) => {
  memoryCache = null;
  const response = await fetchWithFallback(`${API_PATH}/${id}`, {
    method: 'PUT',
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
    body: JSON.stringify({ ids }),
  });
  if (!response.ok) throw new Error('Failed to perform bulk delete');
  return response.json();
};
