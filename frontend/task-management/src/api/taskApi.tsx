import axios from 'axios';
import type { TaskDto, CreateTaskRequest, UpdateTaskRequest, TaskSummaryDto } from '../types/auth';

const API = axios.create({
  baseURL: 'http://localhost:5258/api',
});

API.interceptors.request.use((config) => {
  const stored = sessionStorage.getItem('user');
  if (stored) {
    const user = JSON.parse(stored);
    config.headers.Authorization = `Bearer ${user.accessToken}`;
  }
  return config;
});

export const getTasks = async (): Promise<TaskDto[]> => {
  const res = await API.get<TaskDto[]>('/task');
  return res.data;
};

export const getTaskById = async (id: number): Promise<TaskDto> => {
  const res = await API.get<TaskDto>(`/task/${id}`);
  return res.data;
};

export const createTask = async (data: CreateTaskRequest): Promise<TaskDto> => {
  const res = await API.post<TaskDto>('/task', data);
  return res.data;
};

export const updateTask = async (id: number, data: UpdateTaskRequest): Promise<TaskDto> => {
  const res = await API.put<TaskDto>(`/task/${id}`, data);
  return res.data;
};

export const deleteTask = async (id: number): Promise<void> => {
  await API.delete(`/task/${id}`);
};

export const getTaskSummary = async (): Promise<TaskSummaryDto> => {
  const res = await API.get<TaskSummaryDto>('/task/summary');
  return res.data;
};