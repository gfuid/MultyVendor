import { configureStore } from '@reduxjs/toolkit';
import vendorReducer from './slices/vendorSlice';

export const store = configureStore({
    reducer: {
        vendors: vendorReducer, // Yahan hum vendors ka data manage karenge
    },
});