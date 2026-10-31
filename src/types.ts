export type PageId =
  // Public Website (1-4)
  | 'landing'
  | 'about'
  | 'login'
  | 'register'
  // Student Application (5-12)
  | 'student-dashboard'
  | 'student-profile'
  | 'explore'
  | 'opportunity-details'
  | 'my-matches'
  | 'saved-opportunities'
  | 'my-applications'
  | 'notifications'
  // Admin Application (13-17 + sidebar views)
  | 'admin-dashboard'
  | 'manage-opportunities'
  | 'add-edit-opportunity'
  | 'verification-centre'
  | 'expiry-management'
  | 'student-engagement'
  | 'application-analytics'
  | 'analytics-reports';

export type OpportunityCategory =
  | 'Merit Scholarship'
  | 'Need-Based Grant'
  | 'Fee Assistance'
  | 'Research Internship'
  | 'Institutional Fellowship';

export type EducationLevel =
  | 'High School Senior'
  | 'Undergraduate'
  | 'Postgraduate'
  | 'Doctoral';

export type VerificationStatus = 'Verified' | 'Pending Review' | 'Expired';

export type CriterionStatus = 'Satisfied' | 'Needs clarification' | 'Not satisfied';

export interface EligibilityRule {
  id: string;
  label: string;
  description: string;
  field: 'educationLevel' | 'minGpa' | 'maxIncome' | 'fieldOfStudy' | 'location' | 'EnrollmentStatus' | 'firstGenOrPortfolio';
  requiredValue: string;
}

export interface EvaluatedCriterion {
  id: string;
  label: string;
  requirementText: string;
  studentValueText: string;
  status: CriterionStatus;
}

export type MatchCategory = 'MATCHED' | 'POSSIBLY_MATCHED' | 'INELIGIBLE';

export interface Opportunity {
  id: string;
  title: string;
  isIllustrativeSample: boolean;
  provider: string;
  providerType: 'Foundation' | 'University Trust' | 'Public Directorate' | 'Industry Consortium';
  category: OpportunityCategory;
  educationLevels: EducationLevel[];
  location: string;
  benefitsSummary: string;
  annualValueNumeric: number;
  coverageDetails: string[];
  deadline: string; // YYYY-MM-DD
  daysRemaining: number;
  verificationStatus: VerificationStatus;
  verifiedDate: string;
  verifiedBy: string;
  officialSourceUrl: string;
  description: string;
  requiredDocuments: string[];
  viewsCount: number;
  savesCount: number;
  applicationsCount: number;
  addedDate: string;
  archived?: boolean;
  // Rule parameters for transparent matching
  minGpa: number;
  maxHouseholdIncome?: number; // USD equivalent or local bracket
  allowedMajors: string[]; // ['All'] or specific majors
  requiresPortfolioOrResearchStatement?: boolean;
  requiresFirstGenVerification?: boolean;
}

export interface StudentProfileData {
  fullName: string;
  email: string;
  institution: string;
  educationLevel: EducationLevel;
  fieldOfStudy: string;
  currentYear: string;
  gpa: number;
  gpaScale: number;
  annualHouseholdIncome: number;
  location: string;
  enrollmentStatus: 'Full-Time' | 'Part-Time';
  firstGenerationStudent: 'Yes' | 'No' | 'Unverified';
  researchStatementUploaded: boolean;
  incomeCertificateUploaded: boolean;
  transcriptUploaded: boolean;
  recommendationLetterUploaded: boolean;
  careerInterests: string[];
}

export type ApplicationStatus =
  | 'Not Started'
  | 'Preparing Documents'
  | 'Submitted'
  | 'Under Review'
  | 'Approved'
  | 'Rejected';

export interface ApplicationRecord {
  id: string;
  opportunityId: string;
  status: ApplicationStatus;
  submissionDate?: string;
  lastUpdated: string;
  missingDocuments: string[];
  completedDocuments: string[];
  nextAction: string;
  notes: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  category: 'Deadline' | 'Match' | 'Verification' | 'Application';
  read: boolean;
  relatedOpportunityId?: string;
  targetPage?: PageId;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  tone: 'default' | 'success' | 'warning';
}
