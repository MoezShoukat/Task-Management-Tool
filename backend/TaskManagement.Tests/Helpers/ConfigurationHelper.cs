using Microsoft.Extensions.Configuration;

namespace TaskManagement.Tests.Helpers;

public static class ConfigurationHelper
{
    public static IConfiguration GetTestConfiguration()
    {
        var config = new Dictionary<string, string?>
        {
            ["JwtSettings:SecretKey"] = "TM$Dev#MoezShoukat@2026!xK9mP2qL8nR5vZ3wY7",
            ["JwtSettings:Issuer"] = "TaskManagementAPI",
            ["JwtSettings:Audience"] = "TaskManagementClient"
        };

        return new ConfigurationBuilder()
            .AddInMemoryCollection(config)
            .Build();
    }
}