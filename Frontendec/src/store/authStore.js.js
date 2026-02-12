import { create } from 'zustand';

const useAuthStore = create((set) => ({
    // Check if user exists in localStorage on initial load
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),

    login: (userData, token) => {
        const finalUser = userData.user ? userData.user : userData;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(finalUser)); // Persistence
        set({ user: finalUser, token, isAuthenticated: true });
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ user: null, token: null, isAuthenticated: false });
    },
}));

export default useAuthStore;