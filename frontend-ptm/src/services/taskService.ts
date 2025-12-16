import api from "./api";

export const TaskStatus = {
    IN_PROGRESS: "IN_PROGRESS",
    COMPLETED: "COMPLETED"
} as const;

export type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus];

export interface Task {
    id: number;
    title: string;
    description: string;
    dueDate: string | null;
    status: TaskStatus;
    projectId: number;
    projectTitle: string;
}

export interface TaskRequest {
    title: string;
    description: string;
    dueDate: string | null;
    status?: TaskStatus;
}

export const taskService = {
    // Get all tasks for a specific project
    getProjectTasks: async (projectId: number): Promise<Task[]> => {
        const response = await api.get(`/projects/${projectId}/tasks`);
        return response.data;
    },

    // Get a single task
    getTask: async (projectId: number, taskId: number): Promise<Task> => {
        const response = await api.get(`/projects/${projectId}/tasks/${taskId}`);
        return response.data;
    },

    // Create a new task
    createTask: async (projectId: number, data: TaskRequest): Promise<Task> => {
        const response = await api.post(`/projects/${projectId}/tasks`, data);
        return response.data;
    },

    // Update a task
    updateTask: async (
        projectId: number,
        taskId: number,
        data: TaskRequest
    ): Promise<Task> => {
        const response = await api.put(`/projects/${projectId}/tasks/${taskId}`, data);
        return response.data;
    },

    // Mark task as completed
    markAsCompleted: async (projectId: number, taskId: number): Promise<Task> => {
        const response = await api.patch(`/projects/${projectId}/tasks/${taskId}/complete`);
        return response.data;
    },

    // Delete a task
    deleteTask: async (projectId: number, taskId: number): Promise<void> => {
        await api.delete(`/projects/${projectId}/tasks/${taskId}`);
    },

    // Helper to format date for display
    formatDate: (dateString: string | null): string => {
        if (!dateString) return 'No due date';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    },

    // Helper to check if task is overdue
    isOverdue: (task: Task): boolean => {
        if (!task.dueDate || task.status === TaskStatus.COMPLETED) return false;
        return new Date(task.dueDate) < new Date();
    },
};