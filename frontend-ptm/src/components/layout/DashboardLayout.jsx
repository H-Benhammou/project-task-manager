import React, { useState } from 'react';
import { Navbar } from './Navbar';

export const DashboardLayout = ({ children, sidebar }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

            <div className="flex">
                {/* Sidebar */}
                {sidebar && (
                    <aside
                        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white shadow-lg transition-all duration-300 z-20 ${
                            sidebarOpen ? 'w-64' : 'w-0'
                        } overflow-hidden`}
                    >
                        <div className="p-4 h-full overflow-y-auto">
                            {sidebar}
                        </div>
                    </aside>
                )}

                {/* Main Content */}
                <main
                    className={`flex-1 p-6 transition-all duration-300 ${
                        sidebarOpen && sidebar ? 'ml-64' : 'ml-0'
                    }`}
                >
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};