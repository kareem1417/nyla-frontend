import { create } from 'zustand';

const userInfoFromStorage = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null;

export const useAuthStore = create((set) => ({
    user: userInfoFromStorage,
    isLoading: false,
    error: null,

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch('http://localhost:5000/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'فشل تسجيل الدخول');

            localStorage.setItem('userInfo', JSON.stringify(data));
            set({ user: data, isLoading: false });
            return true;
        } catch (error) {
            set({ error: error.message, isLoading: false });
            return false;
        }
    },

    register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch('http://localhost:5000/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'فشل إنشاء الحساب');

            localStorage.setItem('userInfo', JSON.stringify(data));
            set({ user: data, isLoading: false });
            return true;
        } catch (error) {
            set({ error: error.message, isLoading: false });
            return false;
        }
    },

    logout: () => {
        localStorage.removeItem('userInfo');
        localStorage.removeItem('wishlistItems');
        localStorage.removeItem('nyla_cart');

        set({ user: null });
    }
}));