namespace TaskManagement.Application.DTOs;

public record TaskSummaryDto(
    int Pending,
    int InProgress,
    int Completed,
    int Total
);