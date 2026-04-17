import { create } from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';

const wishlistFromStorage = localStorage.getItem('wishlistItems')
    ? JSON.parse(localStorage.getItem('wishlistItems'))
    : [];

export const useWishlistStore = create((set, get) => ({
    wishlistItems: wishlistFromStorage,

    toggleWishlist: async (product) => {
        const currentItems = get().wishlistItems;
        const isExist = currentItems.find((item) => item._id === product._id);

        let newItems;
        if (isExist) {
            newItems = currentItems.filter((item) => item._id !== product._id);
        } else {
            newItems = [...currentItems, product];
        }
        localStorage.setItem('wishlistItems', JSON.stringify(newItems));
        set({ wishlistItems: newItems });

        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo && userInfo.token) {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };

                await axios.post('https://nyla-backend.onrender.com/api/users/wishlist', { productId: product._id }, config);

            } catch (error) {
                console.error('Wishlist Sync Error:', error);
                toast.error('Could not sync wishlist with your account');
            }
        }
    },
    isInWishlist: (productId) => {
        return get().wishlistItems.some((item) => item._id === productId);
    },
    clearWishlist: () => {
        localStorage.removeItem('wishlistItems');
        set({ wishlistItems: [] });
    }
}));