# St. Joseph's Degree College Attendance Management System

A comprehensive, full-stack academic management platform designed for modern educational institutions. Built with React (Vite) and Supabase, this system provides a secure and scalable environment for students, faculty, and administrators to monitor and manage academic engagement with precision.

![SJDC Banner](https://images.unsplash.com/photo-1541339907198-e08759dfc3ef?auto=format&fit=crop&q=80&w=2070)

## System Overview

The SJDC Attendance Management System streamlines academic tracking through a role-based architecture, ensuring data integrity and administrative efficiency.

### Student Portal
- **Academic Dashboard**: Real-time visualization of attendance metrics and academic standing.
- **Subject Analysis**: Detailed performance breakdown per course with progress tracking.
- **Attendance Records**: Comprehensive, searchable history with date-wise filtering capabilities.
- **Profile Management**: Secure access to academic credentials and personal profiles.

### Faculty Portal
- **Instructional Dashboard**: Oversight of assigned courses and recent administrative actions.
- **Smart Attendance Management**: High-efficiency interface for attendance tracking with bulk operation support.
- **Conflict Prevention**: Intelligent logic layer to prevent redundant or duplicate data entry.
- **Academic Analytics**: Advanced reporting for identifying student engagement trends and attendance defaulters.

### Administrative Portal
- **Central Command**: High-level system telemetry including student enrollment and global attendance averages.
- **User Governance**: Standardized management protocols for Student and Faculty accounts.
- **Curriculum Architecture**: Integrated management of courses, departments, and subject assignments.
- **Compliance Reporting**: Automated generation of academic compliance and attendance threshold reports.
- **Content Management (CMS)**: Dynamic interface for real-time updates to institutional announcements and website content.

---

## Technical Specifications

- **Frontend Architecture**: React 19 (Vite)
- **Styling Engine**: Tailwind CSS v4 (Modern Performance Engine)
- **Database Architecture**: PostgreSQL (via Supabase)
- **Authentication**: Enterprise-grade RBAC (Role Based Access Control) via Supabase Auth
- **Routing Infrastructure**: React Router 7
- **Messaging Service**: Integrated Global Notification and Toast System

---

## Installation and Deployment

### 1. Prerequisites
- Node.js (Version 18.x or higher)
- Supabase Project Instance

### 2. Local Environment Setup
```bash
# Clone the repository
git clone https://github.com/syedmukheeth/SJDC.git

# Install project dependencies
npm install
```

### 3. Configuration
Define your Supabase instance credentials in a `.env` file located in the project root:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Database Initialization
Execute the SQL scripts provided in `schema.sql` within the Supabase SQL Editor to initialize the relational schema, optimized indexes, and Row Level Security (RLS) policies.

### 5. Development Execution
```bash
npm run dev
```

---

## Security Framework

The platform implements a multi-layered security strategy to protect institutional data:
- **Relational Access Control**: Row Level Security (RLS) ensures granular data isolation at the database level.
- **Role Verification**: Middleware-level protection prevents unauthorized access to administrative and faculty resources.
- **Encrypted Communication**: Secure handling of authentication tokens and session management.

---

## Contribution Standards

We maintain high standards for code quality and system architecture. To contribute:

1. Fork the Project
2. Initialize a dedicated feature branch (`git checkout -b feature/Optimization`)
3. Document your changes with professional commit messages
4. Submit a Pull Request for peer review

**Architectural Guidelines:**
- Adhere to **Tailwind CSS v4** design tokens.
- Maintain the **Context Provider** pattern for application-wide state.
- Ensure all interface components satisfy responsive design requirements.

---

## License and Institutional Ownership
This software is developed for the exclusive use of St. Joseph's Degree College, Kurnool. All rights reserved.

---

**Developed for St. Joseph's Degree College**
