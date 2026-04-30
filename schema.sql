-- SJDC Database Schema & RLS Policies
-- Run this in Supabase SQL Editor to initialize/fix the database.

-- 1. Tables
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  course VARCHAR(50) NOT NULL,
  section VARCHAR(10) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS faculty (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  department VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(20) DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  course VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  status VARCHAR(10) NOT NULL CHECK (status IN ('Present', 'Absent')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, subject_id, date)
);

-- 2. Security (RLS)
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- 3. Cleanup Policies
DROP POLICY IF EXISTS "Public Read Subjects" ON subjects;
DROP POLICY IF EXISTS "Faculty can read all students" ON students;
DROP POLICY IF EXISTS "Students see own profile" ON students;
DROP POLICY IF EXISTS "Faculty can read all attendance" ON attendance;
DROP POLICY IF EXISTS "Faculty can insert attendance" ON attendance;
DROP POLICY IF EXISTS "Students see own attendance" ON attendance;
DROP POLICY IF EXISTS "Users view own faculty" ON faculty;
DROP POLICY IF EXISTS "Users view own admin" ON admins;
DROP POLICY IF EXISTS "Admins Full Access" ON students;
DROP POLICY IF EXISTS "Admins Full Access" ON faculty;
DROP POLICY IF EXISTS "Admins Full Access" ON subjects;
DROP POLICY IF EXISTS "Admins Full Access" ON attendance;

-- 4. New Policies
CREATE POLICY "Public Read Subjects" ON subjects FOR SELECT USING (true);

-- Resource Management (Syllabus, PYQs, Notes)
CREATE TYPE resource_category AS ENUM ('syllabus', 'pyq', 'notes', 'assignment');

CREATE TABLE IF NOT EXISTS resources (
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexing for fast resource lookups
CREATE INDEX IF NOT EXISTS idx_resources_subject_category ON resources(subject_id, category);
CREATE INDEX IF NOT EXISTS idx_resources_year ON resources(academic_year) WHERE category = 'pyq';

-- Enable RLS for Resources
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- Everyone authenticated can read
CREATE POLICY "Public Read Resources" 
ON resources FOR SELECT 
TO authenticated 
USING (true);

-- Faculty & Admins can modify resources
CREATE POLICY "Staff Manage Resources" 
ON resources FOR ALL 
TO authenticated 
USING (
  EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid()) OR
  EXISTS (SELECT 1 FROM faculty WHERE user_id = auth.uid())
);

-- Faculty Permissions
CREATE POLICY "Faculty can read all students" ON students FOR SELECT USING (EXISTS (SELECT 1 FROM faculty WHERE user_id = auth.uid()));
CREATE POLICY "Faculty can read all attendance" ON attendance FOR SELECT USING (EXISTS (SELECT 1 FROM faculty WHERE user_id = auth.uid()));
CREATE POLICY "Faculty can insert attendance" ON attendance FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM faculty WHERE user_id = auth.uid()));

-- Student Permissions
CREATE POLICY "Students see own profile" ON students FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Students see own attendance" ON attendance FOR SELECT USING (EXISTS (SELECT 1 FROM students WHERE id = attendance.student_id AND user_id = auth.uid()));

-- Profile Permissions
CREATE POLICY "Users view own faculty" ON faculty FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users view own admin" ON admins FOR SELECT USING (auth.uid() = user_id);

-- 1. Create Tables First
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) UNIQUE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    course TEXT NOT NULL,
    section TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.faculty (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) UNIQUE,
    name TEXT NOT NULL,
    department TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    course TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
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

-- 2. Enable RLS
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_content ENABLE ROW LEVEL SECURITY;

-- 3. Admin Access Policies (WITH CHECK for Inserts)
CREATE POLICY "Admin Full Access Students" ON students FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid()));
CREATE POLICY "Admin Full Access Faculty" ON faculty FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid()));
CREATE POLICY "Admin Full Access Subjects" ON subjects FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid()));
CREATE POLICY "Admin Full Access Attendance" ON attendance FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid()));
CREATE POLICY "Admin Manage CMS" ON website_content FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid()));

-- 4. Public Access Policies
CREATE POLICY "Public Read Active Content" ON website_content FOR SELECT USING (is_active = true);
