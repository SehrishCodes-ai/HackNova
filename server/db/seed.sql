-- ============================================================================
-- SCHOLARBRIDGE DEMONSTRATION SEED DATA (STAGE 2.1)
-- All demonstration records are strictly flagged with is_demonstration_sample = TRUE
-- Real platform queries filter out demonstration data from genuine verified metrics
-- ============================================================================

-- 1. Demo Student User Account (Password: "StudentDemo@2026")
-- Bcrypt hash with 10 salt rounds:
INSERT INTO users (id, email, password_hash, role)
VALUES (
    'usr-demo-student-1',
    'aarav.mehta@university.edu.sample',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'student'
)
ON CONFLICT (id) DO NOTHING;

-- 2. Demo Student Profile (Indian Context: 10.0 CGPA scale, INR income, readiness checklist)
INSERT INTO student_profiles (
    user_id,
    full_name,
    institution,
    education_level,
    field_of_study,
    current_year,
    grade_scale,
    grade_value,
    annual_household_income_inr,
    income_financial_year,
    location,
    enrollment_status,
    first_generation_status,
    transcript_ready,
    income_cert_ready,
    recommendation_ready,
    portfolio_ready,
    career_interests
)
VALUES (
    'usr-demo-student-1',
    'Aarav Mehta (Demo Student)',
    'Metropolitan Institute of Technology (Sample)',
    'Undergraduate',
    'Computer Science & Engineering',
    '3rd Year (Junior)',
    '10.0_CGPA',
    8.75,
    450000.00,
    'FY 2025-26',
    'National / All Regions',
    'Full-Time',
    'Unspecified',
    TRUE,
    TRUE,
    TRUE,
    FALSE,
    '["Systems Engineering", "Public Interest Technology", "Applied AI Research"]'::jsonb
)
ON CONFLICT (user_id) DO NOTHING;

-- 3. Demo Attendance History (Canonical period_start_date for deterministic latest ordering)
INSERT INTO student_attendance_history (
    user_id,
    period_start_date,
    period_label,
    attendance_percentage
)
VALUES 
    ('usr-demo-student-1', '2026-08-01', 'Aug 2026', 82.50),
    ('usr-demo-student-1', '2026-09-01', 'Sep 2026', 86.00),
    ('usr-demo-student-1', '2026-10-01', 'Oct 2026', 89.20)
ON CONFLICT (user_id, period_start_date) DO NOTHING;

-- 4. Demonstration Opportunities (Clearly labeled, with Seat Capacity and Minimum Attendance)
INSERT INTO opportunities (
    id,
    title,
    is_demonstration_sample,
    provider,
    provider_type,
    category,
    education_levels,
    location,
    benefits_summary,
    annual_value_inr,
    coverage_details,
    deadline,
    verification_status,
    verified_date,
    verified_by,
    official_source_url,
    description,
    required_documents,
    views_count,
    min_attendance_percentage,
    required_grade_scale,
    min_grade_value,
    max_annual_income_inr,
    allowed_majors,
    requires_first_gen,
    requires_portfolio,
    total_seats
)
VALUES 
(
    'opp-demo-101',
    'Horizon STEM Academic Excellence Fellowship (Demonstration Sample)',
    TRUE,
    'Horizon Education Foundation (Sample Provider)',
    'Foundation',
    'Merit Scholarship',
    '["Undergraduate"]'::jsonb,
    'National',
    '₹7,50,000 / year tuition support + research symposium travel grant',
    750000.00,
    '["₹6,50,000 direct tuition disbursement applied to institution", "₹1,000,00 research equipment allowance", "Mentorship pairing and annual symposium sponsorship"]'::jsonb,
    '2026-11-20',
    'Verified',
    '2026-10-24',
    'ScholarBridge Verification Desk · Audit #SB-904',
    'https://sample-registry.scholarbridge.example.org/horizon-stem-2026',
    'An illustrative demonstration merit fellowship designed to support full-time undergraduate students pursuing degrees in Computer Science, Engineering, Mathematics, or Physical Sciences who demonstrate strong academic standing and community academic leadership.',
    '["Official University Transcript (Cumulative CGPA >= 7.50)", "Academic Faculty Reference Letter", "Enrollment Verification Certificate", "500-Word Academic Purpose Statement"]'::jsonb,
    2840,
    75.00,
    '10.0_CGPA',
    7.50,
    800000.00,
    '["Computer Science & Engineering", "Data Science", "Electrical Engineering", "Mathematics"]'::jsonb,
    FALSE,
    FALSE,
    25
),
(
    'opp-demo-102',
    'BridgeAccess Tuition & Fee Relief Grant (Demonstration Sample)',
    TRUE,
    'Higher Education Equity Trust (Sample Provider)',
    'University Trust',
    'Fee Assistance',
    '["Undergraduate", "High School Senior"]'::jsonb,
    'National',
    'Up to ₹4,20,000 semester fee waiver + institutional dining allowance',
    420000.00,
    '["100% coverage of mandatory institutional semester laboratory and examination fees", "Direct tuition fee offset applied via university bursar", "Campus accommodation assistance"]'::jsonb,
    '2026-11-15',
    'Verified',
    '2026-10-27',
    'ScholarBridge Verification Desk · Audit #SB-918',
    'https://sample-registry.scholarbridge.example.org/bridge-access-grant',
    'An illustrative demonstration need-based fee assistance grant supporting undergraduate students from low- and moderate-income households to eliminate registration barriers.',
    '["Verified Household Income Certificate", "Official University Transcript", "Current Semester Fee Schedule from Bursar"]'::jsonb,
    3410,
    70.00,
    '10.0_CGPA',
    6.00,
    500000.00,
    '["All"]'::jsonb,
    FALSE,
    FALSE,
    40
),
(
    'opp-demo-103',
    'Pinnacle Doctoral & Post-Graduate Research Fellowship (Demonstration Sample)',
    TRUE,
    'National Science & Advanced Studies Consortium (Sample Provider)',
    'Industry Consortium',
    'Institutional Fellowship',
    '["Postgraduate", "Doctoral"]'::jsonb,
    'National',
    '₹9,60,000 / year stipend + high-performance computing grant',
    960000.00,
    '["Monthly research living stipend of ₹80,000", "Access to national computational infrastructure and laboratory facilities", "Annual international conference travel grant"]'::jsonb,
    '2026-12-05',
    'Verified',
    '2026-10-20',
    'ScholarBridge Verification Desk · Audit #SB-892',
    'https://sample-registry.scholarbridge.example.org/pinnacle-research-2026',
    'An illustrative demonstration fellowship for post-graduate and doctoral scholars conducting high-impact research in advanced systems, material sciences, or biological engineering.',
    '["Curriculum Vitae with Publications List", "Detailed Research Proposal (Max 5 Pages)", "Two Principal Investigator Recommendation Letters", "Verified Master''s Degree Transcript"]'::jsonb,
    1890,
    80.00,
    '10.0_CGPA',
    8.00,
    NULL,
    '["Computer Science & Engineering", "Data Science", "Electronics & Communication", "Applied Physics"]'::jsonb,
    FALSE,
    TRUE,
    15
)
ON CONFLICT (id) DO NOTHING;

-- 5. Demonstration Saved Opportunity for Demo Student
INSERT INTO saved_opportunities (user_id, opportunity_id)
VALUES ('usr-demo-student-1', 'opp-demo-101')
ON CONFLICT (user_id, opportunity_id) DO NOTHING;

-- 6. Demonstration Application for Demo Student (Decoupled from seats: Status 'Preparing Documents')
INSERT INTO applications (
    id,
    user_id,
    opportunity_id,
    status,
    submission_date,
    last_updated,
    missing_documents,
    completed_documents,
    next_action,
    notes
)
VALUES (
    'app-demo-001',
    'usr-demo-student-1',
    'opp-demo-101',
    'Preparing Documents',
    NULL,
    CURRENT_DATE,
    '["Academic Faculty Reference Letter", "500-Word Academic Purpose Statement"]'::jsonb,
    '["Official University Transcript (Cumulative CGPA >= 7.50)", "Enrollment Verification Certificate"]'::jsonb,
    'Request reference letter from department faculty mentor before deadline',
    'Demonstration application record for workflow testing'
)
ON CONFLICT (id) DO NOTHING;

-- 7. System Demo Anchor Account for Audit Trail (NON-LOGINABLE)
-- password_hash is deliberately set to an invalid non-bcrypt string (!DISABLED!...)
-- This guarantees this demo anchor can NEVER authenticate or log in.
-- Real administrator accounts must be provisioned via server/scripts/createAdmin.js
INSERT INTO users (id, email, password_hash, role)
VALUES (
    'usr-demo-admin-seed',
    'admin.desk@scholarbridge.internal.sample',
    '!DISABLED_DEMO_ACCOUNT_NON_LOGINABLE!',
    'admin'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, email, password_hash, role)
VALUES (
    'usr-demo-student-2',
    'priya.sharma@university.edu.sample',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'student'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO opportunity_seat_allocations (
    opportunity_id,
    student_id,
    allocated_by,
    notes
)
VALUES (
    'opp-demo-101',
    'usr-demo-student-2',
    'usr-demo-admin-seed',
    'Demonstration confirmed seat allocation for Priya Sharma (Audit verified)'
)
ON CONFLICT (opportunity_id, student_id) DO NOTHING;
