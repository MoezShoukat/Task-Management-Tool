import axios from 'axios';
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types/auth';

const API = axios.create({
  baseURL: 'http://localhost:5258/api',
});

export const registerUser = async (data: RegisterRequest): Promise<AuthResponse> => {
  const res = await API.post<AuthResponse>('/auth/register', data);
  return res.data;
};

export const loginUser = async (data: LoginRequest): Promise<AuthResponse> => {
  const res = await API.post<AuthResponse>('/auth/login', data);
  return res.data;
};