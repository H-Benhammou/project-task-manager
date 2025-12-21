import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, CheckCircle2, Clock, AlertCircle, Trash2, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { projectService, type ProjectDetails } from '../services/projectService';
import { taskService, type Task, TaskStatus, type PageResponse } from '../services/taskService';
import { loginService } from '../services/loginService';
import { TaskCard } from '../components/TaskCard';
import { AddTaskModal } from '../components/AddTaskModal';

export default function ProjectDetailsPage() {
    const navigate = useNavigate();
    const { projectId } = useParams<{ projectId: string }>();
    const [user, setUser] = useState<any>(null);
    const [project, setProject] = useState<ProjectDetails | null>(null);

    // For insights/stats - fetch all tasks
    const [allTasks, setAllTasks] = useState<Task[]>([]);

    // For display - paginated tasks
    const [paginatedTasks, setPaginatedTasks] = useState<PageResponse<Task>>({
        content: [],
        totalElements: 0,
        totalPages: 0,
        size: 5,
        number: 0,
        first: true,
        last: true,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deletingProject, setDeletingProject] = useState(false);

    // Search and Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'ALL' | TaskStatus>('ALL');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 5;

    useEffect(() => {
        // Check if user is authenticated
        if (!loginService.isAuthenticated()) {
            navigate('/login');
            return;
        }

        // Get user info
        const currentUser = loginService.getCurrentUser();
        setUser(currentUser);

        // Fetch project and tasks
        if (projectId) {
            fetchProjectData(parseInt(projectId));
        }
    }, [navigate, projectId]);

    // Fetch paginated tasks when page, search, or filter changes
    useEffect(() => {
        if (projectId) {
            fetchPaginatedTasks(parseInt(projectId), currentPage);
        }
    }, [currentPage, projectId]);

    const fetchProjectData = async (id: number) => {
        try {
            setLoading(true);
            setError(null);

            const [projectData, tasksData, paginatedData] = await Promise.all([
                projectService.getProject(id),
                taskService.getProjectTasks(id), // All tasks for stats
                taskService.getProjectTasksPage(id, 0, pageSize), // Paginated for display
            ]);

            setProject(projectData);
            setAllTasks(tasksData);
            setPaginatedTasks(paginatedData);
            setCurrentPage(0);
        } catch (err: any) {
            console.error('Error fetching project data:', err);
            setError(err.response?.data?.message || 'Failed to load project');

            if (err.response?.status === 401) {
                loginService.logout();
                navigate('/login');
            } else if (err.response?.status === 404) {
                setError('Project not found');
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchPaginatedTasks = async (id: number, page: number) => {
        try {
            const paginatedData = await taskService.getProjectTasksPage(id, page, pageSize);
            setPaginatedTasks(paginatedData);
        } catch (err: any) {
            console.error('Error fetching paginated tasks:', err);
        }
    };

    // Filter tasks from paginated content (client-side filtering)
    const filteredTasks = paginatedTasks.content.filter((task) => {
        // Filter by status
        const matchesStatus = statusFilter === 'ALL' || task.status === statusFilter;

        // Filter by search query
        const matchesSearch = searchQuery === '' ||
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesStatus && matchesSearch;
    });

    const handleAddTask = async (data: { title: string; description: string; dueDate: string | null }) => {
        if (!projectId) return;

        setIsSubmitting(true);
        try {
            await taskService.createTask(parseInt(projectId), {
                title: data.title,
                description: data.description,
                dueDate: data.dueDate,
                status: TaskStatus.IN_PROGRESS,
            });

            setIsModalOpen(false);

            // Refresh all data
            await fetchProjectData(parseInt(projectId));
        } catch (err: any) {
            console.error('Error creating task:', err);
            alert(err.response?.data?.message || 'Failed to create task');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCompleteTask = async (taskId: number) => {
        if (!projectId) return;

        const task = allTasks.find((t) => t.id === taskId);
        if (!task || task.status === TaskStatus.COMPLETED) return;

        try {
            await taskService.markAsCompleted(parseInt(projectId), taskId);

            // Refresh all data
            await fetchProjectData(parseInt(projectId));
        } catch (err: any) {
            console.error('Error completing task:', err);
            alert(err.response?.data?.message || 'Failed to complete task');
        }
    };

    const handleDeleteTask = async (taskId: number) => {
        if (!projectId || !window.confirm('Are you sure you want to delete this task?')) return;

        try {
            await taskService.deleteTask(parseInt(projectId), taskId);

            // Refresh all data
            await fetchProjectData(parseInt(projectId));
        } catch (err: any) {
            console.error('Error deleting task:', err);
            alert(err.response?.data?.message || 'Failed to delete task');
        }
    };

    const handleDeleteProject = async () => {
        if (!projectId) return;

        setDeletingProject(true);
        try {
            await projectService.deleteProject(parseInt(projectId));
            navigate('/dashboard');
        } catch (err: any) {
            console.error('Error deleting project:', err);
            alert(err.response?.data?.message || 'Failed to delete project');
            setDeletingProject(false);
            setShowDeleteConfirm(false);
        }
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < paginatedTasks.totalPages) {
            setCurrentPage(newPage);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 flex items-center justify-center">
                <div className="text-gray-600">Loading...</div>
            </div>
        );
    }

    const completedTasks = allTasks.filter((t) => t.status === TaskStatus.COMPLETED).length;
    const inProgressTasks = allTasks.filter((t) => t.status === TaskStatus.IN_PROGRESS).length;
    const overdueTasks = allTasks.filter((t) => taskService.isOverdue(t)).length;

    return (
        <DashboardLayout user={user}>
            <div className="max-w-7xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-medium">Back to Dashboard</span>
                </button>

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
                ) : project ? (
                    <>
                        {/* Project Header */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.title}</h1>
                                    {project.description && (
                                        <p className="text-gray-600 text-lg">{project.description}</p>
                                    )}
                                </div>
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="px-4 py-2 text-red-600 border-2 border-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium flex items-center gap-2"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete Project
                                </button>
                            </div>

                            {/* Project Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                                <div className="bg-blue-50 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-blue-600">Total Tasks</span>
                                        <Clock className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <p className="text-2xl font-bold text-blue-900">{allTasks.length}</p>
                                </div>

                                <div className="bg-green-50 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-green-600">Completed</span>
                                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                                    </div>
                                    <p className="text-2xl font-bold text-green-900">{completedTasks}</p>
                                </div>

                                <div className="bg-purple-50 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-purple-600">In Progress</span>
                                        <Clock className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <p className="text-2xl font-bold text-purple-900">{inProgressTasks}</p>
                                </div>

                                <div className="bg-red-50 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-red-600">Overdue</span>
                                        <AlertCircle className="w-5 h-5 text-red-600" />
                                    </div>
                                    <p className="text-2xl font-bold text-red-900">{overdueTasks}</p>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mt-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                                    <span className="text-sm font-bold text-gray-900">{project.progressPercentage}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className={`h-3 rounded-full transition-all duration-300 ${
                                            project.progressPercentage === 100 ? 'bg-green-600' : 'bg-blue-600'
                                        }`}
                                        style={{ width: `${project.progressPercentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        {/* Tasks Section */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900">Tasks</h2>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Showing {filteredTasks.length} of {paginatedTasks.totalElements} tasks
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Task
                                    </button>
                                </div>

                                {/* Search and Filter */}
                                <div className="flex flex-col sm:flex-row gap-3">
                                    {/* Search Input */}
                                    <div className="flex-1 relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search tasks..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    {/* Status Filter */}
                                    <div className="relative">
                                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                        <select
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value as 'ALL' | TaskStatus)}
                                            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
                                        >
                                            <option value="ALL">All Status</option>
                                            <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                                            <option value={TaskStatus.COMPLETED}>Completed</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {allTasks.length === 0 ? (
                                <div className="px-6 py-12 text-center">
                                    <CheckCircle2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">No tasks yet</h3>
                                    <p className="text-gray-600 mb-4">Add your first task to get started</p>
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                    >
                                        Add Your First Task
                                    </button>
                                </div>
                            ) : filteredTasks.length === 0 ? (
                                <div className="px-6 py-12 text-center">
                                    <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">No tasks found</h3>
                                    <p className="text-gray-600">Try adjusting your search or filter</p>
                                </div>
                            ) : (
                                <>
                                    <div className="p-6 space-y-3">
                                        {filteredTasks.map((task) => (
                                            <TaskCard
                                                key={task.id}
                                                task={task}
                                                onComplete={handleCompleteTask}
                                                onDelete={handleDeleteTask}
                                            />
                                        ))}
                                    </div>

                                    {/* Pagination Controls */}
                                    {paginatedTasks.totalPages > 1 && (
                                        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                                            <div className="text-sm text-gray-600">
                                                Page {currentPage + 1} of {paginatedTasks.totalPages}
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handlePageChange(currentPage - 1)}
                                                    disabled={paginatedTasks.first}
                                                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    <ChevronLeft className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handlePageChange(currentPage + 1)}
                                                    disabled={paginatedTasks.last}
                                                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    <ChevronRight className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </>
                ) : null}

                {/* Add Task Modal */}
                <AddTaskModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleAddTask}
                    isSubmitting={isSubmitting}
                />

                {/* Delete Confirmation Modal */}
                {showDeleteConfirm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Delete Project</h3>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to delete this project? This will also delete all tasks associated with it. This action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    disabled={deletingProject}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteProject}
                                    disabled={deletingProject}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:bg-red-400"
                                >
                                    {deletingProject ? 'Deleting...' : 'Delete Project'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}