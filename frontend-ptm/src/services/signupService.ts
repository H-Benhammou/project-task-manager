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
}

export const signupService = {
    register: async (data: SignUpData): Promise<SignUpResponse> => {
        const response = await api.post("/auth/register", data);
        return response.data;
    },
};