import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { LayoutDashboard, Store, ShoppingBasket, Users, Settings, LogOut } from 'lucide-react';

const Sidebar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
        { name: 'Vendors', icon: Store, path: '/vendors' },
        { name: 'All Products', icon: ShoppingBasket, path: '/products' },
        { name: 'Users', icon: Users, path: '/usersdetails' },
    ]; // Settings yahan se hata di gayi hai

    // Logout Functionality
    const handleLogout = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            dispatch(logout());
            navigate('/login');
        }
    };

    return (
        <div className="w-64 h-screen bg-white border-r border-gray-100 flex flex-col sticky top-0 shadow-sm">
            {/* Logo Section */}
            <div className="p-6">
                <div className="bg-[#ff4d6d] text-white px-4 py-2 rounded-lg font-black italic text-xl text-center shadow-md select-none">
                    TRIREME <span className="text-[10px] not-italic opacity-80 block uppercase tracking-widest">Admin</span>
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-4 space-y-2">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) => `
                            flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all
                            ${isActive
                                ? 'bg-[#fff5f7] text-[#ff4d6d] border-r-4 border-[#ff4d6d] shadow-sm'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-[#ff7096]'}
                        `}
                    >
                        <item.icon size={20} />
                        <span>{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Logout Section */}
            <div className="p-4 border-t border-gray-50">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-500 font-bold hover:bg-red-50 rounded-xl transition-all active:scale-95"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;