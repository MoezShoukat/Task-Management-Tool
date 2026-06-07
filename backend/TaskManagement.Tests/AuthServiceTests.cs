using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using TaskManagement.Application.DTOs;
using TaskManagement.Domain.Entities;
using TaskManagement.Infrastructure.Data;
using TaskManagement.Infrastructure.Services;
using TaskManagement.Tests.Helpers;

namespace TaskManagement.Tests;

public class AuthServiceTests : IDisposable
{
    private readonly AppDbContext _context;
    private readonly UserManager<AppUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly AuthService _authService;

    public AuthServiceTests()
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
        _roleManager = provider.GetRequiredService<RoleManager<IdentityRole>>();

        // Seed roles
        _roleManager.CreateAsync(new IdentityRole("User")).GetAwaiter().GetResult();
        _roleManager.CreateAsync(new IdentityRole("Admin")).GetAwaiter().GetResult();

        var config = ConfigurationHelper.GetTestConfiguration();
        _authService = new AuthService(_userManager, config, _context);
    }

    // ── Register Tests ───────────────────────────────────────────────

    [Fact]
    public async Task Register_WithValidData_ReturnsAuthResponse()
    {
        // Arrange
        var request = new RegisterRequest("John", "Doe", "john@test.com", "Test@1234");

        // Act
        var result = await _authService.RegisterAsync(request);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("john@test.com", result.Email);
        Assert.Equal("John", result.FirstName);
        Assert.Equal("Doe", result.LastName);
        Assert.Equal("User", result.Role);
        Assert.NotEmpty(result.AccessToken);
        Assert.NotEmpty(result.RefreshToken);
    }

    [Fact]
    public async Task Register_WithDuplicateEmail_ThrowsInvalidOperationException()
    {
        // Arrange
        var request = new RegisterRequest("John", "Doe", "duplicate@test.com", "Test@1234");
        await _authService.RegisterAsync(request);

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(() =>
            _authService.RegisterAsync(request));
    }

    [Fact]
    public async Task Register_WithWeakPassword_ThrowsInvalidOperationException()
    {
        // Arrange
        var request = new RegisterRequest("John", "Doe", "weak@test.com", "123");

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(() =>
            _authService.RegisterAsync(request));
    }

    [Fact]
    public async Task Register_AssignsUserRoleByDefault()
    {
        // Arrange
        var request = new RegisterRequest("Jane", "Doe", "jane@test.com", "Test@1234");

        // Act
        var result = await _authService.RegisterAsync(request);

        // Assert
        Assert.Equal("User", result.Role);
    }

    // ── Login Tests ──────────────────────────────────────────────────

    [Fact]
    public async Task Login_WithValidCredentials_ReturnsAuthResponse()
    {
        // Arrange
        var registerRequest = new RegisterRequest("John", "Doe", "login@test.com", "Test@1234");
        await _authService.RegisterAsync(registerRequest);

        var loginRequest = new LoginRequest("login@test.com", "Test@1234");

        // Act
        var result = await _authService.LoginAsync(loginRequest);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("login@test.com", result.Email);
        Assert.NotEmpty(result.AccessToken);
        Assert.NotEmpty(result.RefreshToken);
    }

    [Fact]
    public async Task Login_WithWrongPassword_ThrowsUnauthorizedAccessException()
    {
        // Arrange
        var registerRequest = new RegisterRequest("John", "Doe", "wrong@test.com", "Test@1234");
        await _authService.RegisterAsync(registerRequest);

        var loginRequest = new LoginRequest("wrong@test.com", "WrongPassword!");

        // Act & Assert
        await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
            _authService.LoginAsync(loginRequest));
    }

    [Fact]
    public async Task Login_WithNonExistentEmail_ThrowsUnauthorizedAccessException()
    {
        // Arrange
        var loginRequest = new LoginRequest("nonexistent@test.com", "Test@1234");

        // Act & Assert
        await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
            _authService.LoginAsync(loginRequest));
    }

    [Fact]
    public async Task Login_ReturnsValidJwtToken()
    {
        // Arrange
        var registerRequest = new RegisterRequest("John", "Doe", "jwt@test.com", "Test@1234");
        await _authService.RegisterAsync(registerRequest);
        var loginRequest = new LoginRequest("jwt@test.com", "Test@1234");

        // Act
        var result = await _authService.LoginAsync(loginRequest);

        // Assert — JWT has 3 parts separated by dots
        var parts = result.AccessToken.Split('.');
        Assert.Equal(3, parts.Length);
    }

    // ── Refresh Token Tests ──────────────────────────────────────────

    [Fact]
    public async Task RefreshToken_WithValidToken_ReturnsNewAuthResponse()
    {
        // Arrange
        var registerRequest = new RegisterRequest("John", "Doe", "refresh@test.com", "Test@1234");
        var authResponse = await _authService.RegisterAsync(registerRequest);

        // Act
        var result = await _authService.RefreshTokenAsync(authResponse.RefreshToken);

        // Assert
        Assert.NotNull(result);
        Assert.NotEqual(authResponse.RefreshToken, result.RefreshToken);
        Assert.NotEmpty(result.AccessToken);
    }

    [Fact]
    public async Task RefreshToken_WithInvalidToken_ThrowsUnauthorizedAccessException()
    {
        // Act & Assert
        await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
            _authService.RefreshTokenAsync("invalid-token"));
    }

    [Fact]
    public async Task RevokeToken_WithValidToken_RevokesSuccessfully()
    {
        // Arrange
        var registerRequest = new RegisterRequest("John", "Doe", "revoke@test.com", "Test@1234");
        var authResponse = await _authService.RegisterAsync(registerRequest);

        // Act
        await _authService.RevokeTokenAsync(authResponse.RefreshToken);

        // Assert — trying to refresh with revoked token should fail
        await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
            _authService.RefreshTokenAsync(authResponse.RefreshToken));
    }

    public void Dispose() => _context.Dispose();
}