# Task Management Tool

A full-stack task management application built with ASP.NET Core, React.js, Entity Framework, and SQL Server.

## Tech Stack

- **Backend:** ASP.NET Core (.NET 10), Entity Framework Core, SQL Server, Serilog, JWT Auth
- **Frontend:** React.js (Vite + TypeScript), shadcn/ui, Tailwind CSS, Framer Motion
- **Testing:** xUnit
- **Code Quality:** SonarQube

## Prerequisites

Before running this project make sure you have:

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org/)
- SQL Server (Express or full) with Windows Authentication
- [Git](https://git-scm.com/)

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/MoezShoukat/Task-Management-Tool.git
cd Task-Management-Tool
```

### 2. Backend Setup

Create your local secrets file at `backend/TaskManagement.API/appsettings.Development.json`:

```json
{
  "JwtSettings": {
    "SecretKey": "YOUR_SECRET_KEY_MIN_32_CHARS"
  }
}
```

Update the connection string in `appsettings.json` to match your SQL Server instance:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost\\SQLEXPRESS;Database=TaskManagementDb;Trusted_Connection=True;TrustServerCertificate=True;"
}
```

Install EF tools and run migrations:

```bash
dotnet tool install --global dotnet-ef
dotnet ef database update --project backend/TaskManagement.Infrastructure --startup-project backend/TaskManagement.API
```

Run the API:

```bash
dotnet run --project backend/TaskManagement.API
```

API runs on `http://localhost:5258`. Swagger available at `http://localhost:5258/swagger`.

Default admin credentials:
- Email: `admin@taskmanager.com`
- Password: `Admin@1234`

### 3. Frontend Setup

```bash
cd frontend/task-management
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Logs

Application logs are saved daily to the `logs/` folder in the API project root.

## Git Strategy

- `main` — stable, production-ready code
- `feature/*` — feature branches, PR into main when complete

## SonarQube Code Quality

This project uses SonarQube for code quality analysis.

### Prerequisites
- SonarQube 9.9 LTS running locally at `http://localhost:9000`
- Java 17
- dotnet-sonarscanner tool: `dotnet tool install --global dotnet-sonarscanner --version 5.15.0`

### Running Analysis

```bash
# Set Java path
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"

# Run analysis (replace YOUR_TOKEN with your SonarQube token)
dotnet sonarscanner begin /k:"task-management-tool" /d:sonar.host.url="http://localhost:9000" /d:sonar.login="YOUR_TOKEN"
dotnet build TaskManagement.slnx
dotnet sonarscanner end /d:sonar.login="YOUR_TOKEN"
```

Results available at: `http://localhost:9000/dashboard?id=task-management-tool`