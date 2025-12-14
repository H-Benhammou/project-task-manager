import api from "./api";

export interface LoginData {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
    message: string;
}

export const loginService = {
    login: async (data: LoginData): Promise<LoginResponse> => {
        const response = await api.post("/auth/login", data);
        return response.data;
    },

    logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    },

    getCurrentUser: () => {
        const userStr = localStorage.getItem("user");
        return userStr ? JSON.parse(userStr) : null;
    },

    isAuthenticated: () => {
        return !!localStorage.getItem("token");
    },
};