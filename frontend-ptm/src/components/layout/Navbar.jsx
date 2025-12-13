import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle, LogOut, Menu } from 'lucide-react';
import { Button } from '../common/Button';

export const Navbar = ({ onToggleSidebar }) => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-30">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Left side */}
                    <div className="flex items-center space-x-4">
                        {onToggleSidebar && (
                            <button
                                onClick={onToggleSidebar}
                                className="p-2 rounded-lg hover:bg-gray-100 transition"
                            >
                                <Menu className="w-6 h-6 text-gray-700" />
                            </button>
                        )}
                        <div className="flex items-center space-x-2">
                            <CheckCircle className="w-8 h-8 text-blue-600" />
                            <span className="text-xl font-bold text-gray-900">TaskManager</span>
                        </div>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center space-x-4">
                        {user && (
                            <div className="flex items-center space-x-3">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                    <p className="text-xs text-gray-500">{user.email}</p>
                                </div>
                                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                                    {user.name?.charAt(0).toUpperCase()}
                                </div>
                            </div>
                        )}
                        <Button variant="secondary" onClick={handleLogout}>
                            <div className="flex items-center space-x-2">
                                <LogOut className="w-4 h-4" />
                                <span className="hidden sm:inline">Déconnexion</span>
                            </div>
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
};