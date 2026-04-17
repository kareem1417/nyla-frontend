import { create } from 'zustand';
import axios from 'axios';

export const useProductStore = create((set, get) => ({
    products: [],
    currentProduct: null,
    isLoading: false,
    error: null,

    fetchProducts: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get('https://nyla-backend.onrender.com/api/products');
            const productsData = response.data.products ? response.data.products : response.data;
            set({ products: productsData, isLoading: false });
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Failed to fetch products',
                isLoading: false
            });
        }
    },

    fetchProductById: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get(`https://nyla-backend.onrender.com/api/products/${id}`);
            set({ currentProduct: response.data, isLoading: false });
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Failed to fetch product',
                isLoading: false
            });
        }
    },

    createProduct: async (productData) => {
        set({ isLoading: true, error: null });
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo?.token}`
                }
            };

            await axios.post('https://nyla-backend.onrender.com/api/products', productData, config);

            get().fetchProducts();
            return { success: true };
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Error creating product',
                isLoading: false
            });
            return { success: false, message: error.response?.data?.message };
        }
    },
    updateProduct: async (id, productData) => {
        set({ isLoading: true, error: null });
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: { Authorization: `Bearer ${userInfo?.token}` }
            };

            await axios.put(`https://nyla-backend.onrender.com/api/products/${id}`, productData, config);

            get().fetchProducts();
            return { success: true };
        } catch (error) {
            set({ error: error.response?.data?.message || 'Error updating product', isLoading: false });
            return { success: false, message: error.response?.data?.message };
        }
    },

    deleteProduct: async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this product?');
        if (!confirmDelete) return { success: false };

        set({ isLoading: true, error: null });
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo?.token}`
                }
            };

            await axios.delete(`https://nyla-backend.onrender.com/api/products/${id}`, config);

            get().fetchProducts();
            return { success: true };
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Error deleting product',
                isLoading: false
            });
            return { success: false, message: error.response?.data?.message };
        }
    }
}));