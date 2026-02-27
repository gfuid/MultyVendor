import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

/**
 * AUTH SLICE (Identity Manager)
 * Deep Meaning: Yeh slice handles karti hai login, logout aur user ki global state.
 * Iska use karke hi Dashboard ko pata chalta hai ki Admin logged in hai ya nahi.
 */

// Env variable se backend ka base URL nikalna
const API_URL = import.meta.env.VITE_BACKEND_URL;

// LOGIN ACTION: Backend se token mangwane ke liye
export const login = createAsyncThunk('auth/login', async (formData, { rejectWithValue }) => {
    try {
        // Hardcoded URL ki jagah template literal aur env variable ka use
        const response = await axios.post(`${API_URL}/api/auth/login`, formData);

        // Success: LocalStorage mein token save karna taaki refresh pe logout na ho
        localStorage.setItem('token', response.data.token);

        return response.data;
    } catch (err) {
        // Error: Backend se aane wala message (e.g., "Invalid Credentials")
        return rejectWithValue(err.response?.data?.message || "Login fail ho gaya bhai!");
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        token: localStorage.getItem('token'), // App load hote hi purana token check karna
        loading: false,
        error: null
    },
    reducers: {
        // LOGOUT: State aur Storage dono saaf karna
        logout: (state) => {
            localStorage.removeItem('token');
            state.user = null;
            state.token = null;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Login Pending: Button ko loading state mein daalne ke liye
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            // Login Success: User data aur token state mein save karna
            .addCase(login.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.loading = false;
            })
            // Login Fail: Error message dikhane ke liye
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;