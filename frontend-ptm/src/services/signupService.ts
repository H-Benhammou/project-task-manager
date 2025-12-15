// src/services/signupService.ts
import api from "./api";

export interface SignUpData {
    name: string;
    email: string;
    password: string;
}

export interface SignUpResponse {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
    message: string;
}

export const signupService = {
    register: async (data: SignUpData): Promise<SignUpResponse> => {
        // Clear any existing token before signup
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        
        const response = await api.post("/auth/register", data);
        
        // Store the new token and user info
        if (response.data.token) {
            localStorage.setItem("token", response.data.token);
        }
        if (response.data.user) {
            localStorage.setItem("user", JSON.stringify(response.data.user));
        }
        
        return response.data;
    },
};