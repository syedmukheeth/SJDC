-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Students table
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  course VARCHAR(50) NOT NULL,
  section VARCHAR(10) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Faculty table
CREATE TABLE faculty (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  department VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create Admins table
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(20) DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Subjects table
CREATE TABLE subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  course VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create Attendance table
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  status VARCHAR(10) NOT NULL CHECK (status IN ('Present', 'Absent')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraint: One attendance per student per subject per day
  UNIQUE(student_id, subject_id, date)
);

-- 5. Performance Indexes
CREATE INDEX idx_attendance_student ON attendance(student_id);
CREATE INDEX idx_attendance_subject ON attendance(subject_id);
CREATE INDEX idx_attendance_date ON attendance(date);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies

-- Public/Shared Read
CREATE POLICY "Public Read Subjects" ON subjects FOR SELECT USING (true);

-- Student Policies: Can only see their own attendance
CREATE POLICY "Students see own attendance" ON attendance FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM students 
    WHERE students.id = attendance.student_id 
    AND students.user_id = auth.uid()
  )
);

CREATE POLICY "Students see own profile" ON students FOR SELECT
USING (auth.uid() = user_id);

-- Faculty Policies: Can insert attendance
-- Note: In a real app, you'd have a 'faculty' table or user metadata for role check
-- For now, we assume authenticated users with a specific role or metadata can insert
CREATE POLICY "Faculty can insert attendance" ON attendance FOR INSERT
WITH CHECK (auth.role() = 'authenticated'); -- Simplified role check

-- Admin Policies: Can access everything
-- Assuming admins are flagged in app_metadata or a separate admin role
CREATE POLICY "Admins have full access" ON attendance FOR ALL
USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins manage students" ON students FOR ALL
USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins manage subjects" ON subjects FOR ALL
USING (auth.jwt() ->> 'role' = 'admin');

/*
INSTRUCTIONS TO RUN IN SUPABASE:
1. Go to your Supabase Dashboard.
2. Select your project.
3. Go to "SQL Editor" in the left sidebar.
4. Click "New Query".
5. Paste this entire script and click "Run".
6. Ensure that you have created users in the "Authentication" tab to test the RLS policies.
*/
