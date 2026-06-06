using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Serilog;
using TaskManagement.Application.DTOs;
using TaskManagement.Application.Interfaces;
using TaskManagement.Domain.Entities;
using TaskManagement.Infrastructure.Data;
using DomainTaskStatus = TaskManagement.Domain.Entities.TaskStatus;

namespace TaskManagement.Infrastructure.Services;

public class TaskService : ITaskService
{
    private readonly AppDbContext _context;
    private readonly UserManager<AppUser> _userManager;

    public TaskService(AppDbContext context, UserManager<AppUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    public async Task<IReadOnlyList<TaskDto>> GetAllTasksAsync(string userId, string role)
    {
        Log.Information("Fetching tasks for user {UserId} with role {Role}", userId, role);

        var query = _context.Tasks
            .Include(t => t.AssignedTo)
            .Include(t => t.CreatedBy)
            .AsNoTracking();

        if (role != "Admin")
            query = query.Where(t => t.AssignedToUserId == userId || t.CreatedByUserId == userId);

        var tasks = await query.OrderByDescending(t => t.CreatedAt).ToListAsync();
        return tasks.Select(MapToDto).ToList();
    }

    public async Task<TaskDto?> GetTaskByIdAsync(int id, string userId, string role)
    {
        Log.Information("Fetching task {TaskId} for user {UserId}", id, userId);

        var task = await _context.Tasks
            .Include(t => t.AssignedTo)
            .Include(t => t.CreatedBy)
            .AsNoTracking()
            .FirstOrDefaultAsync(t => t.Id == id);

        if (task is null)
        {
            Log.Warning("Task {TaskId} not found", id);
            throw new KeyNotFoundException($"Task with ID {id} not found.");
        }

        if (role != "Admin" && task.AssignedToUserId != userId && task.CreatedByUserId != userId)
        {
            Log.Warning("User {UserId} unauthorized to access task {TaskId}", userId, id);
            throw new UnauthorizedAccessException("You do not have access to this task.");
        }

        return MapToDto(task);
    }

    public async Task<TaskDto> CreateTaskAsync(CreateTaskRequest request, string createdByUserId)
    {
        Log.Information("Creating task '{Title}' by user {UserId}", request.Title, createdByUserId);

        if (!Enum.TryParse<TaskPriority>(request.Priority, true, out var priority))
            throw new InvalidOperationException($"Invalid priority: {request.Priority}");

        var assignedUserId = string.IsNullOrEmpty(request.AssignedToUserId)
            ? createdByUserId
            : request.AssignedToUserId;

        var assignedUser = await _userManager.FindByIdAsync(assignedUserId);
        if (assignedUser is null)
            throw new InvalidOperationException("Assigned user not found.");

        var task = new TaskItem
        {
            Title = request.Title,
            Description = request.Description,
            Priority = priority,
            Status = DomainTaskStatus.Pending,
            Category = request.Category,
            DueDate = request.DueDate,
            AssignedToUserId = assignedUserId,
            CreatedByUserId = createdByUserId,
            CreatedAt = DateTime.UtcNow
        };

        _context.Tasks.Add(task);
        await _context.SaveChangesAsync();

        var created = await _context.Tasks
            .Include(t => t.AssignedTo)
            .Include(t => t.CreatedBy)
            .FirstAsync(t => t.Id == task.Id);

        Log.Information("Task {TaskId} created successfully", task.Id);
        return MapToDto(created);
    }

    public async Task<TaskDto> UpdateTaskAsync(int id, UpdateTaskRequest request, string userId, string role)
    {
        Log.Information("Updating task {TaskId} by user {UserId}", id, userId);

        var task = await _context.Tasks.FindAsync(id);
        if (task is null)
            throw new KeyNotFoundException($"Task with ID {id} not found.");

        if (role != "Admin" && task.CreatedByUserId != userId)
            throw new UnauthorizedAccessException("You can only update tasks you created.");

        if (!Enum.TryParse<TaskPriority>(request.Priority, true, out var priority))
            throw new InvalidOperationException($"Invalid priority: {request.Priority}");

        if (!Enum.TryParse<DomainTaskStatus>(request.Status, true, out var status))
            throw new InvalidOperationException($"Invalid status: {request.Status}");

        task.Title = request.Title;
        task.Description = request.Description;
        task.Priority = priority;
        task.Status = status;
        task.Category = request.Category;
        task.DueDate = request.DueDate;
        task.AssignedToUserId = request.AssignedToUserId;
        task.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        var updated = await _context.Tasks
            .Include(t => t.AssignedTo)
            .Include(t => t.CreatedBy)
            .FirstAsync(t => t.Id == task.Id);

        Log.Information("Task {TaskId} updated successfully", task.Id);
        return MapToDto(updated);
    }

    public async Task DeleteTaskAsync(int id, string userId, string role)
    {
        Log.Information("Deleting task {TaskId} by user {UserId}", id, userId);

        var task = await _context.Tasks.FindAsync(id);
        if (task is null)
            throw new KeyNotFoundException($"Task with ID {id} not found.");

        if (role != "Admin" && task.CreatedByUserId != userId)
            throw new UnauthorizedAccessException("You can only delete tasks you created.");

        _context.Tasks.Remove(task);
        await _context.SaveChangesAsync();

        Log.Information("Task {TaskId} deleted successfully", id);
    }

    public async Task<TaskSummaryDto> GetTaskSummaryAsync(string userId, string role)
    {
        Log.Information("Fetching task summary for user {UserId}", userId);

        var query = _context.Tasks.AsNoTracking();

        if (role != "Admin")
            query = query.Where(t => t.AssignedToUserId == userId || t.CreatedByUserId == userId);

        var pending = await query.CountAsync(t => t.Status == DomainTaskStatus.Pending);
        var inProgress = await query.CountAsync(t => t.Status == DomainTaskStatus.InProgress);
        var completed = await query.CountAsync(t => t.Status == DomainTaskStatus.Completed);

        return new TaskSummaryDto(pending, inProgress, completed, pending + inProgress + completed);
    }

    private static TaskDto MapToDto(TaskItem t) => new(
        t.Id,
        t.Title,
        t.Description,
        t.Priority.ToString(),
        t.Status.ToString(),
        t.Category,
        t.DueDate,
        t.CreatedAt,
        t.UpdatedAt,
        t.AssignedToUserId,
        $"{t.AssignedTo?.FirstName} {t.AssignedTo?.LastName}".Trim(),
        t.CreatedByUserId,
        $"{t.CreatedBy?.FirstName} {t.CreatedBy?.LastName}".Trim()
    );
}