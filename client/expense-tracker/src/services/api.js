const PRIMARY_URL = import.meta.env.VITE_API_URL || 'https://spendflow-zh3z.onrender.com';
const FALLBACK_URL = 'https://spendflow-zh3z.onrender.com';

const API_PATH = '/api/expenses';
const AUTH_PATH = '/api/auth';

let memoryCache = null;
let cacheTime = 0;
const CACHE_TTL = 15000; // 15 seconds cache TTL

const getAuthHeaders = () => {
  const token = localStorage.getItem('balaspend_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Helper: Read locally stored cached expenses for INSTANT 0ms rendering
export const getCachedExpensesLocally = () => {
  try {
    const cached = localStorage.getItem('balaspend_cached_expenses');
    return cached ? JSON.parse(cached) : [];
  } catch {
    return [];
  }
};

// Helper: Save expenses to local storage for INSTANT load
const setCachedExpensesLocally = (expensesArray) => {
  try {
    localStorage.setItem('balaspend_cached_expenses', JSON.stringify(expensesArray));
  } catch (_) {}
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

// Expenses API Services - STALE-WHILE-REVALIDATE INSTANT LOAD
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

    // Cache locally for INSTANT 0ms load on next visit
    if (data.data && Array.isArray(data.data)) {
      setCachedExpensesLocally(data.data);
    }

    return data;
  } catch (error) {
    if (memoryCache) return memoryCache;

    // Fallback to local cache if network fails
    const localData = getCachedExpensesLocally();
    if (localData && localData.length > 0) {
      return { success: true, count: localData.length, data: localData };
    }

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
  const result = await response.json();

  // Optimistically update local cache
  if (result.data) {
    const current = getCachedExpensesLocally();
    setCachedExpensesLocally([result.data, ...current]);
  }

  return result;
};

export const updateExpense = async (id, expenseData) => {
  memoryCache = null;
  const response = await fetchWithFallback(`${API_PATH}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(expenseData),
  });
  if (!response.ok) throw new Error('Failed to update expense');
  const result = await response.json();

  // Optimistically update local cache
  if (result.data) {
    const current = getCachedExpensesLocally();
    const updated = current.map(item => item._id === id ? result.data : item);
    setCachedExpensesLocally(updated);
  }

  return result;
};

export const deleteExpense = async (id) => {
  memoryCache = null;
  const response = await fetchWithFallback(`${API_PATH}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete expense');
  const result = await response.json();

  // Optimistically update local cache
  const current = getCachedExpensesLocally();
  const filtered = current.filter(item => item._id !== id);
  setCachedExpensesLocally(filtered);

  return result;
};

export const bulkDeleteExpenses = async (ids) => {
  memoryCache = null;
  const response = await fetchWithFallback(`${API_PATH}/bulk-delete`, {
    method: 'POST',
    body: JSON.stringify({ ids }),
  });
  if (!response.ok) throw new Error('Failed to perform bulk delete');
  const result = await response.json();

  // Optimistically update local cache
  if (Array.isArray(ids)) {
    const current = getCachedExpensesLocally();
    const filtered = current.filter(item => !ids.includes(item._id));
    setCachedExpensesLocally(filtered);
  }

  return result;
};
