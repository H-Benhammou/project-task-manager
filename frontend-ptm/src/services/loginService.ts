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
        // Clear any existing token before login
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        
        const response = await api.post("/auth/login", data);
        
        // Store the new token and user info
        if (response.data.token) {
            localStorage.setItem("token", response.data.token);
        }
        if (response.data.user) {
            localStorage.setItem("user", JSON.stringify(response.data.user));
        }
        
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
        const token = localStorage.getItem("token");
        return !!token;
    },
};