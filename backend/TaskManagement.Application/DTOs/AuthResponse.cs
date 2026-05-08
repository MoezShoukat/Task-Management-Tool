namespace TaskManagement.Application.DTOs;

public record AuthResponse(
    string AccessToken,
    string RefreshToken,
    DateTime AccessTokenExpiry,
    string Email,
    string FirstName,
    string LastName,
    string Role
);