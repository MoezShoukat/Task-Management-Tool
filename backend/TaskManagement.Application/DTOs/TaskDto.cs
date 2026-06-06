namespace TaskManagement.Application.DTOs;

public record TaskDto(
    int Id,
    string Title,
    string Description,
    string Priority,
    string Status,
    string Category,
    DateTime? DueDate,
    DateTime CreatedAt,
    DateTime? UpdatedAt,
    string AssignedToUserId,
    string AssignedToName,
    string CreatedByUserId,
    string CreatedByName
);