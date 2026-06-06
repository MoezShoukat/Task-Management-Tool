export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiry: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TaskDto {
  id: number;
  title: string;
  description: string;
  priority: string;
  status: string;
  category: string;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string | null;
  assignedToUserId: string;
  assignedToName: string;
  createdByUserId: string;
  createdByName: string;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  priority: string;
  category: string;
  dueDate: string | null;
  assignedToUserId: string;
}

export interface UpdateTaskRequest {
  title: string;
  description: string;
  priority: string;
  status: string;
  category: string;
  dueDate: string | null;
  assignedToUserId: string;
}

export interface TaskSummaryDto {
  pending: number;
  inProgress: number;
  completed: number;
  total: number;
}