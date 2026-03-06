import api from "@/lib/axios";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: "admin" | "user";
  country?: string;
  location?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: "admin" | "user";
    avatar?: string;
  };
}

const authService = {
  login: (data: LoginPayload) =>
    api.post<AuthResponse>("/auth/login", data),

  register: (data: RegisterPayload) =>
    api.post<AuthResponse>("/auth/register", data),

  getProfile: () =>
    api.get<AuthResponse["user"]>("/auth/me"),

  forgotPassword: (email: string) =>
    api.post("/auth/forgot-password", { email }),

  resetPassword: (token: string, password: string) =>
    api.post("/auth/reset-password", { token, password }),
};

export default authService;
