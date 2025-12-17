// frontend-ptm/src/services/projectService.ts
import api from "./api";

export interface Project {
    id: number;
    title: string;
    description: string;
    totalTasks: number;
    completedTasks: number;
    progressPercentage: number;
    creationDate?: string;
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

export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
}

export const projectService = {
    // Get all projects for the current user
    getAllProjects: async (): Promise<Project[]> => {
        const response = await api.get("/projects/all");
        return response.data;
    },

    // Get paginated projects
    getProjectsPage: async (page: number = 0, size: number = 6): Promise<PageResponse<Project>> => {
        const response = await api.get("/projects", {
            params: { page, size }
        });
        return response.data;
    },

    // Get recently modified projects (last 24 hours, max 5)
    getRecentProjects: async (): Promise<Project[]> => {
        const response = await api.get("/projects/recent");
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
    calculateStats: (projects: Project[]): DashboardStats => {
        const completedProjects = projects.filter(
            p => p.totalTasks > 0 && p.completedTasks === p.totalTasks
        ).length;
        
        const activeProjects = projects.length - completedProjects;
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