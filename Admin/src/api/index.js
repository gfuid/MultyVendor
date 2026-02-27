import axios from 'axios';

/**
 * API SERVICE LAYER
 * Purpose: Backend ke saath saara len-den (communication) isi file se hoga.
 */

const API = axios.create({
    // .env file se backend ka URL uthana (e.g., http://localhost:5000/api)
    baseURL: import.meta.env.VITE_BACKEND_URL + '/api',
});

/**
 * REQUEST INTERCEPTOR (Security Checkpost)
 * Deep Meaning: Har request bhejne se pehle yeh check karega ki local storage mein 
 * token hai ya nahi. Agar hai, toh use 'Header' mein laga dega taaki 
 * backend ka 'protect' middleware ise pehchan sake.
 */
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

/**
 * ============================================================
 * ADMIN CONTROL FUNCTIONS
 * ============================================================
 */

// 1. Saare vendors ka data mangwana
export const fetchAllVendors = () => API.get('/admin/vendors');

// 2. Poore marketplace ke products fetch karna
export const fetchAllProducts = () => API.get('/admin/products');

// 3. Vendor ko approve ya reject karna
// Backend mein humne storeId use kiya hai, ensure karein params match hon
export const approveStoreAdmin = (storeId) => API.put(`/admin/store/approve/${storeId}`);

// 4. Vendor ka status (Active/Suspended) update karna
export const updateVendorStatus = (id, status) =>
    API.put(`/admin/vendor/${id}/status`, { status });

// 5. Kisi product ko marketplace se hatana
export const deleteProductAdmin = (id) => API.delete(`/admin/product/${id}`);


// Get the dashbaord state 
export const getDashboardStats = () => API.get('/admin/stats'); // Add this line


export default API;

