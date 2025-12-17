import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LayoutDashboard, FolderKanban, LogOut, ChevronDown } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: {
    name: string;
    email: string;
  };
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const pageTitles: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/projects': 'My Projects',
    '/projects/new': 'Create New Project',
  };

  // Get the current page title, with fallback for dynamic routes like /projects/:id
  const getCurrentPageTitle = () => {
    // Check exact match first
    if (pageTitles[location.pathname]) {
      return pageTitles[location.pathname];
    }
    
    // Check for dynamic routes
    if (location.pathname.startsWith('/projects/') && location.pathname !== '/projects/new') {
      return 'Project Details';
    }
    
    // Default fallback
    return 'Dashboard';
  };

  const navItems = [
    { 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      path: '/dashboard', 
      active: location.pathname === '/dashboard' 
    },
    { 
      icon: FolderKanban, 
      label: 'My Projects', 
      path: '/projects', 
      active: location.pathname.startsWith('/projects')
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } bg-white border-r border-gray-200 transition-all duration-300 overflow-hidden relative`}
      >
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <FolderKanban className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">TaskFlow</span>
          </div>

          <nav className="space-y-1">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  item.active
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 w-64 p-6 border-t border-gray-200">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <h1 className="text-2xl font-bold text-gray-800">{getCurrentPageTitle()}</h1>
            </div>

            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-500">View profile</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
};