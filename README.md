# TaskFlow - Project & Task Management System

A full-stack project management application built with Spring Boot, React, and PostgreSQL. Manage your projects and tasks with an intuitive interface, real-time progress tracking, and secure authentication.

## Features

### Secure Authentication
JWT-based authentication system ensuring your data is protected. Login with email and password to access your personalized workspace.

### Project Management
- Create and organize unlimited projects with titles and descriptions
- View all projects in one centralized dashboard
- Search projects quickly with built-in search functionality
- Paginated project lists for efficient browsing

### Task Organization
- Add detailed tasks to each project with titles, descriptions, and due dates
- Filter tasks based on their status (pending/completed)
- Mark tasks as completed with a single click
- Keep everything organized and on track

### Progress Tracking
Real-time progress calculation showing total tasks, completed tasks, and completion percentage for each project with visual progress bars and statistics.

### CRUD Operations
- **Create**: Launch new projects and tasks instantly
- **Read**: View all projects, tasks, and their details
- **Update**: Modify project and task information whenever needed
- **Delete**: Remove tasks or projects that are no longer needed

### Technical Highlights
- Clean architecture with separation of concerns
- RESTful API design
- Comprehensive input validation
- Robust error handling
- Real-time updates and feedback
- Responsive design for all devices
- Modern, intuitive user interface

## Tools & Technologies

### Backend
- **Java**: 21
- **Spring Boot**: 4.0.0
- **Spring Security**: JWT-based authentication
- **Spring Data JPA**: Database ORM
- **PostgreSQL**: 17.2
- **Maven**: 3.9.11
- **Lombok**: 1.18.42

### Frontend
- **React**: 19.2.0
- **TypeScript**: 5.9.3
- **Vite**: 7.2.4
- **Tailwind CSS**: 4.1.18
- **React Router**: 7.10.1
- **Axios**: 1.13.2
- **Lucide React**: 0.561.0

### Database
- **PostgreSQL**: 17.2-alpine

## Prerequisites

- Java 21 or higher
- Node.js 20.18.1 or higher
- PostgreSQL 17.2 or higher
- Maven 3.9.11 or higher
- npm or yarn

## Database Setup

1. **Install PostgreSQL**
   ```bash
   # On macOS with Homebrew
   brew install postgresql@17
   
   # On Ubuntu/Debian
   sudo apt-get install postgresql-17
   
   # On Windows, download from https://www.postgresql.org/download/
   ```

2. **Start PostgreSQL Service**
   ```bash
   # On macOS
   brew services start postgresql@17
   
   # On Ubuntu/Debian
   sudo systemctl start postgresql
   
   # On Windows, PostgreSQL runs as a service automatically
   ```

3. **Create Database and User**
   ```bash
   # Access PostgreSQL
   psql -U postgres
   
   # In PostgreSQL shell, run:
   CREATE DATABASE taskflow_db;
   CREATE USER taskflow_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE taskflow_db TO taskflow_user;
   \q
   ```

4. **Create Environment File**
   
   Create a `.env` file in the project root:
   ```env
   # Database Configuration
   POSTGRES_DB=taskflow_db
   POSTGRES_USER=taskflow_user
   POSTGRES_PASSWORD=your_password
   
   # Spring Boot Configuration
   SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/taskflow_db
   SPRING_DATASOURCE_USERNAME=taskflow_user
   SPRING_DATASOURCE_PASSWORD=your_password
   
   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key_min_256_bits_base64_encoded
   JWT_EXPIRATION=86400000
   ```

## Backend Setup & Run

1. **Navigate to Backend Directory**
   ```bash
   cd backend-ptm
   ```

2. **Configure Application Properties**
   
   The application uses environment variables. Ensure your `.env` file is set up (see Database Setup step 4).

3. **Build the Project**
   ```bash
   ./mvnw clean install
   
   # On Windows
   mvnw.cmd clean install
   ```

4. **Run the Application**
   ```bash
   ./mvnw spring-boot:run
   
   # On Windows
   mvnw.cmd spring-boot:run
   ```

   The backend server will start on `http://localhost:8080`

## Frontend Setup & Run

1. **Navigate to Frontend Directory**
   ```bash
   cd frontend-ptm
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   
   Create a `.env` file in the `frontend-ptm` directory:
   ```env
   VITE_API_URL=http://localhost:8080/api
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

   The frontend will start on `http://localhost:5173`

5. **Build for Production**
   ```bash
   npm run build
   ```

6. **Preview Production Build**
   ```bash
   npm run preview
   ```

## Docker Setup (Bonus)

The application is fully dockerized (frontend, backend, database) using Docker Compose.

### Current Status
- **Frontend container**: Works as expected
- **Database container**: Works as expected
- **Backend container**: Starts correctly, but API requests return HTTP 403 only in the Dockerized environment

### Known Issue
The 403 issue does not occur when running the backend locally. It is likely related to environment configuration (e.g., security, CORS, headers, or reverse proxy setup). Due to time constraints, this issue was not fully resolved.

### Running with Docker

1. **Ensure `.env` file is configured** (see Database Setup step 4)

2. **Build and Start Services**
   ```bash
   docker-compose up -d
   ```

3. **Stop Services**
   ```bash
   docker-compose down
   ```

4. **Access the Application**
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:8080` (Note: 403 issue exists)

### Future Work
- Investigate and fix Docker-only 403 issue
- Add comprehensive unit tests

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Projects
- `GET /api/projects` - Get paginated projects
- `GET /api/projects/all` - Get all projects
- `GET /api/projects/recent` - Get recently modified projects
- `GET /api/projects/{id}` - Get project by ID
- `POST /api/projects` - Create new project
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project

### Tasks
- `GET /api/projects/{projectId}/tasks` - Get all tasks for a project
- `GET /api/projects/{projectId}/tasks/{taskId}` - Get task by ID
- `POST /api/projects/{projectId}/tasks` - Create new task
- `PUT /api/projects/{projectId}/tasks/{taskId}` - Update task
- `PATCH /api/projects/{projectId}/tasks/{taskId}/complete` - Mark task as completed
- `DELETE /api/projects/{projectId}/tasks/{taskId}` - Delete task

## Default Credentials

No default credentials are seeded. You must register a new account through the signup page.

## Project Structure

```
project-task-manager/
├── backend-ptm/           # Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/example/project_task_manager/
│   │   │   │       ├── config/
│   │   │   │       ├── controller/
│   │   │   │       ├── dto/
│   │   │   │       ├── entity/
│   │   │   │       ├── mapper/
│   │   │   │       ├── repository/
│   │   │   │       ├── security/
│   │   │   │       └── service/
│   │   │   └── resources/
│   │   └── test/
│   ├── pom.xml
│   └── Dockerfile
│
├── frontend-ptm/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── Dockerfile
│
├── docker-compose.yml
└── .env
```

## Troubleshooting

### Backend Issues

**Port 8080 already in use**
```bash
# Find and kill the process using port 8080
lsof -ti:8080 | xargs kill -9
```

**Database connection failed**
- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database exists

### Frontend Issues

**Port 5173 already in use**
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

**API connection refused**
- Ensure backend is running on port 8080
- Check `VITE_API_URL` in frontend `.env`
- Verify CORS configuration
