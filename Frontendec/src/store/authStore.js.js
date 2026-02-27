import { create } from 'zustand';

const useAuthStore = create((set) => ({
    // Check if user exists in localStorage on initial load
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),

    login: (userData, token) => {
        // Agar userData khud hi user object hai, toh wahi use karein
        const finalUser = userData?.user || userData;
        if (!finalUser) return; // Kuch save mat karo agar user data hi nahi hai

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(finalUser));
        set({ user: finalUser, token, isAuthenticated: true });
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ user: null, token: null, isAuthenticated: false });
    },

    // store/authStore.js mein ye add karein (agar nahi hai)
    // store/authStore.js mein updateCart ko aise likhein
    updateCart: (cartData) => set((state) => {
        const updatedUser = { ...state.user, cart: cartData };
        // Refresh par data na khoye isliye localStorage mein bhi daalein
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return { user: updatedUser };
    }),
}
));

export default useAuthStore;