/**
 * Deterministic Rule-Based Opportunity Matching Engine
 * Compares student profile and attendance records with opportunity criteria.
 * Never invents match percentages or performs unverified scale conversions.
 */

export function evaluateOpportunityEligibility(opportunity, profile, latestAttendance) {
  const criteria = [];

  // 1. Education Level
  const eduLevels = Array.isArray(opportunity.education_levels) 
    ? opportunity.education_levels 
    : (typeof opportunity.education_levels === 'string' ? JSON.parse(opportunity.education_levels) : []);
  
  const eduMatches = eduLevels.includes(profile.education_level);
  criteria.push({
    id: `${opportunity.id}-edu`,
    label: 'Required Academic Standing & Level',
    requirementText: `Required: ${eduLevels.join(' or ')}`,
    studentValueText: `Your Profile: ${profile.education_level} (${profile.current_year})`,
    status: eduMatches ? 'Satisfied' : 'Not satisfied',
  });

  // 2. Academic Performance & Grade Scale Check
  const oppScale = opportunity.required_grade_scale || '10.0_CGPA';
  const studentScale = profile.grade_scale || '10.0_CGPA';
  const oppMinGrade = parseFloat(opportunity.min_grade_value || 0);
  const studentGrade = parseFloat(profile.grade_value || 0);

  if (oppScale === studentScale) {
    const meetsGrade = studentGrade >= oppMinGrade;
    criteria.push({
      id: `${opportunity.id}-grade`,
      label: `Minimum Academic Standing (${oppScale})`,
      requirementText: `Required: ≥ ${oppMinGrade.toFixed(2)} (${oppScale})`,
      studentValueText: `Your Profile: ${studentGrade.toFixed(2)} (${studentScale})${
        profile.transcript_ready ? ' · Transcript verification ready' : ' · Transcript pending verification'
      }`,
      status: !meetsGrade
        ? 'Not satisfied'
        : profile.transcript_ready
        ? 'Satisfied'
        : 'Needs clarification',
    });
  } else {
    // Incompatible scales: Do NOT blindly convert; require formal institutional evaluation
    criteria.push({
      id: `${opportunity.id}-grade`,
      label: `Minimum Academic Standing (Scale Mismatch)`,
      requirementText: `Required: ≥ ${oppMinGrade.toFixed(2)} (${oppScale})`,
      studentValueText: `Your Profile: ${studentGrade.toFixed(2)} (${studentScale}) · Institutional scale conversion required`,
      status: 'Needs clarification',
    });
  }

  // 3. Field of Study / Allowed Majors
  const allowedMajors = Array.isArray(opportunity.allowed_majors)
    ? opportunity.allowed_majors
    : (typeof opportunity.allowed_majors === 'string' ? JSON.parse(opportunity.allowed_majors) : ['All']);

  const majorMatches = allowedMajors.includes('All') || allowedMajors.some((m) =>
    profile.field_of_study && (
      profile.field_of_study.toLowerCase().includes(m.toLowerCase()) ||
      m.toLowerCase().includes(profile.field_of_study.toLowerCase())
    )
  );

  criteria.push({
    id: `${opportunity.id}-major`,
    label: 'Eligible Field of Study',
    requirementText: allowedMajors.includes('All')
      ? 'Open to all accredited disciplines'
      : `Eligible disciplines: ${allowedMajors.join(', ')}`,
    studentValueText: `Your Profile: ${profile.field_of_study}`,
    status: majorMatches ? 'Satisfied' : 'Not satisfied',
  });

  // 4. Minimum Attendance Percentage (Mentor Requirement)
  if (opportunity.min_attendance_percentage !== null && opportunity.min_attendance_percentage !== undefined) {
    const reqAttendance = parseFloat(opportunity.min_attendance_percentage);
    const studentAttendance = latestAttendance ? parseFloat(latestAttendance.attendance_percentage) : null;

    if (studentAttendance !== null && !isNaN(studentAttendance)) {
      const meetsAttendance = studentAttendance >= reqAttendance;
      criteria.push({
        id: `${opportunity.id}-attendance`,
        label: 'Minimum Course Attendance',
        requirementText: `Required: ≥ ${reqAttendance.toFixed(1)}% verified/reported attendance`,
        studentValueText: `Your Profile: ${studentAttendance.toFixed(1)}% (Self-reported for ${latestAttendance.period_label || 'latest period'})`,
        status: meetsAttendance ? 'Satisfied' : 'Not satisfied',
      });
    } else {
      criteria.push({
        id: `${opportunity.id}-attendance`,
        label: 'Minimum Course Attendance',
        requirementText: `Required: ≥ ${reqAttendance.toFixed(1)}% attendance`,
        studentValueText: 'Your Profile: No attendance records reported yet in Attendance Tracker',
        status: 'Needs clarification',
      });
    }
  }

  // 5. Annual Household Income Threshold (INR)
  if (opportunity.max_annual_income_inr !== null && opportunity.max_annual_income_inr !== undefined) {
    const maxIncome = parseFloat(opportunity.max_annual_income_inr);
    const studentIncome = profile.annual_household_income_inr !== null ? parseFloat(profile.annual_household_income_inr) : null;

    if (studentIncome !== null && !isNaN(studentIncome)) {
      const meetsIncome = studentIncome <= maxIncome;
      criteria.push({
        id: `${opportunity.id}-income`,
        label: 'Annual Household Income Ceiling (INR)',
        requirementText: `Maximum eligible income: ₹${maxIncome.toLocaleString('en-IN')} / year`,
        studentValueText: `Your Profile: ₹${studentIncome.toLocaleString('en-IN')} (${profile.income_financial_year || 'Latest FY'})${
          profile.income_cert_ready ? ' · Certificate ready' : ' · Self-reported, certificate pending'
        }`,
        status: !meetsIncome
          ? 'Not satisfied'
          : profile.income_cert_ready
          ? 'Satisfied'
          : 'Needs clarification',
      });
    } else {
      criteria.push({
        id: `${opportunity.id}-income`,
        label: 'Annual Household Income Ceiling (INR)',
        requirementText: `Maximum eligible income: ₹${maxIncome.toLocaleString('en-IN')} / year`,
        studentValueText: 'Your Profile: Financial eligibility information not yet reported',
        status: 'Needs clarification',
      });
    }
  }

  // 6. Enrollment Status
  criteria.push({
    id: `${opportunity.id}-enrollment`,
    label: 'Enrollment Status',
    requirementText: 'Required: Full-Time Accredited Enrollment',
    studentValueText: `Your Profile: ${profile.enrollment_status}`,
    status: profile.enrollment_status === 'Full-Time' ? 'Satisfied' : 'Not satisfied',
  });

  // 7. Portfolio / Research Statement
  if (opportunity.requires_portfolio) {
    criteria.push({
      id: `${opportunity.id}-portfolio`,
      label: 'Research Statement / Technical Portfolio',
      requirementText: 'Required: Academic Research Methodology or Portfolio submission',
      studentValueText: profile.portfolio_ready
        ? 'Your Profile: Research statement marked ready in Document Vault'
        : 'Your Profile: Statement not yet prepared',
      status: profile.portfolio_ready ? 'Satisfied' : 'Needs clarification',
    });
  }

  // 8. First-Generation University Entrant
  if (opportunity.requires_first_gen) {
    const isFirstGen = profile.first_generation_status === 'Yes';
    const isNotFirstGen = profile.first_generation_status === 'No';
    criteria.push({
      id: `${opportunity.id}-firstgen`,
      label: 'First-Generation Undergraduate Status',
      requirementText: 'Required: Confirmed First-Generation entrant status',
      studentValueText: isFirstGen
        ? 'Your Profile: Confirmed First-Generation Student'
        : isNotFirstGen
        ? 'Your Profile: Not a First-Generation Student'
        : 'Your Profile: Status Unspecified',
      status: isFirstGen ? 'Satisfied' : isNotFirstGen ? 'Not satisfied' : 'Needs clarification',
    });
  }

  const hasNotSatisfied = criteria.some((c) => c.status === 'Not satisfied');
  const hasClarification = criteria.some((c) => c.status === 'Needs clarification');

  let category = 'MATCHED';
  let summaryReason = 'All published academic, enrollment, and attendance criteria are satisfied.';

  if (hasNotSatisfied) {
    category = 'INELIGIBLE';
    const failedLabels = criteria
      .filter((c) => c.status === 'Not satisfied')
      .map((c) => c.label)
      .join(' and ');
    summaryReason = `Does not meet published requirements for: ${failedLabels}.`;
  } else if (hasClarification) {
    category = 'POSSIBLY_MATCHED';
    const pendingLabels = criteria
      .filter((c) => c.status === 'Needs clarification')
      .map((c) => c.label)
      .join(' and ');
    summaryReason = `Core criteria match; verification needed for: ${pendingLabels}.`;
  }

  return {
    category,
    summaryReason,
    criteria,
  };
}
