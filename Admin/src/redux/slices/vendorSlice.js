import { createSlice } from '@reduxjs/toolkit';

const vendorSlice = createSlice({
    name: 'vendors',
    initialState: {
        allVendors: [], // Saare vendors yahan save honge
        loading: false,
    },
    reducers: {
        // Ye function data ko 'fill' karega
        setVendors: (state, action) => {
            state.allVendors = action.payload;
        },
        // Loading state handle karne ke liye
        setLoading: (state, action) => {
            state.loading = action.payload;
        }
    }
});

export const { setVendors, setLoading } = vendorSlice.actions;
export default vendorSlice.reducer;