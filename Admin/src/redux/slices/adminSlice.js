import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../api';

// 1. ASYNC THUNKS
export const getVendors = createAsyncThunk('admin/getVendors', async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.fetchAllVendors();
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Vendors not there!");
    }
});

export const getProducts = createAsyncThunk('admin/getProducts', async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.fetchAllProducts();
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Products not there!");
    }
});

export const approveStoreAction = createAsyncThunk('admin/approveStore', async (id, { rejectWithValue }) => {
    try {
        const { data } = await api.approveStoreAdmin(id);
        return { id, data };
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Approval failed !");
    }
});

// Added getStats Thunk properly
// Async Thunk
export const getStats = createAsyncThunk('admin/getStats', async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.getDashboardStats(); // Calling the new API function
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Stats fetch error!");
    }
});


// . ASYNC THUNK: Vendor Status Update karne ke liye
export const updateVendorStatusAction = createAsyncThunk(
    'admin/updateVendorStatus',
    async ({ id, isApproved }, { rejectWithValue }) => {
        try {
            // Backend API call: router.put('/vendor/:id/status', ...)
            const { data } = await api.updateVendorStatus(id, isApproved);
            return { id, isApproved, data };
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Status update fail!");
        }
    }
);


// ... (Async Thunks remains same)

const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        vendors: [],
        products: [],
        stats: null, // Default null rakhein taaki loading check ho sake
        loading: false,
        error: null
    },
    reducers: {
        clearAdminError: (state) => { state.error = null; }
    },
    extraReducers: (builder) => {
        builder
            // 1. Saare addCase calls pehle (Specific actions)
            .addCase(getVendors.fulfilled, (state, action) => {
                state.loading = false;
                state.vendors = action.payload;
            })
            .addCase(getProducts.fulfilled, (state, action) => {
                // Backend { success: true, products: [...] } return karta hai
                // Pehle sirf action.payload tha — ab .products nikalo
                state.products = action.payload.products || action.payload || [];
                state.loading = false;
            })
            .addCase(getStats.fulfilled, (state, action) => {
                state.loading = false;
                state.stats = action.payload;
            })

            // --- UPDATE VENDOR STATUS (Approval/Suspension) ---
            .addCase(updateVendorStatusAction.fulfilled, (state, action) => {
                const index = state.vendors.findIndex(v => v._id === action.payload.id);
                if (index !== -1) {
                    // Backend logic ke hisaab se 'isApproved' boolean update karein
                    state.vendors[index].isApproved = action.payload.isApproved;

                    // Agar aapka UI 'sellerStatus' par depend karta hai, toh usey bhi sync karein
                    state.vendors[index].sellerStatus = action.payload.isApproved ? 'approved' : 'suspended';
                }
            })
            .addCase(approveStoreAction.fulfilled, (state, action) => {
                const index = state.vendors.findIndex(v => v._id === action.payload.id);
                if (index !== -1) {
                    state.vendors[index].status = 'approved';
                }
            })




            // 2. Phir addMatcher calls (General patterns)
            .addMatcher(
                (action) => action.type.endsWith('/pending'),
                (state) => { state.loading = true; }
            )
            .addMatcher(
                (action) => action.type.endsWith('/rejected'),
                (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                }
            );
    }
});

export const { clearAdminError } = adminSlice.actions;
export default adminSlice.reducer;