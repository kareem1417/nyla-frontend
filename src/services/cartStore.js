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
    buyXGetCheapestFree: false,

    fetchShippingFee: async () => {
        try {
            const { data } = await axios.get(`${BASE_URL}/api/settings`);
            set({
                shippingFee: data.shippingFee,
                buyXGetCheapestFree: data.buyXGetCheapestFree || false,
            });
        } catch (error) {
            console.error("Error fetching shipping fee", error);
        }
    },

    // Compute the cheapest item's unit price when the offer is active
    getFreeItemSaving: () => {
        const { cartItems, buyXGetCheapestFree } = get();

        // لو العرض مقفول من الإعدادات، مفيش خصم
        if (!buyXGetCheapestFree) {
            return { saving: 0, freeItemName: null };
        }

        // 1. فك المنتجات كلها في مصفوفة واحدة (عشان نقدر نحسب القطع المتكررة)
        let allItemsExpanded = [];
        for (const item of cartItems) {
            for (let i = 0; i < item.quantity; i++) {
                allItemsExpanded.push({ price: item.unitPrice, name: item.productName });
            }
        }

        // 2. حساب عدد القطع المجانية (كل 4 قطع في الكارت ليهم 1 فري)
        const totalQty = allItemsExpanded.length;
        const freeItemsCount = Math.floor(totalQty / 4);

        if (freeItemsCount === 0) return { saving: 0, freeItemName: null };

        // 3. ترتيب المنتجات من الأرخص للأغلى
        allItemsExpanded.sort((a, b) => a.price - b.price);

        // 4. ناخد أول مجموعة (الأرخص) على قد عدد القطع المجانية ونجمع سعرهم
        const freeItems = allItemsExpanded.slice(0, freeItemsCount);
        const saving = freeItems.reduce((sum, item) => sum + item.price, 0);

        // 5. نجيب أسامي المنتجات الفري بدون تكرار عشان نعرضها للعميل
        const uniqueNames = [...new Set(freeItems.map(i => i.name))].join(' & ');

        return { saving: Math.round(saving * 100) / 100, freeItemName: uniqueNames };
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