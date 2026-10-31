import {
  Opportunity,
  StudentProfileData,
  ApplicationRecord,
  NotificationItem,
  EvaluatedCriterion,
  MatchCategory,
} from '../types';

export const INITIAL_STUDENT_PROFILE: StudentProfileData = {
  fullName: 'Aarav Mehta',
  email: 'aarav.mehta@university.edu.sample',
  institution: 'Metropolitan Institute of Technology (Sample)',
  educationLevel: 'Undergraduate',
  fieldOfStudy: 'Computer Science & Engineering',
  currentYear: '3rd Year (Junior)',
  gpa: 3.78,
  gpaScale: 4.0,
  annualHouseholdIncome: 34000,
  location: 'National / All Regions',
  enrollmentStatus: 'Full-Time',
  firstGenerationStudent: 'Unverified',
  researchStatementUploaded: false,
  incomeCertificateUploaded: true,
  transcriptUploaded: true,
  recommendationLetterUploaded: true,
  careerInterests: ['Systems Engineering', 'Public Interest Technology', 'Applied AI Research'],
};

export const INITIAL_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-101',
    title: 'Horizon STEM Academic Excellence Fellowship (Illustrative Sample)',
    isIllustrativeSample: true,
    provider: 'Horizon Education Foundation (Sample Provider)',
    providerType: 'Foundation',
    category: 'Merit Scholarship',
    educationLevels: ['Undergraduate'],
    location: 'National',
    benefitsSummary: '$8,500 / year tuition grant + annual research symposium stipend',
    annualValueNumeric: 8500,
    coverageDetails: [
      '$7,500 direct academic tuition disbursement per academic year',
      '$1,000 textbook, laboratory equipment, and computing allowance',
      'Faculty mentorship pairing and annual undergraduate symposium travel grant',
    ],
    deadline: '2026-11-18',
    daysRemaining: 19,
    verificationStatus: 'Verified',
    verifiedDate: '2026-10-24',
    verifiedBy: 'ScholarBridge Verification Desk · Audit #SB-904',
    officialSourceUrl: 'https://sample-registry.scholarbridge.example.org/horizon-stem-2026',
    description:
      'An illustrative sample merit fellowship designed to support full-time undergraduate students pursuing degrees in Computer Science, Engineering, Mathematics, or Physical Sciences who demonstrate strong academic standing and community academic leadership.',
    requiredDocuments: [
      'Official University Transcript (Cumulative GPA ≥ 3.50)',
      'Academic Faculty Reference Letter',
      'Enrollment Verification Certificate',
      '500-Word Academic Purpose Statement',
    ],
    viewsCount: 2840,
    savesCount: 612,
    applicationsCount: 198,
    addedDate: '2026-10-05',
    minGpa: 3.5,
    maxHouseholdIncome: 75000,
    allowedMajors: ['Computer Science & Engineering', 'Data Science', 'Electrical Engineering', 'Mathematics'],
  },
  {
    id: 'opp-102',
    title: 'BridgeAccess Tuition & Fee Relief Grant (Illustrative Sample)',
    isIllustrativeSample: true,
    provider: 'Higher Education Equity Trust (Sample Provider)',
    providerType: 'University Trust',
    category: 'Fee Assistance',
    educationLevels: ['Undergraduate', 'High School Senior'],
    location: 'National',
    benefitsSummary: 'Up to $5,200 semester fee waiver + institutional dining & housing subsidy',
    annualValueNumeric: 5200,
    coverageDetails: [
      '100% coverage of mandatory institutional semester laboratory and examination fees',
      '$3,800 direct tuition balance reduction applied via university bursar',
      '$1,400 campus accommodation and academic material credit',
    ],
    deadline: '2026-11-12',
    daysRemaining: 13,
    verificationStatus: 'Verified',
    verifiedDate: '2026-10-27',
    verifiedBy: 'ScholarBridge Verification Desk · Audit #SB-918',
    officialSourceUrl: 'https://sample-registry.scholarbridge.example.org/bridge-access-grant',
    description:
      'An illustrative sample need-based fee assistance grant supporting undergraduate students from low- and moderate-income households to eliminate semester registration barriers and prevent financial drop-out.',
    requiredDocuments: [
      'Verified Household Income Certificate',
      'Official University Transcript',
      'Current Semester Fee Schedule from Bursar',
    ],
    viewsCount: 3410,
    savesCount: 845,
    applicationsCount: 312,
    addedDate: '2026-10-10',
    minGpa: 3.0,
    maxHouseholdIncome: 48000,
    allowedMajors: ['All'],
  },
  {
    id: 'opp-103',
    title: 'Civic Systems & Public Data Summer Research Internship (Illustrative Sample)',
    isIllustrativeSample: true,
    provider: 'Center for Digital Civic Infrastructure (Sample Consortium)',
    providerType: 'Industry Consortium',
    category: 'Research Internship',
    educationLevels: ['Undergraduate', 'Postgraduate'],
    location: 'Hybrid / National',
    benefitsSummary: '$6,000 paid 10-week research stipend + computing cloud credits',
    annualValueNumeric: 6000,
    coverageDetails: [
      '$6,000 structured stipend paid across 10 weeks of summer research',
      'Dedicated co-authorship opportunity on open-source public infrastructure reports',
      '$750 workstation and cloud compute credit allocation',
    ],
    deadline: '2026-12-04',
    daysRemaining: 35,
    verificationStatus: 'Verified',
    verifiedDate: '2026-10-28',
    verifiedBy: 'ScholarBridge Verification Desk · Audit #SB-923',
    officialSourceUrl: 'https://sample-registry.scholarbridge.example.org/civic-systems-internship',
    description:
      'An illustrative sample research internship placing quantitative and computing students alongside public policy researchers to build open civic datasets and accessibility tools.',
    requiredDocuments: [
      'Official University Transcript',
      'Research Methodology Statement or Technical Portfolio',
      'Faculty Advisor Endorsement',
    ],
    viewsCount: 1920,
    savesCount: 478,
    applicationsCount: 134,
    addedDate: '2026-10-14',
    minGpa: 3.4,
    allowedMajors: ['Computer Science & Engineering', 'Data Science', 'Public Policy', 'Economics'],
    requiresPortfolioOrResearchStatement: true,
  },
  {
    id: 'opp-104',
    title: 'First-Step Pioneer Undergraduate Bursary (Illustrative Sample)',
    isIllustrativeSample: true,
    provider: 'National Academic Mobility Initiative (Sample Directorate)',
    providerType: 'Public Directorate',
    category: 'Need-Based Grant',
    educationLevels: ['Undergraduate'],
    location: 'National',
    benefitsSummary: '$4,800 annual renewable grant for first-generation university entrants',
    annualValueNumeric: 4800,
    coverageDetails: [
      '$4,800 annual grant renewable for up to 4 years of undergraduate study',
      'Access to peer academic transition workshops and career placement coaching',
      'Emergency micro-grant eligibility up to $600 for unforeseen academic expenses',
    ],
    deadline: '2026-11-28',
    daysRemaining: 29,
    verificationStatus: 'Verified',
    verifiedDate: '2026-10-22',
    verifiedBy: 'ScholarBridge Verification Desk · Audit #SB-899',
    officialSourceUrl: 'https://sample-registry.scholarbridge.example.org/first-step-pioneer',
    description:
      'An illustrative sample renewable bursary specifically structured for students who are the first in their immediate family to attend a four-year degree institution.',
    requiredDocuments: [
      'First-Generation Self-Declaration & Institutional Attestation',
      'Verified Household Income Certificate',
      'Official University Transcript',
    ],
    viewsCount: 2150,
    savesCount: 530,
    applicationsCount: 176,
    addedDate: '2026-10-18',
    minGpa: 3.2,
    maxHouseholdIncome: 55000,
    allowedMajors: ['All'],
    requiresFirstGenVerification: true,
  },
  {
    id: 'opp-105',
    title: 'NextGen Clean Energy & Grid Systems Fellowship (Illustrative Sample)',
    isIllustrativeSample: true,
    provider: 'Sustainable Power Systems Alliance (Sample Provider)',
    providerType: 'Industry Consortium',
    category: 'Institutional Fellowship',
    educationLevels: ['Undergraduate', 'Postgraduate'],
    location: 'National',
    benefitsSummary: '$9,000 academic award + summer field lab placement',
    annualValueNumeric: 9000,
    coverageDetails: [
      '$9,000 merit and research award disbursed in two equal semester installments',
      'Guaranteed 6-week summer laboratory rotation at a partner clean energy testbed',
    ],
    deadline: '2026-12-15',
    daysRemaining: 46,
    verificationStatus: 'Verified',
    verifiedDate: '2026-10-29',
    verifiedBy: 'ScholarBridge Verification Desk · Audit #SB-931',
    officialSourceUrl: 'https://sample-registry.scholarbridge.example.org/clean-energy-fellowship',
    description:
      'An illustrative sample institutional fellowship supporting students developing computational or hardware solutions for renewable grid resilience and energy storage.',
    requiredDocuments: [
      'Official University Transcript (Cumulative GPA ≥ 3.60)',
      'Academic Faculty Reference Letter',
      'Verified Household Income Certificate',
    ],
    viewsCount: 1640,
    savesCount: 390,
    applicationsCount: 92,
    addedDate: '2026-10-25',
    minGpa: 3.6,
    maxHouseholdIncome: 65000,
    allowedMajors: ['Computer Science & Engineering', 'Electrical Engineering', 'Mechanical Engineering'],
  },
  {
    id: 'opp-106',
    title: 'Advanced Doctoral Biomedical Sciences Endowment (Illustrative Sample)',
    isIllustrativeSample: true,
    provider: 'Vanguard Life Sciences Trust (Sample Provider)',
    providerType: 'Foundation',
    category: 'Institutional Fellowship',
    educationLevels: ['Doctoral', 'Postgraduate'],
    location: 'National',
    benefitsSummary: '$18,000 doctoral dissertation grant + laboratory consumables fund',
    annualValueNumeric: 18000,
    coverageDetails: [
      '$15,000 doctoral researcher stipend',
      '$3,000 clinical or wet-lab reagent and conference publication allowance',
    ],
    deadline: '2026-12-20',
    daysRemaining: 51,
    verificationStatus: 'Verified',
    verifiedDate: '2026-10-21',
    verifiedBy: 'ScholarBridge Verification Desk · Audit #SB-887',
    officialSourceUrl: 'https://sample-registry.scholarbridge.example.org/doctoral-biomedical-endowment',
    description:
      'An illustrative sample doctoral endowment exclusively for postgraduate and PhD candidates conducting translational research in Biochemistry, Molecular Biology, or Clinical Pharmacology.',
    requiredDocuments: [
      'Graduate Transcript (GPA ≥ 3.70)',
      'Doctoral Thesis Committee Endorsement',
      'IRB / Laboratory Research Protocol Summary',
    ],
    viewsCount: 1120,
    savesCount: 215,
    applicationsCount: 48,
    addedDate: '2026-10-12',
    minGpa: 3.7,
    allowedMajors: ['Biomedical Sciences', 'Molecular Biology', 'Pharmacology'],
  },
  {
    id: 'opp-107',
    title: 'Regional Rural Transit & Accommodation Support Fund (Illustrative Sample)',
    isIllustrativeSample: true,
    provider: 'State Higher Education Welfare Board (Sample Directorate)',
    providerType: 'Public Directorate',
    category: 'Fee Assistance',
    educationLevels: ['Undergraduate'],
    location: 'Regional Rural Districts Only',
    benefitsSummary: '$2,400 annual hostel & inter-district transport reimbursement',
    annualValueNumeric: 2400,
    coverageDetails: [
      '$1,800 university hostel boarding subsidy',
      '$600 annual inter-district rail and bus transit pass reimbursement',
    ],
    deadline: '2026-11-09',
    daysRemaining: 10,
    verificationStatus: 'Pending Review',
    verifiedDate: 'Pending verification',
    verifiedBy: 'Awaiting primary source circular confirmation',
    officialSourceUrl: 'https://sample-registry.scholarbridge.example.org/rural-transit-fund-2026',
    description:
      'An illustrative sample fee and accommodation support fund for students whose permanent domicile is in designated rural blocks and whose annual family income is below $22,000.',
    requiredDocuments: [
      'Rural Domicile Certificate',
      'Household Income Certificate (< $22,000)',
      'Hostel Warden Bonafide Letter',
    ],
    viewsCount: 980,
    savesCount: 184,
    applicationsCount: 63,
    addedDate: '2026-10-28',
    minGpa: 2.8,
    maxHouseholdIncome: 22000,
    allowedMajors: ['All'],
  },
  {
    id: 'opp-108',
    title: 'Spring 2026 Undergraduate Book & Digital Access Grant (Illustrative Sample)',
    isIllustrativeSample: true,
    provider: 'Collegiate Open Learning Trust (Sample Provider)',
    providerType: 'University Trust',
    category: 'Need-Based Grant',
    educationLevels: ['Undergraduate'],
    location: 'National',
    benefitsSummary: '$1,200 direct grant for textbooks, software licenses & broadband',
    annualValueNumeric: 1200,
    coverageDetails: [
      '$800 academic bookstore and digital reference voucher',
      '$400 annual student broadband connectivity reimbursement',
    ],
    deadline: '2026-09-30',
    daysRemaining: -30,
    verificationStatus: 'Expired',
    verifiedDate: '2026-04-15',
    verifiedBy: 'ScholarBridge Verification Desk · Cycle Closed',
    officialSourceUrl: 'https://sample-registry.scholarbridge.example.org/spring-digital-grant-2026',
    description:
      'An illustrative sample micro-grant from the previous academic cycle covering essential digital learning tools and textbook costs.',
    requiredDocuments: ['Official University Transcript', 'Enrollment Verification Certificate'],
    viewsCount: 4120,
    savesCount: 920,
    applicationsCount: 640,
    addedDate: '2026-04-10',
    minGpa: 2.5,
    maxHouseholdIncome: 60000,
    allowedMajors: ['All'],
  },
];

export const INITIAL_SAVED_IDS: string[] = ['opp-101', 'opp-102', 'opp-103'];

export const INITIAL_APPLICATIONS: ApplicationRecord[] = [
  {
    id: 'app-501',
    opportunityId: 'opp-101',
    status: 'Preparing Documents',
    lastUpdated: '2026-10-29',
    missingDocuments: ['500-Word Academic Purpose Statement'],
    completedDocuments: [
      'Official University Transcript (Cumulative GPA ≥ 3.50)',
      'Academic Faculty Reference Letter',
      'Enrollment Verification Certificate',
    ],
    nextAction: 'Upload 500-Word Academic Purpose Statement before Nov 18, 2026',
    notes: 'Faculty reference letter confirmed by Dr. Kulkarni on Oct 26.',
  },
  {
    id: 'app-502',
    opportunityId: 'opp-102',
    status: 'Submitted',
    submissionDate: '2026-10-25',
    lastUpdated: '2026-10-25',
    missingDocuments: [],
    completedDocuments: [
      'Verified Household Income Certificate',
      'Official University Transcript',
      'Current Semester Fee Schedule from Bursar',
    ],
    nextAction: 'Await institutional bursar verification (expected by Nov 15, 2026)',
    notes: 'Application confirmation receipt #BA-2026-8841 saved.',
  },
  {
    id: 'app-503',
    opportunityId: 'opp-105',
    status: 'Under Review',
    submissionDate: '2026-10-20',
    lastUpdated: '2026-10-28',
    missingDocuments: [],
    completedDocuments: [
      'Official University Transcript (Cumulative GPA ≥ 3.60)',
      'Academic Faculty Reference Letter',
      'Verified Household Income Certificate',
    ],
    nextAction: 'Shortlist interviews announced on Dec 20, 2026',
    notes: 'Passed Stage 1 automated eligibility screening.',
  },
  {
    id: 'app-504',
    opportunityId: 'opp-103',
    status: 'Not Started',
    lastUpdated: '2026-10-28',
    missingDocuments: [
      'Research Methodology Statement or Technical Portfolio',
      'Faculty Advisor Endorsement',
    ],
    completedDocuments: ['Official University Transcript'],
    nextAction: 'Draft 1-page Research Methodology Statement and attach to profile',
    notes: 'Review open civic datasets repository prior to drafting proposal.',
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Approaching Deadline: BridgeAccess Tuition & Fee Relief Grant',
    message:
      'Applications close in 13 days (Nov 12, 2026). Your application is currently marked as Submitted.',
    timestamp: '2 hours ago',
    category: 'Deadline',
    read: false,
    relatedOpportunityId: 'opp-102',
    targetPage: 'my-applications',
  },
  {
    id: 'notif-2',
    title: 'New Verified Match: NextGen Clean Energy & Grid Systems Fellowship',
    message:
      'You satisfy all 5 published eligibility criteria based on your Undergraduate Computer Science & Engineering profile and 3.78 GPA.',
    timestamp: 'Yesterday · 4:15 PM',
    category: 'Match',
    read: false,
    relatedOpportunityId: 'opp-105',
    targetPage: 'my-matches',
  },
  {
    id: 'notif-3',
    title: 'Clarification Needed Unlocking 2 Additional Opportunities',
    message:
      'Confirming your First-Generation student status and uploading a Research Statement in your profile can clarify eligibility for $10,800 in sample grants.',
    timestamp: 'Oct 28, 2026',
    category: 'Verification',
    read: false,
    targetPage: 'student-profile',
  },
  {
    id: 'notif-4',
    title: 'Application Status Updated: Under Review',
    message:
      'Your illustrative application for NextGen Clean Energy & Grid Systems Fellowship moved from Submitted to Under Review.',
    timestamp: 'Oct 28, 2026',
    category: 'Application',
    read: true,
    relatedOpportunityId: 'opp-105',
    targetPage: 'my-applications',
  },
];

/**
 * Transparent Rule-Based Eligibility Engine
 * Never fabricates arbitrary percentage probabilities. Evaluates concrete rules
 * and classifies into MATCHED, POSSIBLY_MATCHED, or INELIGIBLE with explicit reasons.
 */
export function evaluateOpportunityForStudent(
  opportunity: Opportunity,
  profile: StudentProfileData
): {
  category: MatchCategory;
  summaryReason: string;
  criteria: EvaluatedCriterion[];
} {
  const criteria: EvaluatedCriterion[] = [];

  // 1. Education Level Check
  const eduMatches = opportunity.educationLevels.includes(profile.educationLevel);
  criteria.push({
    id: `${opportunity.id}-edu`,
    label: 'Education Level',
    requirementText: `Required: ${opportunity.educationLevels.join(' or ')}`,
    studentValueText: `Your Profile: ${profile.educationLevel} (${profile.currentYear})`,
    status: eduMatches ? 'Satisfied' : 'Not satisfied',
  });

  // 2. Academic Standing (GPA)
  const gpaSatisfied = profile.gpa >= opportunity.minGpa;
  criteria.push({
    id: `${opportunity.id}-gpa`,
    label: 'Minimum Cumulative GPA',
    requirementText: `Required: ≥ ${opportunity.minGpa.toFixed(2)} / 4.00`,
    studentValueText: `Your Profile: ${profile.gpa.toFixed(2)} / ${profile.gpaScale.toFixed(2)}${
      profile.transcriptUploaded ? ' (Transcript on file)' : ' (Transcript unverified)'
    }`,
    status: !gpaSatisfied
      ? 'Not satisfied'
      : profile.transcriptUploaded
      ? 'Satisfied'
      : 'Needs clarification',
  });

  // 3. Field of Study / Discipline
  const majorMatches =
    opportunity.allowedMajors.includes('All') ||
    opportunity.allowedMajors.some((m) =>
      profile.fieldOfStudy.toLowerCase().includes(m.toLowerCase()) ||
      m.toLowerCase().includes(profile.fieldOfStudy.toLowerCase())
    );
  criteria.push({
    id: `${opportunity.id}-major`,
    label: 'Eligible Field of Study',
    requirementText: opportunity.allowedMajors.includes('All')
      ? 'Open to all accredited academic disciplines'
      : `Eligible disciplines: ${opportunity.allowedMajors.join(', ')}`,
    studentValueText: `Your Profile: ${profile.fieldOfStudy}`,
    status: majorMatches ? 'Satisfied' : 'Not satisfied',
  });

  // 4. Household Income Ceiling (if applicable)
  if (typeof opportunity.maxHouseholdIncome === 'number') {
    const incomeMatches = profile.annualHouseholdIncome <= opportunity.maxHouseholdIncome;
    criteria.push({
      id: `${opportunity.id}-income`,
      label: 'Annual Household Income Threshold',
      requirementText: `Maximum eligible income: $${opportunity.maxHouseholdIncome.toLocaleString()} / yr`,
      studentValueText: `Your Profile: $${profile.annualHouseholdIncome.toLocaleString()} / yr${
        profile.incomeCertificateUploaded ? ' (Income certificate uploaded)' : ' (Self-reported, certificate pending)'
      }`,
      status: !incomeMatches
        ? 'Not satisfied'
        : profile.incomeCertificateUploaded
        ? 'Satisfied'
        : 'Needs clarification',
    });
  }

  // 5. Enrollment Status
  criteria.push({
    id: `${opportunity.id}-enrollment`,
    label: 'Enrollment Status',
    requirementText: 'Required: Full-Time Accredited Enrollment',
    studentValueText: `Your Profile: ${profile.enrollmentStatus}`,
    status: profile.enrollmentStatus === 'Full-Time' ? 'Satisfied' : 'Not satisfied',
  });

  // 6. Specific Clarifications (First-Gen or Portfolio/Research Statement)
  if (opportunity.requiresPortfolioOrResearchStatement) {
    criteria.push({
      id: `${opportunity.id}-portfolio`,
      label: 'Research Statement / Technical Portfolio',
      requirementText: 'Required: Uploaded Research Methodology Statement or Portfolio link',
      studentValueText: profile.researchStatementUploaded
        ? 'Your Profile: Research Statement uploaded'
        : 'Your Profile: Not yet uploaded to Document Vault',
      status: profile.researchStatementUploaded ? 'Satisfied' : 'Needs clarification',
    });
  }

  if (opportunity.requiresFirstGenVerification) {
    criteria.push({
      id: `${opportunity.id}-firstgen`,
      label: 'First-Generation University Entrant Status',
      requirementText: 'Required: Confirmed First-Generation undergraduate status',
      studentValueText:
        profile.firstGenerationStudent === 'Yes'
          ? 'Your Profile: Confirmed First-Generation Student'
          : profile.firstGenerationStudent === 'No'
          ? 'Your Profile: Not a First-Generation Student'
          : 'Your Profile: Status marked as Unverified in profile',
      status:
        profile.firstGenerationStudent === 'Yes'
          ? 'Satisfied'
          : profile.firstGenerationStudent === 'No'
          ? 'Not satisfied'
          : 'Needs clarification',
    });
  }

  const hasNotSatisfied = criteria.some((c) => c.status === 'Not satisfied');
  const hasClarification = criteria.some((c) => c.status === 'Needs clarification');

  let category: MatchCategory = 'MATCHED';
  let summaryReason = 'All published academic, enrollment, and financial criteria are satisfied.';

  if (hasNotSatisfied) {
    category = 'INELIGIBLE';
    const failedLabels = criteria
      .filter((c) => c.status === 'Not satisfied')
      .map((c) => c.label)
      .join(' and ');
    summaryReason = `Does not meet requirement for ${failedLabels}.`;
  } else if (hasClarification) {
    category = 'POSSIBLY_MATCHED';
    const pendingLabels = criteria
      .filter((c) => c.status === 'Needs clarification')
      .map((c) => c.label)
      .join(' and ');
    summaryReason = `Core academic & financial criteria match; requires verification for ${pendingLabels}.`;
  }

  return {
    category,
    summaryReason,
    criteria,
  };
}
