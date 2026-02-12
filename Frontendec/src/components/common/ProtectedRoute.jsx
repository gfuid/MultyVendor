import { Navigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore.js';

const ProtectedRoute = ({ children, adminOnly = false, sellerOnly = false }) => {
    const { isAuthenticated, user } = useAuthStore();

    if (!isAuthenticated) return <Navigate to="/login" />;

    if (adminOnly && user?.role !== 'admin') return <Navigate to="/" />;

    if (sellerOnly && !user?.isSeller) return <Navigate to="/" />;

    return children;
};

export default ProtectedRoute;