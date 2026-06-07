using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using TaskManagement.Application.DTOs;
using TaskManagement.Domain.Entities;
using TaskManagement.Infrastructure.Data;
using TaskManagement.Infrastructure.Services;

namespace TaskManagement.Tests;

public class TaskServiceTests : IDisposable
{
    private readonly AppDbContext _context;
    private readonly UserManager<AppUser> _userManager;
    private readonly TaskService _taskService;
    private readonly AppUser _testUser;
    private readonly AppUser _adminUser;

    public TaskServiceTests()
    {
        var services = new ServiceCollection();
        services.AddLogging();
        services.AddDbContext<AppDbContext>(o =>
            o.UseInMemoryDatabase(Guid.NewGuid().ToString()));
        services.AddIdentityCore<AppUser>()
            .AddRoles<IdentityRole>()
            .AddEntityFrameworkStores<AppDbContext>();

        var provider = services.BuildServiceProvider();
        _context = provider.GetRequiredService<AppDbContext>();
        _userManager = provider.GetRequiredService<UserManager<AppUser>>();
        var roleManager = provider.GetRequiredService<RoleManager<IdentityRole>>();

        roleManager.CreateAsync(new IdentityRole("User")).GetAwaiter().GetResult();
        roleManager.CreateAsync(new IdentityRole("Admin")).GetAwaiter().GetResult();

        // Seed test users
        _testUser = new AppUser
        {
            Id = Guid.NewGuid().ToString(),
            FirstName = "Test",
            LastName = "User",
            Email = "testuser@test.com",
            UserName = "testuser@test.com"
        };
        _userManager.CreateAsync(_testUser, "Test@1234").GetAwaiter().GetResult();
        _userManager.AddToRoleAsync(_testUser, "User").GetAwaiter().GetResult();

        _adminUser = new AppUser
        {
            Id = Guid.NewGuid().ToString(),
            FirstName = "Admin",
            LastName = "User",
            Email = "admin@test.com",
            UserName = "admin@test.com"
        };
        _userManager.CreateAsync(_adminUser, "Admin@1234").GetAwaiter().GetResult();
        _userManager.AddToRoleAsync(_adminUser, "Admin").GetAwaiter().GetResult();

        _taskService = new TaskService(_context, _userManager);
    }

    // ── Create Task Tests ────────────────────────────────────────────

    [Fact]
    public async Task CreateTask_WithValidData_ReturnsTaskDto()
    {
        // Arrange
        var request = new CreateTaskRequest(
            "Test Task", "Description", "High", "Work", null, "");

        // Act
        var result = await _taskService.CreateTaskAsync(request, _testUser.Id);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Test Task", result.Title);
        Assert.Equal("High", result.Priority);
        Assert.Equal("Pending", result.Status);
        Assert.Equal(_testUser.Id, result.CreatedByUserId);
    }

    [Fact]
    public async Task CreateTask_WithNoAssignee_AssignsToCreator()
    {
        // Arrange
        var request = new CreateTaskRequest(
            "Self Task", "Description", "Low", "Personal", null, "");

        // Act
        var result = await _taskService.CreateTaskAsync(request, _testUser.Id);

        // Assert
        Assert.Equal(_testUser.Id, result.AssignedToUserId);
    }

    [Fact]
    public async Task CreateTask_WithInvalidPriority_ThrowsInvalidOperationException()
    {
        // Arrange
        var request = new CreateTaskRequest(
            "Task", "Desc", "SuperHigh", "Work", null, "");

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(() =>
            _taskService.CreateTaskAsync(request, _testUser.Id));
    }

    [Fact]
    public async Task CreateTask_WithInvalidAssigneeId_ThrowsInvalidOperationException()
    {
        // Arrange
        var request = new CreateTaskRequest(
            "Task", "Desc", "Medium", "Work", null, "nonexistent-user-id");

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(() =>
            _taskService.CreateTaskAsync(request, _testUser.Id));
    }

    // ── Get Tasks Tests ──────────────────────────────────────────────

    [Fact]
    public async Task GetAllTasks_AsUser_ReturnsOnlyOwnTasks()
    {
        // Arrange
        var request1 = new CreateTaskRequest("My Task", "Desc", "Low", "Work", null, "");
        await _taskService.CreateTaskAsync(request1, _testUser.Id);

        var request2 = new CreateTaskRequest("Admin Task", "Desc", "Low", "Work", null, "");
        await _taskService.CreateTaskAsync(request2, _adminUser.Id);

        // Act
        var result = await _taskService.GetAllTasksAsync(_testUser.Id, "User");

        // Assert
        Assert.All(result, t =>
            Assert.True(t.AssignedToUserId == _testUser.Id || t.CreatedByUserId == _testUser.Id));
    }

    [Fact]
    public async Task GetAllTasks_AsAdmin_ReturnsAllTasks()
    {
        // Arrange
        var request1 = new CreateTaskRequest("User Task", "Desc", "Low", "Work", null, "");
        await _taskService.CreateTaskAsync(request1, _testUser.Id);

        var request2 = new CreateTaskRequest("Admin Task", "Desc", "Low", "Work", null, "");
        await _taskService.CreateTaskAsync(request2, _adminUser.Id);

        // Act
        var result = await _taskService.GetAllTasksAsync(_adminUser.Id, "Admin");

        // Assert
        Assert.True(result.Count >= 2);
    }

    [Fact]
    public async Task GetTaskById_WithValidId_ReturnsTask()
    {
        // Arrange
        var request = new CreateTaskRequest("Find Me", "Desc", "Medium", "Work", null, "");
        var created = await _taskService.CreateTaskAsync(request, _testUser.Id);

        // Act
        var result = await _taskService.GetTaskByIdAsync(created.Id, _testUser.Id, "User");

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Find Me", result!.Title);
    }

    [Fact]
    public async Task GetTaskById_WithNonExistentId_ThrowsKeyNotFoundException()
    {
        // Act & Assert
        await Assert.ThrowsAsync<KeyNotFoundException>(() =>
            _taskService.GetTaskByIdAsync(99999, _testUser.Id, "User"));
    }

    [Fact]
    public async Task GetTaskById_AsUnauthorizedUser_ThrowsUnauthorizedAccessException()
    {
        // Arrange
        var otherUser = new AppUser
        {
            Id = Guid.NewGuid().ToString(),
            FirstName = "Other",
            LastName = "User",
            Email = "other@test.com",
            UserName = "other@test.com"
        };
        await _userManager.CreateAsync(otherUser, "Test@1234");

        var request = new CreateTaskRequest("Private Task", "Desc", "Low", "Work", null, "");
        var created = await _taskService.CreateTaskAsync(request, _testUser.Id);

        // Act & Assert
        await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
            _taskService.GetTaskByIdAsync(created.Id, otherUser.Id, "User"));
    }

    // ── Update Task Tests ────────────────────────────────────────────

    [Fact]
    public async Task UpdateTask_WithValidData_UpdatesSuccessfully()
    {
        // Arrange
        var createRequest = new CreateTaskRequest("Original", "Desc", "Low", "Work", null, "");
        var created = await _taskService.CreateTaskAsync(createRequest, _testUser.Id);

        var updateRequest = new UpdateTaskRequest(
            "Updated", "New Desc", "High", "InProgress", "Personal", null, _testUser.Id);

        // Act
        var result = await _taskService.UpdateTaskAsync(created.Id, updateRequest, _testUser.Id, "User");

        // Assert
        Assert.Equal("Updated", result.Title);
        Assert.Equal("High", result.Priority);
        Assert.Equal("InProgress", result.Status);
    }

    [Fact]
    public async Task UpdateTask_AsNonCreator_ThrowsUnauthorizedAccessException()
    {
        // Arrange
        var createRequest = new CreateTaskRequest("My Task", "Desc", "Low", "Work", null, "");
        var created = await _taskService.CreateTaskAsync(createRequest, _testUser.Id);

        var updateRequest = new UpdateTaskRequest(
            "Hacked", "Desc", "Low", "Pending", "Work", null, _adminUser.Id);

        // Act & Assert
        await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
            _taskService.UpdateTaskAsync(created.Id, updateRequest, _adminUser.Id, "User"));
    }

    [Fact]
    public async Task UpdateTask_AsAdmin_CanUpdateAnyTask()
    {
        // Arrange
        var createRequest = new CreateTaskRequest("User Task", "Desc", "Low", "Work", null, "");
        var created = await _taskService.CreateTaskAsync(createRequest, _testUser.Id);

        var updateRequest = new UpdateTaskRequest(
            "Admin Updated", "Desc", "High", "Completed", "Work", null, _testUser.Id);

        // Act
        var result = await _taskService.UpdateTaskAsync(created.Id, updateRequest, _adminUser.Id, "Admin");

        // Assert
        Assert.Equal("Admin Updated", result.Title);
        Assert.Equal("Completed", result.Status);
    }

    // ── Delete Task Tests ────────────────────────────────────────────

    [Fact]
    public async Task DeleteTask_AsCreator_DeletesSuccessfully()
    {
        // Arrange
        var request = new CreateTaskRequest("Delete Me", "Desc", "Low", "Work", null, "");
        var created = await _taskService.CreateTaskAsync(request, _testUser.Id);

        // Act
        await _taskService.DeleteTaskAsync(created.Id, _testUser.Id, "User");

        // Assert
        await Assert.ThrowsAsync<KeyNotFoundException>(() =>
            _taskService.GetTaskByIdAsync(created.Id, _testUser.Id, "User"));
    }

    [Fact]
    public async Task DeleteTask_AsNonCreator_ThrowsUnauthorizedAccessException()
    {
        // Arrange
        var request = new CreateTaskRequest("Protected Task", "Desc", "Low", "Work", null, "");
        var created = await _taskService.CreateTaskAsync(request, _testUser.Id);

        // Act & Assert
        await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
            _taskService.DeleteTaskAsync(created.Id, _adminUser.Id, "User"));
    }

    [Fact]
    public async Task DeleteTask_WithNonExistentId_ThrowsKeyNotFoundException()
    {
        // Act & Assert
        await Assert.ThrowsAsync<KeyNotFoundException>(() =>
            _taskService.DeleteTaskAsync(99999, _testUser.Id, "User"));
    }

    // ── Summary Tests ────────────────────────────────────────────────

    [Fact]
    public async Task GetTaskSummary_ReturnsCorrectCounts()
    {
        // Arrange — create tasks with different statuses
        var t1 = new CreateTaskRequest("T1", "", "Low", "", null, "");
        var t2 = new CreateTaskRequest("T2", "", "Low", "", null, "");
        var t3 = new CreateTaskRequest("T3", "", "Low", "", null, "");
        var created1 = await _taskService.CreateTaskAsync(t1, _testUser.Id);
        var created2 = await _taskService.CreateTaskAsync(t2, _testUser.Id);
        var created3 = await _taskService.CreateTaskAsync(t3, _testUser.Id);

        // Update statuses
        await _taskService.UpdateTaskAsync(created2.Id,
            new UpdateTaskRequest("T2", "", "Low", "InProgress", "", null, _testUser.Id),
            _testUser.Id, "User");
        await _taskService.UpdateTaskAsync(created3.Id,
            new UpdateTaskRequest("T3", "", "Low", "Completed", "", null, _testUser.Id),
            _testUser.Id, "User");

        // Act
        var summary = await _taskService.GetTaskSummaryAsync(_testUser.Id, "User");

        // Assert
        Assert.True(summary.Pending >= 1);
        Assert.True(summary.InProgress >= 1);
        Assert.True(summary.Completed >= 1);
        Assert.Equal(summary.Pending + summary.InProgress + summary.Completed, summary.Total);
    }

    public void Dispose() => _context.Dispose();
}