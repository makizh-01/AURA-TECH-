-- =====================================================================
-- AURA TECH - Complete Service Booking SQL Database Schema
-- Compatible with PostgreSQL / Supabase / MySQL / SQLite
-- =====================================================================

-- 1. Create Enums / Types (PostgreSQL / Supabase)
CREATE TYPE client_user_type AS ENUM ('Student', 'Expert / Business', 'Enterprise');
CREATE TYPE booking_status_type AS ENUM ('pending', 'under_review', 'approved', 'in_progress', 'completed', 'cancelled');

-- 2. Services Master Table (Reference list of all offered services)
CREATE TABLE IF NOT EXISTS services (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'Design' or 'Development'
    description TEXT,
    icon_name VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed Services Master Data
INSERT INTO services (id, title, category, description, icon_name) VALUES
('srv_web_design', 'Website Design', 'Design', 'Visual storytelling through modern, responsive web layouts.', 'Palette'),
('srv_web_dev', 'Website Development', 'Development', 'Robust and scalable web solutions tailored to business needs.', 'Globe'),
('srv_frontend', 'Frontend Development', 'Development', 'Crafting interactive and lightning-fast user interfaces.', 'Layout'),
('srv_backend', 'Backend Development', 'Development', 'High-performance server-side logic and database management.', 'Database'),
('srv_app_design', 'App Interface Design', 'Design', 'Modern, intuitive interfaces for mobile platforms.', 'Smartphone'),
('srv_flutter', 'Flutter Projects', 'Development', 'Multi-platform development using Google powerful SDK.', 'Layers'),
('srv_software', 'Software Development', 'Development', 'Custom enterprise-grade software built for efficiency.', 'Code'),
('srv_ui_ux', 'UI/UX Design', 'Design', 'User-centric design focused on accessibility and delight.', 'Sparkles'),
('srv_logo_design', 'Logo Design', 'Design', 'Iconic branding that captures your company unique aura.', 'Palette'),
('srv_video_edit', 'Video Editing', 'Design', 'Professional post-production for engaging visual content.', 'Video'),
('srv_data_viz', 'Data Visualization', 'Development', 'Transforming complex datasets into clear, actionable insights.', 'BarChart'),
('srv_ai_chatbot', 'AI Chatbot Development', 'Development', 'Intelligent automation powered by modern LLMs.', 'MessageSquare'),
('srv_ai_video', 'AI Video Editing', 'Design', 'Transforming raw footage into cinematic masterpieces using advanced AI enhancement.', 'Zap'),
('srv_iot', 'IoT Solutions & Projects', 'Development', 'Smart hardware integration, microcontrollers (ESP32/Arduino), sensor networks, and real-time IoT dashboard development.', 'Cpu')
ON CONFLICT (id) DO NOTHING;

-- 3. Service Bookings Table (Stores all client project submissions)
CREATE TABLE IF NOT EXISTS service_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name VARCHAR(150) NOT NULL,
    client_email VARCHAR(255) NOT NULL,
    client_phone VARCHAR(50) NOT NULL,
    client_type VARCHAR(50) NOT NULL DEFAULT 'Student', -- 'Student', 'Expert / Business'
    project_title VARCHAR(200) NOT NULL,
    project_type VARCHAR(100) NOT NULL, -- 'Website', 'AI Chatbot', 'Logo', etc.
    service_id VARCHAR(50) REFERENCES services(id) ON DELETE SET NULL,
    description TEXT,
    budget_range VARCHAR(50),
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'under_review', 'approved', 'in_progress', 'completed'
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for lightning fast querying & search
CREATE INDEX IF NOT EXISTS idx_bookings_email ON service_bookings(client_email);
CREATE INDEX IF NOT EXISTS idx_bookings_type ON service_bookings(client_type);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON service_bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created ON service_bookings(created_at DESC);

-- Trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_service_bookings_modtime
BEFORE UPDATE ON service_bookings
FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();

-- Sample View for Analytics & Reporting
CREATE OR REPLACE VIEW v_booking_summary AS
SELECT 
    client_type,
    project_type,
    status,
    COUNT(*) as total_bookings,
    MIN(created_at) as earliest_booking,
    MAX(created_at) as latest_booking
FROM service_bookings
GROUP BY client_type, project_type, status;

-- 4. HR Service & Job Applications Table
-- Stores all job seeker and talent applications
CREATE TABLE IF NOT EXISTS hr_job_applications (
    id VARCHAR(50) PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    age INTEGER NOT NULL,
    role_applied VARCHAR(100) NOT NULL,
    portfolio_url TEXT,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    skills TEXT NOT NULL,
    resume_file_name VARCHAR(255),
    resume_file_data TEXT, -- Base64 encoded document or storage bucket link
    resume_file_size VARCHAR(50),
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'under_review', 'shortlisted', 'interview_scheduled', 'hired', 'rejected'
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for HR Queries
CREATE INDEX IF NOT EXISTS idx_hr_email ON hr_job_applications(email);
CREATE INDEX IF NOT EXISTS idx_hr_role ON hr_job_applications(role_applied);
CREATE INDEX IF NOT EXISTS idx_hr_status ON hr_job_applications(status);
CREATE INDEX IF NOT EXISTS idx_hr_created ON hr_job_applications(created_at DESC);

-- Trigger for HR table updated_at
CREATE TRIGGER update_hr_applications_modtime
BEFORE UPDATE ON hr_job_applications
FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();

