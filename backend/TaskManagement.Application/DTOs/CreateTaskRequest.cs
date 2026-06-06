namespace TaskManagement.Application.DTOs;

public record CreateTaskRequest(
    string Title,
    string Description,
    string Priority,
    string Category,
    DateTime? DueDate,
    string AssignedToUserId
);