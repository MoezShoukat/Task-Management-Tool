using TaskManagement.Application.DTOs;

namespace TaskManagement.Application.Interfaces;

public interface ITaskService
{
    Task<IReadOnlyList<TaskDto>> GetAllTasksAsync(string userId, string role);
    Task<TaskDto?> GetTaskByIdAsync(int id, string userId, string role);
    Task<TaskDto> CreateTaskAsync(CreateTaskRequest request, string createdByUserId);
    Task<TaskDto> UpdateTaskAsync(int id, UpdateTaskRequest request, string userId, string role);
    Task DeleteTaskAsync(int id, string userId, string role);
    Task<TaskSummaryDto> GetTaskSummaryAsync(string userId, string role);
}