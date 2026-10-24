-- =====================================================================
-- AURA TECH - MySQL / MariaDB Service Booking Database Schema
-- =====================================================================

CREATE DATABASE IF NOT EXISTS aura_tech_db;
USE aura_tech_db;

-- Services Table
CREATE TABLE IF NOT EXISTS services (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    icon_name VARCHAR(50),
    is_active TINYINT(1) DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Service Bookings Table
CREATE TABLE IF NOT EXISTS service_bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_name VARCHAR(150) NOT NULL,
    client_email VARCHAR(255) NOT NULL,
    client_phone VARCHAR(50) NOT NULL,
    client_type VARCHAR(50) NOT NULL DEFAULT 'Student',
    project_title VARCHAR(200) NOT NULL,
    project_type VARCHAR(100) NOT NULL,
    service_id VARCHAR(50),
    description TEXT,
    budget_range VARCHAR(50),
    status ENUM('pending', 'under_review', 'approved', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
    admin_notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL
);

-- Indexes
CREATE INDEX idx_bookings_email ON service_bookings(client_email);
CREATE INDEX idx_bookings_status ON service_bookings(status);

-- HR Job Applications Table
CREATE TABLE IF NOT EXISTS hr_job_applications (
    id VARCHAR(50) PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    age INT NOT NULL,
    role_applied VARCHAR(100) NOT NULL,
    portfolio_url VARCHAR(500),
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    skills TEXT NOT NULL,
    resume_file_name VARCHAR(255),
    resume_file_data LONGTEXT,
    resume_file_size VARCHAR(50),
    status ENUM('pending', 'under_review', 'shortlisted', 'interview_scheduled', 'hired', 'rejected') DEFAULT 'pending',
    admin_notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_hr_email ON hr_job_applications(email);
CREATE INDEX idx_hr_role ON hr_job_applications(role_applied);
CREATE INDEX idx_hr_status ON hr_job_applications(status);

