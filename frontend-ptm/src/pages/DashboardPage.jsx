import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Sidebar } from '../components/layout/Sidebar';
import { ProjectCard } from '../components/projects/ProjectCard';
import { ProjectModal } from '../components/projects/ProjectModal';
import { Button } from '../components/common/Button';
import { projectService } from '../services/projectService';

export const DashboardPage = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [stats, setStats] = useState({
        totalProjects: 0,
        totalTasks: 0,
        completedTasks: 0,
        overdueTasks: 0,
        overallProgress: 0,
    });

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            setLoading(true);
            const data = await projectService.getAllProjects();
            setProjects(data);
            calculateStats(data);
        } catch (error) {
            console.error('Error loading projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (projectsData) => {
        const totalProjects = projectsData.length;
        const totalTasks = projectsData.reduce((sum, p) => sum + p.totalTasks, 0);
        const completedTasks = projectsData.reduce((sum, p) => sum + p.completedTasks, 0);
        const overallProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

        setStats({
            totalProjects,
            totalTasks,
            completedTasks,
            overdueTasks: 0,
            overallProgress,
        });
    };

    const handleCreateProject = async (formData) => {
        try {
            await projectService.createProject(formData);
            setIsModalOpen(false);
            loadProjects();
        } catch (error) {
            console.error('Error creating project:', error);
        }
    };

    const handleDeleteProject = async (projectId) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
            try {
                await projectService.deleteProject(projectId);
                loadProjects();
            } catch (error) {
                console.error('Error deleting project:', error);
            }
        }
    };

    const handleViewProject = (projectId) => {
        navigate(`/projects/${projectId}`);
    };

    return (
        <DashboardLayout sidebar={<Sidebar stats={stats} />}>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Mes Projets</h1>
                        <p className="text-gray-600 mt-1">Gérez et suivez vos projets facilement</p>
                    </div>
                    <Button onClick={() => setIsModalOpen(true)}>
                        <div className="flex items-center space-x-2">
                            <Plus className="w-5 h-5" />
                            <span>Nouveau projet</span>
                        </div>
                    </Button>
                </div>

                {/* Projects Grid */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="text-gray-600 mt-4">Chargement...</p>
                    </div>
                ) : projects.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow-md">
                        <p className="text-gray-600 mb-4">Aucun projet pour le moment</p>
                        <Button onClick={() => setIsModalOpen(true)}>
                            <div className="flex items-center space-x-2">
                                <Plus className="w-5 h-5" />
                                <span>Créer votre premier projet</span>
                            </div>
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {projects.map((project) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                onView={handleViewProject}
                                onDelete={handleDeleteProject}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Create Project Modal */}
            <ProjectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateProject}
            />
        </DashboardLayout>
    );
};