import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderKanban, Plus, Search } from 'lucide-react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { projectService, type Project, type PageResponse } from '../services/projectService';
import { loginService } from '../services/loginService';
import { ProjectCard } from '../components/ProjectCard';
import { Pagination } from '../components/Pagination';

export default function ProjectsPage() {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [pageData, setPageData] = useState<PageResponse<Project> | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        // Check if user is authenticated
        if (!loginService.isAuthenticated()) {
            navigate('/login');
            return;
        }

        // Get user info
        const currentUser = loginService.getCurrentUser();
        setUser(currentUser);

        // Fetch projects for current page
        fetchProjects(currentPage);
    }, [navigate, currentPage]);

    const fetchProjects = async (page: number) => {
        try {
            setLoading(true);
            setError(null);

            const data = await projectService.getProjectsPage(page, 6);
            setPageData(data);
        } catch (err: any) {
            console.error('Error fetching projects:', err);
            setError(err.response?.data?.message || 'Failed to load projects');

            // If unauthorized, redirect to login
            if (err.response?.status === 401) {
                loginService.logout();
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const filteredProjects = pageData?.content.filter(project =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    if (!user) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 flex items-center justify-center">
                <div className="text-gray-600">Loading...</div>
            </div>
        );
    }

    return (
        <DashboardLayout user={user}>
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">
                                All Projects
                            </h2>
                            <p className="text-gray-600">
                                Manage and track all your projects in one place
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/projects/new')}
                            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm hover:shadow-md"
                        >
                            <Plus className="w-5 h-5" />
                            New Project
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search projects by name or description..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Loading State */}
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <>
                        {/* Projects Grid */}
                        {filteredProjects.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-12 text-center">
                                <FolderKanban className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                    {searchQuery ? 'No projects found' : 'No projects yet'}
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    {searchQuery
                                        ? 'Try adjusting your search query'
                                        : 'Create your first project to start organizing your tasks'}
                                </p>
                                {!searchQuery && (
                                    <button
                                        onClick={() => navigate('/projects/new')}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                    >
                                        Create Your First Project
                                    </button>
                                )}
                            </div>
                        ) : (
                            <>
                                {/* Project Count */}
                                <div className="mb-4">
                                    <p className="text-sm text-gray-600">
                                        Showing {filteredProjects.length} of {pageData?.totalElements || 0} projects
                                        {searchQuery && ' (filtered)'}
                                    </p>
                                </div>

                                {/* Projects Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                                    {filteredProjects.map((project) => (
                                        <ProjectCard key={project.id} project={project} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {!searchQuery && pageData && (
                                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                        <Pagination
                                            currentPage={currentPage}
                                            totalPages={pageData.totalPages}
                                            onPageChange={handlePageChange}
                                            isFirst={pageData.first}
                                            isLast={pageData.last}
                                        />
                                    </div>
                                )}
                            </>
                        )}

                        {/* Info Card */}
                        {pageData && pageData.totalElements > 0 && (
                            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <FolderKanban className="w-5 h-5 text-blue-600 mt-0.5" />
                                    <div>
                                        <h4 className="text-sm font-semibold text-blue-900 mb-1">
                                            Project Management Tips
                                        </h4>
                                        <p className="text-sm text-blue-700">
                                            Click on any project card to view details and manage tasks. 
                                            Projects are sorted by last modified date, with the most recent first.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </DashboardLayout>
    );
}