import api from "./api";

export interface Project {
    id: number;
    title: string;
    description: string;
    totalTasks: number;
    completedTasks: number;
    progressPercentage: number;
}

export interface ProjectDetails extends Project {
    ownerName: string;
    ownerEmail: string;
}

export interface DashboardStats {
    activeProjects: number;
    completedProjects: number;
    totalTasks: number;
    completedTasks: number;
}

export const projectService = {
    // Get all projects for the current user
    getAllProjects: async (): Promise<Project[]> => {
        const response = await api.get("/projects");
        return response.data;
    },

    // Get a single project by ID
    getProject: async (projectId: number): Promise<ProjectDetails> => {
        const response = await api.get(`/projects/${projectId}`);
        return response.data;
    },

    // Create a new project
    createProject: async (data: { title: string; description: string }): Promise<ProjectDetails> => {
        const response = await api.post("/projects", data);
        return response.data;
    },

    // Update a project
    updateProject: async (
        projectId: number,
        data: { title: string; description: string }
    ): Promise<ProjectDetails> => {
        const response = await api.put(`/projects/${projectId}`, data);
        return response.data;
    },

    // Delete a project
    deleteProject: async (projectId: number): Promise<void> => {
        await api.delete(`/projects/${projectId}`);
    },

    // Calculate dashboard stats from projects
    // A project is considered completed ONLY when ALL its tasks are completed
    // This matches the backend logic in Project.getProgressPercentage()
    calculateStats: (projects: Project[]): DashboardStats => {
        // Count completed projects: only those where ALL tasks are done
        // (completedTasks === totalTasks AND totalTasks > 0)
        const completedProjects = projects.filter(
            p => p.totalTasks > 0 && p.completedTasks === p.totalTasks
        ).length;
        
        // Active projects: projects that are not 100% complete
        // This includes projects with no tasks or partially completed tasks
        const activeProjects = projects.length - completedProjects;
        
        // Sum up all tasks across all projects
        const totalTasks = projects.reduce((sum, p) => sum + p.totalTasks, 0);
        const completedTasks = projects.reduce((sum, p) => sum + p.completedTasks, 0);

        return {
            activeProjects,
            completedProjects,
            totalTasks,
            completedTasks,
        };
    },

    // Check if a project is completed (all tasks done)
    isProjectCompleted: (project: Project): boolean => {
        return project.totalTasks > 0 && project.completedTasks === project.totalTasks;
    },

    // Get project status label
    getProjectStatusLabel: (project: Project): string => {
        if (project.totalTasks === 0) {
            return 'No Tasks';
        }
        if (project.completedTasks === project.totalTasks) {
            return 'Completed';
        }
        return 'In Progress';
    },
};