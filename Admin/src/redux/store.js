import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import adminReducer from './slices/adminSlice'; // Check this import

export const store = configureStore({
    reducer: {
        auth: authReducer,
        admin: adminReducer, // MUST BE HERE
    },
});