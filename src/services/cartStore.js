import { create } from 'zustand';
import axios from 'axios';
import BASE_URL from '../../config';
const cartFromStorage = localStorage.getItem('nyla_cart')
    ? JSON.parse(localStorage.getItem('nyla_cart'))
    : [];

export const useCartStore = create((set, get) => ({
    cartItems: cartFromStorage,
    isOpen: false,
    toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
    cartTotal: cartFromStorage.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0),

    shippingFee: 0,
    fetchShippingFee: async () => {
        try {
            const { data } = await axios.get(`${BASE_URL}/api/settings`);
            set({ shippingFee: data.shippingFee });
        } catch (error) {
            console.error("Error fetching shipping fee", error);
        }
    },

    addItem: (newItem) => {
        const currentItems = get().cartItems;
        const existingItem = currentItems.find(item => item.productId === newItem.productId && item.variantId === newItem.variantId);
        let updatedItems;
        if (existingItem) {
            updatedItems = currentItems.map(item =>
                (item.productId === newItem.productId && item.variantId === newItem.variantId)
                    ? { ...item, quantity: item.quantity + newItem.quantity }
                    : item
            );
        } else {
            updatedItems = [...currentItems, newItem];
        }
        const newTotal = updatedItems.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
        localStorage.setItem('nyla_cart', JSON.stringify(updatedItems));
        set({ cartItems: updatedItems, cartTotal: newTotal, isOpen: true });
    },

    removeItem: (productId, variantId) => {
        const updatedItems = get().cartItems.filter(item => !(item.productId === productId && item.variantId === variantId));
        const newTotal = updatedItems.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
        localStorage.setItem('nyla_cart', JSON.stringify(updatedItems));
        set({ cartItems: updatedItems, cartTotal: newTotal });
    },

    updateQuantity: (productId, variantId, quantity) => {
        if (quantity < 1) return;
        const updatedItems = get().cartItems.map(item =>
            (item.productId === productId && item.variantId === variantId)
                ? { ...item, quantity }
                : item
        );
        const newTotal = updatedItems.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
        localStorage.setItem('nyla_cart', JSON.stringify(updatedItems));
        set({ cartItems: updatedItems, cartTotal: newTotal });
    },

    appliedCoupon: null,
    setAppliedCoupon: (coupon) => set({ appliedCoupon: coupon }),
    removeCoupon: () => set({ appliedCoupon: null }),

    clearCart: () => {
        localStorage.removeItem('nyla_cart');
        set({ cartItems: [], cartTotal: 0 });
    }
}));