import api from './api';

export const taskService = {
    getAllTasks: async (projectId) => {
        const response = await api.get(`/projects/${projectId}/tasks`);
        return response.data;
    },

    getTaskById: async (projectId, taskId) => {
        const response = await api.get(`/projects/${projectId}/tasks/${taskId}`);
        return response.data;
    },

    createTask: async (projectId, data) => {
        const response = await api.post(`/projects/${projectId}/tasks`, data);
        return response.data;
    },

    updateTask: async (projectId, taskId, data) => {
        const response = await api.put(`/projects/${projectId}/tasks/${taskId}`, data);
        return response.data;
    },

    markComplete: async (projectId, taskId) => {
        const response = await api.patch(`/projects/${projectId}/tasks/${taskId}/complete`);
        return response.data;
    },

    deleteTask: async (projectId, taskId) => {
        await api.delete(`/projects/${projectId}/tasks/${taskId}`);
    },
};