# 🏛️ SJDC Attendance Management System

A premium, full-stack college attendance management platform built with **React (Vite)** and **Supabase**. This system provides a seamless experience for students, faculty, and administrators to track and manage academic attendance with real-time analytics.

![SJDC Banner](https://images.unsplash.com/photo-1541339907198-e08759dfc3ef?auto=format&fit=crop&q=80&w=2070)

## 🌟 Key Features

### 🎓 Student Portal
- **Dashboard**: Real-time attendance percentage tracking and quick stats.
- **Subject Analysis**: Breakdown of attendance per subject with progress bars.
- **Attendance History**: Detailed logs with date-wise filtering.
- **Profile Management**: View and update academic profile information.

### 👨‍🏫 Faculty Portal
- **Dashboard**: Overview of assigned subjects and recent activities.
- **Smart Marking**: Attendance marking with bulk actions (Mark All Present/Absent).
- **Duplicate Prevention**: Built-in logic to prevent multiple entries for the same date/subject.
- **Analytics**: Subject-wise performance reports and defaulter identification.

### 👑 Admin Portal
- **Command Center**: System-wide statistics (Total Students, Subjects, Avg Attendance).
- **User Management**: Full CRUD operations for Students and Faculty.
- **Curriculum Management**: Manage courses and subjects.
- **Reporting Engine**: Automated "Defaulter" reports for students below 75% attendance.
- **CMS**: Dynamic Website Content Management to update news and hero sections.

---

## 🛠️ Tech Stack

- **Frontend**: React 19 (Vite)
- **Styling**: Tailwind CSS v4 (Modern Engine)
- **Backend/Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (RBAC - Role Based Access Control)
- **Routing**: React Router 7
- **Notifications**: Custom Global Toast System

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18 or higher)
- A Supabase account

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/syedmukheeth/SJDC.git

# Install dependencies
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory and add your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Database Initialization
Run the provided `schema.sql` in your Supabase SQL Editor to set up the tables, indexes, and RLS policies.

### 5. Running the App
```bash
npm run dev
```

---

## 📁 Project Structure

```text
src/
├── components/       # Reusable UI components (Buttons, Cards, Modals)
├── context/          # Auth & Toast Notification Providers
├── hooks/            # Custom hooks (useAuth)
├── lib/              # Supabase Client configuration
├── pages/            # Role-based portals (Student, Faculty, Admin)
├── utils/            # Constants and helper functions
└── index.css         # Tailwind v4 Theme & Global Styles
```

---

## 🛡️ Security
- **Role-Based Access**: Pages are protected via a `ProtectedRoute` wrapper.
- **RLS Policies**: Row Level Security ensures students can only see their own data, while faculty see assigned data.
- **Encrypted Auth**: Handled securely via Supabase Auth.

---

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

**Coding Standards:**
- Use **Tailwind CSS v4** for all styling.
- Follow the established **Context Provider** pattern for state management.
- Ensure all new components are mobile-responsive.

---

## 📄 License
This project is for academic purposes. [St. Joseph's Degree College, Kurnool]

---

**Developed with ❤️ for SJDC**
