import { AxiosError } from 'axios';
import api from "./axios";

interface LoginResponse {
  accessToken: string;
}

interface RegisterPayload {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  role: string;
}

interface ErrorResponse {
  message: string;
}

export async function login(email: string, password: string): Promise<string> {
  try {
    const response = await api.post<LoginResponse>("/auth/login", {
      email,
      password,
    });
    return response.data.accessToken;
  } catch (err) {
    const error = err as AxiosError<ErrorResponse>;
    throw new Error(error.response?.data?.message || 'Login failed');
  }
}

export async function logout(): Promise<void> {
  try {
    await api.post("/auth/logout");
  } catch (err) {
    const error = err as AxiosError<ErrorResponse>;
    throw new Error(error.response?.data?.message || 'Logout failed');
  }
}

export async function register(
  first_name: string,
  last_name: string,
  username: string,
  email: string,
  phone: string,
  password: string
): Promise<void> {
  const payload: RegisterPayload = {
    first_name,
    last_name,
    username,
    email,
    phone,
    password,
    role: "user",
  };
  
  try {
    const response = await api.post("/auth/register", payload);
    return response.data;
  } catch (err) {
    const error = err as AxiosError<ErrorResponse>;
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
}
