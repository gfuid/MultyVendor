import axios from 'axios';

// Ek central axios instance taki baar-baar base URL na likhna pade
const API = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL + '/api',
});

// Admin Controllers ke liye functions
export const fetchAllVendors = () => API.get('/admin/vendors');
export const fetchAllProducts = () => API.get('/admin/products');
export const updateVendorStatus = (id, status) => API.put(`/admin/vendor/${id}/status`, { isApproved: status });
export const deleteProductAdmin = (id) => API.delete(`/admin/product/${id}`);

export default API;