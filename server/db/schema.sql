-- ============================================================================
-- SCHOLARBRIDGE RELATIONAL POSTGRESQL DATABASE SCHEMA (STAGE 2.1)
-- Production DDL with integrity constraints, multi-scale checks, and strict audit protection
-- ============================================================================

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 2. Student Attendance History (Authoritative Source for Attendance)
-- Canonical period ordering is defined by period_start_date
CREATE TABLE IF NOT EXISTS student_attendance_history (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    period_start_date DATE NOT NULL, -- Canonical start date of the reporting period
    period_label VARCHAR(100) NOT NULL, -- Human-readable period, e.g. 'Oct 2026', 'Semester 1 - 2026'
    attendance_percentage NUMERIC(5,2) NOT NULL CHECK (attendance_percentage BETWEEN 0.00 AND 100.00),
    reported_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, period_start_date) -- Deduplication guarantee per period
);
CREATE INDEX IF NOT EXISTS idx_attendance_user_period ON student_attendance_history(user_id, period_start_date DESC);

-- 3. Student Profiles (Privacy-Preserving & Multi-Scale Scoring Support)
CREATE TABLE IF NOT EXISTS student_profiles (
    user_id VARCHAR(64) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    institution VARCHAR(255) NOT NULL,
    education_level VARCHAR(50) NOT NULL CHECK (education_level IN ('High School Senior', 'Undergraduate', 'Postgraduate', 'Doctoral')),
    field_of_study VARCHAR(255) NOT NULL,
    current_year VARCHAR(50) NOT NULL,
    grade_scale VARCHAR(20) NOT NULL DEFAULT '10.0_CGPA' CHECK (grade_scale IN ('4.0_GPA', '5.0_GPA', '10.0_CGPA', 'PERCENTAGE')),
    grade_value NUMERIC(5,2) NOT NULL DEFAULT 0.00,
    -- Financial Data: Indian Context (INR), optional / data-minimization, associated with financial year
    annual_household_income_inr NUMERIC(14,2) DEFAULT NULL,
    income_financial_year VARCHAR(20) DEFAULT NULL, -- e.g. 'FY 2025-26'
    location VARCHAR(100) NOT NULL DEFAULT 'National / All Regions',
    enrollment_status VARCHAR(50) NOT NULL DEFAULT 'Full-Time' CHECK (enrollment_status IN ('Full-Time', 'Part-Time')),
    first_generation_status VARCHAR(20) DEFAULT 'Unspecified' CHECK (first_generation_status IN ('Yes', 'No', 'Unspecified')),
    -- Self-reported document readiness flags (does not claim verified upload)
    transcript_ready BOOLEAN NOT NULL DEFAULT FALSE,
    income_cert_ready BOOLEAN NOT NULL DEFAULT FALSE,
    recommendation_ready BOOLEAN NOT NULL DEFAULT FALSE,
    portfolio_ready BOOLEAN NOT NULL DEFAULT FALSE,
    career_interests JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    -- Scale-specific grade validation check constraint
    CONSTRAINT chk_student_grade_range CHECK (
        (grade_scale = '4.0_GPA' AND grade_value >= 0.00 AND grade_value <= 4.00) OR
        (grade_scale = '5.0_GPA' AND grade_value >= 0.00 AND grade_value <= 5.00) OR
        (grade_scale = '10.0_CGPA' AND grade_value >= 0.00 AND grade_value <= 10.00) OR
        (grade_scale = 'PERCENTAGE' AND grade_value >= 0.00 AND grade_value <= 100.00)
    )
);

-- 4. Opportunities Table (With Seat Capacity, Configurable Attendance & Grade Scale Checks)
CREATE TABLE IF NOT EXISTS opportunities (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    is_demonstration_sample BOOLEAN NOT NULL DEFAULT FALSE,
    provider VARCHAR(255) NOT NULL,
    provider_type VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    education_levels JSONB NOT NULL DEFAULT '[]'::jsonb,
    location VARCHAR(100) NOT NULL DEFAULT 'National',
    benefits_summary TEXT NOT NULL,
    annual_value_inr NUMERIC(14,2) NOT NULL DEFAULT 0,
    coverage_details JSONB NOT NULL DEFAULT '[]'::jsonb,
    deadline DATE NOT NULL,
    verification_status VARCHAR(50) NOT NULL DEFAULT 'Pending Review' CHECK (verification_status IN ('Verified', 'Pending Review', 'Expired')),
    verified_date DATE,
    verified_by VARCHAR(255),
    official_source_url TEXT NOT NULL,
    description TEXT NOT NULL,
    required_documents JSONB NOT NULL DEFAULT '[]'::jsonb,
    views_count INTEGER NOT NULL DEFAULT 0,
    added_date DATE DEFAULT CURRENT_DATE,
    archived BOOLEAN NOT NULL DEFAULT FALSE,
    -- Configurable Criteria
    min_attendance_percentage NUMERIC(5,2) DEFAULT NULL CHECK (min_attendance_percentage BETWEEN 0.00 AND 100.00),
    required_grade_scale VARCHAR(20) NOT NULL DEFAULT '10.0_CGPA' CHECK (required_grade_scale IN ('4.0_GPA', '5.0_GPA', '10.0_CGPA', 'PERCENTAGE')),
    min_grade_value NUMERIC(5,2) NOT NULL DEFAULT 0.00,
    max_annual_income_inr NUMERIC(14,2) DEFAULT NULL,
    allowed_majors JSONB NOT NULL DEFAULT '["All"]'::jsonb,
    requires_first_gen BOOLEAN NOT NULL DEFAULT FALSE,
    requires_portfolio BOOLEAN NOT NULL DEFAULT FALSE,
    -- Seat Capacity
    total_seats INTEGER NOT NULL DEFAULT 1 CHECK (total_seats > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    -- Scale-specific minimum grade check constraint
    CONSTRAINT chk_opp_grade_range CHECK (
        (required_grade_scale = '4.0_GPA' AND min_grade_value >= 0.00 AND min_grade_value <= 4.00) OR
        (required_grade_scale = '5.0_GPA' AND min_grade_value >= 0.00 AND min_grade_value <= 5.00) OR
        (required_grade_scale = '10.0_CGPA' AND min_grade_value >= 0.00 AND min_grade_value <= 10.00) OR
        (required_grade_scale = 'PERCENTAGE' AND min_grade_value >= 0.00 AND min_grade_value <= 100.00)
    )
);
CREATE INDEX IF NOT EXISTS idx_opportunities_archived ON opportunities(archived);
CREATE INDEX IF NOT EXISTS idx_opportunities_verified ON opportunities(verification_status);

-- 5. Confirmed Seat Allocations (Strict Integrity: NO CASCADE DELETE)
CREATE TABLE IF NOT EXISTS opportunity_seat_allocations (
    id SERIAL PRIMARY KEY,
    opportunity_id VARCHAR(64) NOT NULL REFERENCES opportunities(id) ON DELETE RESTRICT,
    student_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    allocated_by VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    allocated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    UNIQUE (opportunity_id, student_id) -- Guaranteed one allocation per student per opportunity
);
CREATE INDEX IF NOT EXISTS idx_seat_alloc_opp ON opportunity_seat_allocations(opportunity_id);

-- 6. Applications Table (Submitted applications DO NOT occupy seats; NO CASCADE DELETE)
CREATE TABLE IF NOT EXISTS applications (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    opportunity_id VARCHAR(64) NOT NULL REFERENCES opportunities(id) ON DELETE RESTRICT,
    status VARCHAR(50) NOT NULL CHECK (status IN ('Not Started', 'Preparing Documents', 'Submitted', 'Under Review', 'Approved', 'Rejected')),
    submission_date DATE,
    last_updated DATE DEFAULT CURRENT_DATE,
    missing_documents JSONB DEFAULT '[]'::jsonb,
    completed_documents JSONB DEFAULT '[]'::jsonb,
    next_action TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, opportunity_id)
);
CREATE INDEX IF NOT EXISTS idx_applications_user ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_opp ON applications(opportunity_id);

-- 7. Saved Opportunities
CREATE TABLE IF NOT EXISTS saved_opportunities (
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    opportunity_id VARCHAR(64) NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, opportunity_id)
);

-- 8. Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('Deadline', 'Match', 'Verification', 'Application', 'Attendance', 'Allocation')),
    read BOOLEAN NOT NULL DEFAULT FALSE,
    related_opportunity_id VARCHAR(64) REFERENCES opportunities(id) ON DELETE SET NULL,
    target_page VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, read);

-- 9. Permanent Audit Logs (Preserved across user or opportunity deactivations)
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    admin_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    target_entity VARCHAR(50) NOT NULL,
    target_id VARCHAR(64) NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_audit_target ON audit_logs(target_entity, target_id);
