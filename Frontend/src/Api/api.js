import productsData from '../components/products/ProductDetail/data.js';

// Use environment variable or fallback to localhost
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Helper function to handle API requests with proper error handling
const fetchWithFallback = async (url, options = {}) => {
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('API request failed:', error);
        return null;
    }
};

// Products API
export const productsAPI = {
    getAll: async () => {
        const result = await fetchWithFallback(`${API_BASE_URL}/getProducts`);
        return result?.success ? result.products : productsData;
    },

    getById: async (id) => {
        const result = await fetchWithFallback(`${API_BASE_URL}/getProductById?productId=${id}`);
        return result?.success ? result.product : productsData.find(p => p.id === parseInt(id));
    },

    getByCategory: async (category) => {
        const result = await fetchWithFallback(`${API_BASE_URL}/getProductsByCategory?category=${category}`);
        return result?.success ? result.products : productsData.filter(p =>
            p.category.toLowerCase() === category.toLowerCase()
        );
    },

    search: async (query) => {
        const result = await fetchWithFallback(`${API_BASE_URL}/searchProducts?query=${query}`);
        return result?.success ? result.products : productsData.filter(p =>
            p.title.toLowerCase().includes(query.toLowerCase()) ||
            p.category.toLowerCase().includes(query.toLowerCase()) ||
            p.description.toLowerCase().includes(query.toLowerCase())
        );
    }
};

// Categories API
export const categoriesAPI = {
    getAll: async () => {
        const result = await fetchWithFallback(`${API_BASE_URL}/getCategories`);
        return result?.success ? result.categories : [...new Set(productsData.map(p => p.category))];
    }
};

// Admin API
export const adminAPI = {
    getProducts: async () => {
        const result = await fetchWithFallback(`${API_BASE_URL}/getProducts`);
        return result?.success ? result.products : productsData;
    },

    createProduct: async (productData) => {
        const result = await fetchWithFallback(`${API_BASE_URL}/createProduct`, {
            method: 'POST',
            body: JSON.stringify(productData)
        });
        return result || { success: false, error: 'Failed to create product' };
    },

    updateProduct: async (id, productData) => {
        const result = await fetchWithFallback(`${API_BASE_URL}/updateProduct`, {
            method: 'POST',
            body: JSON.stringify({ productId: id, productData })
        });
        return result || { success: false, error: 'Failed to update product' };
    },

    deleteProduct: async (id) => {
        const result = await fetchWithFallback(`${API_BASE_URL}/deleteProduct`, {
            method: 'POST',
            body: JSON.stringify({ productId: id })
        });
        return result || { success: false, error: 'Failed to delete product' };
    },

    duplicateProduct: async (id, newTitle, newPrice) => {
        const result = await fetchWithFallback(`${API_BASE_URL}/duplicateProduct`, {
            method: 'POST',
            body: JSON.stringify({ productId: id, newTitle, newPrice })
        });
        return result || { success: false, error: 'Failed to duplicate product' };
    }
};

// Orders API
export const ordersAPI = {
    getUserOrders: async (userId) => {
        const result = await fetchWithFallback(`${API_BASE_URL}/getUserOrders?userId=${userId}`);
        return result?.success ? result.orders : [];
    }
};

// Payment API
export const paymentAPI = {
    createPaymentIntent: async (amount, currency) => {
        const result = await fetchWithFallback(`${API_BASE_URL}/createPaymentIntent`, {
            method: 'POST',
            body: JSON.stringify({ amount, currency })
        });
        return result;
    },

    processPayment: async (paymentData) => {
        const result = await fetchWithFallback(`${API_BASE_URL}/processPayment`, {
            method: 'POST',
            body: JSON.stringify(paymentData)
        });
        return result;
    }
};

// Health check
export const healthAPI = {
    check: async () => {
        return await fetchWithFallback(`${API_BASE_URL}/health`);
    }
};

// Combined API object for backward compatibility
const api = {
    products: productsAPI,
    categories: categoriesAPI,
    admin: adminAPI,
    orders: ordersAPI,
    payment: paymentAPI,
    health: healthAPI
};

export default api;

// Individual export for backward compatibility
export const getProducts = async () => {
    console.log('getProducts function called');
    const data = await productsAPI.getAll();
    console.log('Products API returned:', data);
    return { data };
};

export const getProductsAdmin = async () => {
    const data = await adminAPI.getProducts();
    return { data };
};

export const createProduct = async (productData) => {
    return await adminAPI.createProduct(productData);
};

export const updateProduct = async (id, productData) => {
    return await adminAPI.updateProduct(id, productData);
};

export const deleteProduct = async (id) => {
    return await adminAPI.deleteProduct(id);
};

export const duplicateProduct = async (id, newTitle, newPrice) => {
    return await adminAPI.duplicateProduct(id, newTitle, newPrice);
};

export const getProductById = async (id) => {
    const data = await productsAPI.getById(id);
    return { data };
};

export const getProductsByCategory = async (category) => {
    const data = await productsAPI.getByCategory(category);
    return { data };
};

export const searchProducts = async (query) => {
    const data = await productsAPI.search(query);
    return { data };
};

export const getUserOrders = async (userId) => {
    const data = await ordersAPI.getUserOrders(userId);
    return { data };
};
