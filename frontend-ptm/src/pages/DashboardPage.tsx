import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderKanban, ListTodo, CheckCircle2, TrendingUp, Clock } from 'lucide-react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { projectService, type Project, type DashboardStats } from '../services/projectService';
import { loginService } from '../services/loginService';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    activeProjects: 0,
    completedProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is authenticated
    if (!loginService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Get user info
    const currentUser = loginService.getCurrentUser();
    setUser(currentUser);

    // Fetch projects
    fetchProjects();
  }, [navigate]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all projects for stats calculation
      const allProjectsData = await projectService.getAllProjects();
      setProjects(allProjectsData);
      
      // Fetch recent projects (last 24 hours, max 5)
      const recentProjectsData = await projectService.getRecentProjects();
      setRecentProjects(recentProjectsData);
      
      // Calculate stats from all projects
      const calculatedStats = projectService.calculateStats(allProjectsData);
      setStats(calculatedStats);
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

  // Helper function to determine project status based on backend logic
  const getProjectStatus = (project: Project) => {
    if (project.totalTasks === 0) {
      return { label: 'No Tasks', color: 'bg-gray-100 text-gray-800' };
    }
    if (project.completedTasks === project.totalTasks) {
      return { label: 'Completed', color: 'bg-green-100 text-green-800' };
    }
    return { label: 'In Progress', color: 'bg-blue-100 text-blue-800' };
  };

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
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Let’s get started, {user.name.split(' ')[0]}!
          </h2>
          <p className="text-gray-600">
            Here's what's happening with your projects so far.
          </p>
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
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-600 text-sm font-medium">Active Projects</h3>
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-800">{stats.activeProjects}</p>
                <p className="text-sm text-gray-500 mt-2">In progress</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-600 text-sm font-medium">Completed Projects</h3>
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-800">{stats.completedProjects}</p>
                <p className="text-sm text-gray-500 mt-2">All tasks done</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-600 text-sm font-medium">Total Tasks</h3>
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <ListTodo className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-800">{stats.totalTasks}</p>
                <p className="text-sm text-gray-500 mt-2">Across all projects</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-600 text-sm font-medium">Tasks Completed</h3>
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-orange-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-800">{stats.completedTasks}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {stats.totalTasks > 0 
                    ? `${Math.round((stats.completedTasks / stats.totalTasks) * 100)}% complete`
                    : 'No tasks yet'}
                </p>
              </div>
            </div>

            {/* Recent Activity Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Projects modified in the last 24 hours
                  </p>
                </div>
                <button 
                  onClick={() => navigate('/projects')}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View All Projects
                </button>
              </div>

              {recentProjects.length === 0 ? (
                <div className="px-6 py-8 text-center">
                  <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-base font-semibold text-gray-800 mb-1">No recent activity</h3>
                  <p className="text-sm text-gray-600">
                    No projects have been modified in the last 24 hours
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Project Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tasks Progress
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Completion
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {recentProjects.map((project) => {
                        const status = getProjectStatus(project);
                        return (
                          <tr 
                            key={project.id} 
                            onClick={() => navigate(`/projects/${project.id}`)}
                            className="hover:bg-gray-50 transition-colors cursor-pointer"
                          >
                            <td className="px-6 py-4">
                              <div>
                                <p className="font-medium text-gray-800">{project.title}</p>
                                {project.description && (
                                  <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                                    {project.description}
                                  </p>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-700">
                                  {project.completedTasks} / {project.totalTasks}
                                </span>
                                <span className="text-xs text-gray-500">tasks</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <div className="flex-1 bg-gray-200 rounded-full h-2 min-w-25 max-w-35">
                                  <div
                                    className={`h-2 rounded-full transition-all duration-300 ${
                                      project.progressPercentage === 100 
                                        ? 'bg-green-600' 
                                        : 'bg-blue-600'
                                    }`}
                                    style={{ width: `${project.progressPercentage}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-medium text-gray-700 min-w-11.25">
                                  {project.progressPercentage}%
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                                {status.label}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            

            {/* Quick Info */}
            {projects.length > 0 && (
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <FolderKanban className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-blue-900 mb-1">
                      How project status works
                    </h4>
                    <p className="text-sm text-blue-700">
                      The <span className="font-semibold">Recent Activity</span> section shows projects modified in the last 24 hours.
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