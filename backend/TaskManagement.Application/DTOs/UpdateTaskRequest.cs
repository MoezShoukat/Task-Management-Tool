namespace TaskManagement.Application.DTOs;

public record UpdateTaskRequest(
    string Title,
    string Description,
    string Priority,
    string Status,
    string Category,
    DateTime? DueDate,
    string AssignedToUserId
);