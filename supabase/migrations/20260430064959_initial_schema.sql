-- SJDC Database Schema & RLS Policies
-- Initial Migration

-- 1. Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Tables
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.faculty (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    name VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    course VARCHAR(50) NOT NULL,
    section VARCHAR(10) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    course VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(10) NOT NULL CHECK (status IN ('Present', 'Absent')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(student_id, subject_id, date)
);

CREATE TYPE resource_category AS ENUM ('syllabus', 'pyq', 'notes', 'assignment');

CREATE TABLE IF NOT EXISTS public.resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    category resource_category NOT NULL,
    file_path TEXT NOT NULL,
    file_size INT,
    file_type VARCHAR(50),
    academic_year INT NOT NULL,
    semester INT NOT NULL CHECK (semester BETWEEN 1 AND 8),
    download_count INT DEFAULT 0,
    uploaded_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.website_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section TEXT NOT NULL UNIQUE,
    title TEXT,
    content TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT true,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_by UUID REFERENCES auth.users(id)
);

-- 3. Security (RLS)
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_content ENABLE ROW LEVEL SECURITY;

-- 4. Policies

-- Admins
CREATE POLICY "Users view own admin" ON admins FOR SELECT USING (auth.uid() = user_id);

-- Faculty
CREATE POLICY "Users view own faculty" ON faculty FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Faculty can read all students" ON students FOR SELECT USING (EXISTS (SELECT 1 FROM faculty WHERE user_id = auth.uid()));
CREATE POLICY "Faculty can read all attendance" ON attendance FOR SELECT USING (EXISTS (SELECT 1 FROM faculty WHERE user_id = auth.uid()));
CREATE POLICY "Faculty can insert attendance" ON attendance FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM faculty WHERE user_id = auth.uid()));

-- Students
CREATE POLICY "Students see own profile" ON students FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Students see own attendance" ON attendance FOR SELECT USING (EXISTS (SELECT 1 FROM students WHERE id = attendance.student_id AND user_id = auth.uid()));

-- Subjects (Public authenticated)
CREATE POLICY "Public Read Subjects" ON subjects FOR SELECT USING (true);

-- Resources
CREATE POLICY "Public Read Resources" ON resources FOR SELECT TO authenticated USING (true);
CREATE POLICY "Staff Manage Resources" ON resources FOR ALL TO authenticated 
USING (
  EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid()) OR
  EXISTS (SELECT 1 FROM faculty WHERE user_id = auth.uid())
);

-- Website Content (CMS)
CREATE POLICY "Public Read Active Content" ON website_content FOR SELECT USING (is_active = true);
CREATE POLICY "Admin Manage CMS" ON website_content FOR ALL TO authenticated 
USING (EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())) 
WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid()));

-- Admin Universal Access
CREATE POLICY "Admin Full Access Students" ON students FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid()));
CREATE POLICY "Admin Full Access Faculty" ON faculty FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid()));
CREATE POLICY "Admin Full Access Subjects" ON subjects FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid()));
CREATE POLICY "Admin Full Access Attendance" ON attendance FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid()));

-- 5. Indexes
CREATE INDEX IF NOT EXISTS idx_resources_subject_category ON resources(subject_id, category);
CREATE INDEX IF NOT EXISTS idx_resources_year ON resources(academic_year) WHERE category = 'pyq';
