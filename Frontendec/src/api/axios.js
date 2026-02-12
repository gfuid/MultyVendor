//Isse humein baar-baar URL nahi likhna padega aur hum automatic JWT tokens bhej sakenge.

import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    withCredentials: true, // Cookies ke liye zaroori hai
});

// Request interceptor: Har request ke saath token bhejne ke liye
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;