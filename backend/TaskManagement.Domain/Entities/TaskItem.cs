namespace TaskManagement.Domain.Entities;

public enum TaskPriority { Low, Medium, High }
public enum TaskStatus { Pending, InProgress, Completed }

public class TaskItem
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public TaskPriority Priority { get; set; } = TaskPriority.Medium;
    public TaskStatus Status { get; set; } = TaskStatus.Pending;
    public DateTime? DueDate { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public string Category { get; set; } = string.Empty;

    // Assigned user
    public string AssignedToUserId { get; set; } = string.Empty;
    public AppUser AssignedTo { get; set; } = null!;

    // Created by
    public string CreatedByUserId { get; set; } = string.Empty;
    public AppUser CreatedBy { get; set; } = null!;
}