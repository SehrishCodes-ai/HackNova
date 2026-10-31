import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  UserCheck,
  Compass,
  Sparkles,
  Bookmark,
  FolderKanban,
  Bell,
  Search,
  ChevronDown,
  ExternalLink,
  CheckCircle2,
  FileText,
  ArrowLeft,
  Menu,
  X,
  ShieldCheck,
  Home,
} from 'lucide-react';
import {
  PageId,
  Opportunity,
  StudentProfileData,
  ApplicationRecord,
  ApplicationStatus,
  NotificationItem,
  EducationLevel,
} from '../types';
import { evaluateOpportunityForStudent } from '../data/mockData';
import {
  ScholarBridgeLogo,
  VerificationIndicator,
  CriterionStatusIndicator,
  OpportunityCard,
} from './BrandMark';
import {
  ThemeToggle,
  RevealOnScroll,
  AnimatedCounter,
} from './MotionPrimitives';

interface StudentWorkspaceProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  studentProfile: StudentProfileData;
  onUpdateProfile: (profile: StudentProfileData) => void;
  opportunities: Opportunity[];
  selectedOpportunityId: string;
  onSelectOpportunity: (id: string) => void;
  savedIds: string[];
  onToggleSave: (id: string) => void;
  applications: ApplicationRecord[];
  onStartOrUpdateApplication: (opportunityId: string, newStatus?: ApplicationStatus) => void;
  onToggleApplicationDoc: (applicationId: string, docName: string) => void;
  notifications: NotificationItem[];
  onMarkNotificationRead: (id: string) => void;
  onMarkAllNotificationsRead: () => void;
  onLogout: () => void;
}

const APPLICATION_STAGES: ApplicationStatus[] = [
  'Not Started',
  'Preparing Documents',
  'Submitted',
  'Under Review',
  'Approved',
  'Rejected',
];

export const StudentWorkspace: React.FC<StudentWorkspaceProps> = ({
  currentPage,
  onNavigate,
  studentProfile,
  onUpdateProfile,
  opportunities,
  selectedOpportunityId,
  onSelectOpportunity,
  savedIds,
  onToggleSave,
  applications,
  onStartOrUpdateApplication,
  onToggleApplicationDoc,
  notifications,
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
  onLogout,
}) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const evaluatedOpportunities = useMemo(() => {
    return opportunities
      .filter((o) => !o.archived)
      .map((opp) => ({
        opportunity: opp,
        evaluation: evaluateOpportunityForStudent(opp, studentProfile),
      }));
  }, [opportunities, studentProfile]);

  const matchedList = evaluatedOpportunities.filter(
    (item) =>
      item.evaluation.category === 'MATCHED' &&
      item.opportunity.verificationStatus !== 'Expired'
  );

  const possiblyMatchedList = evaluatedOpportunities.filter(
    (item) =>
      item.evaluation.category === 'POSSIBLY_MATCHED' &&
      item.opportunity.verificationStatus !== 'Expired'
  );

  const ineligibleList = evaluatedOpportunities.filter(
    (item) =>
      item.evaluation.category === 'INELIGIBLE' ||
      item.opportunity.verificationStatus === 'Expired'
  );

  const sidebarItems: {
    id: PageId;
    label: string;
    icon: React.FC<{ className?: string }>;
    count?: number;
  }[] = [
    { id: 'student-dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'student-profile', label: 'My Profile', icon: UserCheck },
    { id: 'explore', label: 'Explore Opportunities', icon: Compass },
    {
      id: 'my-matches',
      label: 'My Matches',
      icon: Sparkles,
      count: matchedList.length,
    },
    {
      id: 'saved-opportunities',
      label: 'Saved Opportunities',
      icon: Bookmark,
      count: savedIds.length,
    },
    {
      id: 'my-applications',
      label: 'My Applications',
      icon: FolderKanban,
      count: applications.length,
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      count: unreadCount > 0 ? unreadCount : undefined,
    },
  ];

  const handleNav = (page: PageId) => {
    onNavigate(page);
    setMobileSidebarOpen(false);
  };

  const handleViewDetails = (id: string) => {
    onSelectOpportunity(id);
    onNavigate('opportunity-details');
    setMobileSidebarOpen(false);
  };

  const pageTitleMap: Record<string, string> = {
    'student-dashboard': 'Student Overview',
    'student-profile': 'My Academic & Eligibility Profile',
    explore: 'Explore Opportunities Catalogue',
    'opportunity-details': 'Opportunity Details & Eligibility Verification',
    'my-matches': 'My Eligibility Matches',
    'saved-opportunities': 'Saved Opportunities',
    'my-applications': 'Application Tracker',
    notifications: 'Notifications & Deadline Alerts',
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFD] text-[#182334]">
      {/* Desktop Persistent Left Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-slate-200/90 z-30">
        <div className="h-20 px-6 flex items-center border-b border-slate-200/80">
          <ScholarBridgeLogo onClick={() => handleNav('landing')} />
        </div>

        {/* Student Quick Summary */}
        <div className="px-5 py-4 border-b border-slate-200/80 bg-[#F8FAFD]">
          <div className="rounded-xl bg-white border border-slate-200/90 p-3.5 shadow-2xs">
            <p className="font-display text-sm font-bold text-[#142B4F] truncate">
              {studentProfile.fullName}
            </p>
            <p className="text-xs font-medium text-[#68758A] truncate mt-1">
              {studentProfile.educationLevel} · {studentProfile.fieldOfStudy}
            </p>
            <div className="mt-2.5 flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#68758A]">
                Cumulative GPA
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#EAF3FF] border border-[#2864D8]/25 font-mono text-xs font-bold text-[#2864D8] tabular-nums">
                {studentProfile.gpa.toFixed(2)} / {studentProfile.gpaScale.toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3.5 py-5 space-y-1.5 overflow-y-auto" aria-label="Student Sidebar">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              currentPage === item.id ||
              (currentPage === 'opportunity-details' && item.id === 'explore');
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-[#142B4F] text-white shadow-2xs'
                    : 'text-[#68758A] hover:text-[#142B4F] hover:bg-[#EAF3FF]/60 hover:translate-x-0.5'
                }`}
              >
                <span className="flex items-center gap-2.5 min-w-0 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-[#93C5FD]' : 'text-[#68758A]'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </span>
                {typeof item.count === 'number' && (
                  <span
                    className={`font-mono text-[11px] tabular-nums shrink-0 ${
                      isActive ? 'text-[#EAF3FF]' : 'text-[#68758A]'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Student Session Actions */}
        <div className="p-4 border-t border-slate-200/80 space-y-1.5 bg-[#F8FAFD]">
          <button
            type="button"
            onClick={() => handleNav('landing')}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-medium text-[#68758A] hover:text-[#142B4F] hover:bg-white transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Public Landing Page</span>
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-rose-700 hover:bg-rose-50 transition-colors"
          >
            <span>Sign Out of Student Portal</span>
          </button>
        </div>
      </aside>

      {/* Mobile Slide-Over Sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/50"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] bg-white h-full flex flex-col z-10">
            <div className="h-20 px-5 flex items-center justify-between border-b border-slate-200">
              <ScholarBridgeLogo onClick={() => handleNav('landing')} />
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(false)}
                className="p-2 rounded-lg text-[#68758A] hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-4 py-3.5 border-b border-slate-200 bg-[#F8FAFD]">
              <div className="rounded-xl bg-white border border-slate-200 p-3">
                <p className="font-display text-sm font-bold text-[#142B4F] truncate">
                  {studentProfile.fullName}
                </p>
                <p className="text-xs font-medium text-[#68758A] truncate mt-0.5">
                  {studentProfile.educationLevel} · {studentProfile.fieldOfStudy}
                </p>
                <div className="mt-2 flex items-center justify-between gap-2 pt-1.5 border-t border-slate-100">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#68758A]">
                    Cumulative GPA
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#EAF3FF] border border-[#2864D8]/25 font-mono text-xs font-bold text-[#2864D8] tabular-nums">
                    {studentProfile.gpa.toFixed(2)} / {studentProfile.gpaScale.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex-1 px-4 py-5 space-y-1.5 overflow-y-auto">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNav(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold ${
                      isActive
                        ? 'bg-[#142B4F] text-white'
                        : 'text-[#68758A] hover:bg-slate-100'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </span>
                    {typeof item.count === 'number' && (
                      <span className="font-mono text-xs tabular-nums">{item.count}</span>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="p-4 border-t border-slate-200 space-y-2">
              <button
                type="button"
                onClick={() => handleNav('landing')}
                className="w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-medium text-[#68758A] hover:bg-slate-100"
              >
                ← Public Landing Page
              </button>
              <button
                type="button"
                onClick={onLogout}
                className="w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold text-rose-700 bg-rose-50"
              >
                Sign Out of Student Portal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Viewport */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Refined Top Navigation */}
        <header className="sticky top-0 z-20 h-20 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 lg:px-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Open student navigation"
              className="lg:hidden p-2 rounded-lg text-[#182334] hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#68758A] truncate">
              <span className="hidden sm:inline">Student Workspace</span>
              <span aria-hidden="true" className="hidden sm:inline">/</span>
              <span className="font-semibold text-[#142B4F] truncate">
                {pageTitleMap[currentPage] || 'Student Navigator'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <ThemeToggle />

            <button
              type="button"
              onClick={() => handleNav('notifications')}
              className="btn-premium-secondary relative px-3.5 py-2 rounded-lg border border-slate-200 text-xs font-medium text-[#182334] hover:border-slate-300 flex items-center gap-2 whitespace-nowrap shrink-0"
            >
              <Bell className="w-3.5 h-3.5 text-[#2864D8]" />
              <span className="hidden sm:inline">Alerts</span>
              {unreadCount > 0 && (
                <span className="font-mono text-xs font-bold text-[#2864D8] tabular-nums">
                  ({unreadCount})
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => handleNav('explore')}
              className="btn-premium-primary px-4 py-2.5 rounded-lg text-xs font-semibold bg-[#142B4F] text-white hover:bg-[#2864D8] whitespace-nowrap shrink-0"
            >
              Find Scholarships
            </button>
          </div>
        </header>

        {/* Centered Main Content Container with Consistent Max-Width & Margins */}
        <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-8 lg:px-10 py-8 lg:py-10">
          {currentPage === 'student-dashboard' && (
            <StudentDashboardView
              studentProfile={studentProfile}
              matchedList={matchedList}
              possiblyMatchedList={possiblyMatchedList}
              opportunities={opportunities}
              savedIds={savedIds}
              applications={applications}
              onToggleSave={onToggleSave}
              onViewDetails={handleViewDetails}
              onNavigate={handleNav}
            />
          )}

          {currentPage === 'student-profile' && (
            <StudentProfileView
              studentProfile={studentProfile}
              onUpdateProfile={onUpdateProfile}
              matchedCount={matchedList.length}
              possiblyMatchedCount={possiblyMatchedList.length}
              onNavigate={handleNav}
            />
          )}

          {currentPage === 'explore' && (
            <ExploreOpportunitiesView
              opportunities={opportunities}
              studentProfile={studentProfile}
              savedIds={savedIds}
              onToggleSave={onToggleSave}
              onViewDetails={handleViewDetails}
            />
          )}

          {currentPage === 'opportunity-details' && (
            <OpportunityDetailsView
              opportunity={
                opportunities.find((o) => o.id === selectedOpportunityId) ||
                opportunities[0]
              }
              studentProfile={studentProfile}
              isSaved={savedIds.includes(selectedOpportunityId)}
              existingApplication={applications.find(
                (a) => a.opportunityId === selectedOpportunityId
              )}
              onToggleSave={onToggleSave}
              onStartOrUpdateApplication={onStartOrUpdateApplication}
              onNavigate={handleNav}
            />
          )}

          {currentPage === 'my-matches' && (
            <MyMatchesView
              matchedList={matchedList}
              possiblyMatchedList={possiblyMatchedList}
              ineligibleList={ineligibleList}
              savedIds={savedIds}
              onToggleSave={onToggleSave}
              onViewDetails={handleViewDetails}
              onNavigate={handleNav}
            />
          )}

          {currentPage === 'saved-opportunities' && (
            <SavedOpportunitiesView
              opportunities={opportunities.filter((o) => savedIds.includes(o.id))}
              savedIds={savedIds}
              onToggleSave={onToggleSave}
              onViewDetails={handleViewDetails}
              onStartOrUpdateApplication={onStartOrUpdateApplication}
              onNavigate={handleNav}
            />
          )}

          {currentPage === 'my-applications' && (
            <MyApplicationsView
              applications={applications}
              opportunities={opportunities}
              onStartOrUpdateApplication={onStartOrUpdateApplication}
              onToggleApplicationDoc={onToggleApplicationDoc}
              onViewDetails={handleViewDetails}
              onNavigate={handleNav}
            />
          )}

          {currentPage === 'notifications' && (
            <NotificationsView
              notifications={notifications}
              onMarkNotificationRead={onMarkNotificationRead}
              onMarkAllNotificationsRead={onMarkAllNotificationsRead}
              onViewDetails={handleViewDetails}
              onNavigate={handleNav}
            />
          )}
        </main>
      </div>
    </div>
  );
};

// ============================================================================
// 5. STUDENT DASHBOARD VIEW
// ============================================================================
const StudentDashboardView: React.FC<{
  studentProfile: StudentProfileData;
  matchedList: { opportunity: Opportunity; evaluation: ReturnType<typeof evaluateOpportunityForStudent> }[];
  possiblyMatchedList: { opportunity: Opportunity; evaluation: ReturnType<typeof evaluateOpportunityForStudent> }[];
  opportunities: Opportunity[];
  savedIds: string[];
  applications: ApplicationRecord[];
  onToggleSave: (id: string) => void;
  onViewDetails: (id: string) => void;
  onNavigate: (page: PageId) => void;
}> = ({
  studentProfile,
  matchedList,
  possiblyMatchedList,
  opportunities,
  savedIds,
  applications,
  onToggleSave,
  onViewDetails,
  onNavigate,
}) => {
  const upcomingDeadlines = opportunities
    .filter((o) => o.daysRemaining >= 0 && o.daysRemaining <= 30 && !o.archived)
    .sort((a, b) => a.daysRemaining - b.daysRemaining);

  const recentlyAdded = [...opportunities]
    .filter((o) => o.verificationStatus !== 'Expired' && !o.archived)
    .sort((a, b) => b.addedDate.localeCompare(a.addedDate))
    .slice(0, 3);

  const submittedCount = applications.filter(
    (a) => a.status === 'Submitted' || a.status === 'Under Review'
  ).length;

  return (
    <div className="space-y-10">
      {/* Greeting Header */}
      <RevealOnScroll>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#142B4F] tracking-tight">
              Good morning, {studentProfile.fullName}
            </h1>
            <p className="text-sm text-[#68758A] mt-1.5">
              Here is your opportunity overview.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('student-profile')}
              className="btn-premium-secondary px-4 py-2.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-[#142B4F] hover:border-[#2864D8] whitespace-nowrap shrink-0"
            >
              Update Eligibility Profile
            </button>
            <button
              type="button"
              onClick={() => onNavigate('my-matches')}
              className="btn-premium-primary px-4 py-2.5 rounded-lg text-xs font-semibold bg-[#2864D8] text-white hover:bg-[#142B4F] whitespace-nowrap shrink-0"
            >
              View All Matches (<AnimatedCounter value={matchedList.length} />)
            </button>
          </div>
        </div>
      </RevealOnScroll>

      {/* 4 Statistics Cards with Animated Number Counters & Staggered Reveal */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <RevealOnScroll delayMs={40}>
          <button
            type="button"
            onClick={() => onNavigate('my-matches')}
            className="card-interactive w-full h-full bg-white border border-slate-200/90 rounded-xl p-6 text-left flex flex-col justify-between"
          >
            <span className="text-xs font-medium text-[#68758A]">Matched Opportunities</span>
            <div className="mt-3 flex items-baseline justify-between gap-2">
              <span className="font-mono text-3xl font-bold text-[#142B4F] tabular-nums">
                <AnimatedCounter value={matchedList.length} />
              </span>
              <span className="text-xs text-emerald-700 font-medium">
                +<AnimatedCounter value={possiblyMatchedList.length} /> possible
              </span>
            </div>
            <p className="text-xs text-[#68758A] mt-3">
              All published rules satisfied
            </p>
          </button>
        </RevealOnScroll>

        <RevealOnScroll delayMs={100}>
          <button
            type="button"
            onClick={() => onNavigate('saved-opportunities')}
            className="card-interactive w-full h-full bg-white border border-slate-200/90 rounded-xl p-6 text-left flex flex-col justify-between"
          >
            <span className="text-xs font-medium text-[#68758A]">Saved Opportunities</span>
            <div className="mt-3 flex items-baseline justify-between gap-2">
              <span className="font-mono text-3xl font-bold text-[#142B4F] tabular-nums">
                <AnimatedCounter value={savedIds.length} />
              </span>
              <span className="text-xs text-[#2864D8] font-medium">Bookmarked</span>
            </div>
            <p className="text-xs text-[#68758A] mt-3">
              Shortlisted for review
            </p>
          </button>
        </RevealOnScroll>

        <RevealOnScroll delayMs={160}>
          <button
            type="button"
            onClick={() => onNavigate('my-applications')}
            className="card-interactive w-full h-full bg-white border border-slate-200/90 rounded-xl p-6 text-left flex flex-col justify-between"
          >
            <span className="text-xs font-medium text-[#68758A]">Active Applications</span>
            <div className="mt-3 flex items-baseline justify-between gap-2">
              <span className="font-mono text-3xl font-bold text-[#142B4F] tabular-nums">
                <AnimatedCounter value={applications.length} />
              </span>
              <span className="text-xs text-[#182334] font-medium">
                <AnimatedCounter value={submittedCount} /> submitted
              </span>
            </div>
            <p className="text-xs text-[#68758A] mt-3">
              Tracked in application workspace
            </p>
          </button>
        </RevealOnScroll>

        <RevealOnScroll delayMs={220}>
          <button
            type="button"
            onClick={() => onNavigate('notifications')}
            className="card-interactive w-full h-full bg-white border border-slate-200/90 rounded-xl p-6 text-left flex flex-col justify-between"
          >
            <span className="text-xs font-medium text-[#68758A]">Upcoming Deadlines</span>
            <div className="mt-3 flex items-baseline justify-between gap-2">
              <span className="font-mono text-3xl font-bold text-amber-700 tabular-nums">
                <AnimatedCounter value={upcomingDeadlines.length} />
              </span>
              <span className="text-xs text-amber-700 font-medium">Next 30 days</span>
            </div>
            <p className="text-xs text-[#68758A] mt-3">
              Earliest in{' '}
              <AnimatedCounter value={upcomingDeadlines[0]?.daysRemaining ?? 0} /> days
            </p>
          </button>
        </RevealOnScroll>
      </div>

      {/* Main Grid: Recommended For You + Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Recommended For You (8 cols) */}
        <section className="lg:col-span-8 space-y-5">
          <RevealOnScroll>
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-lg font-bold text-[#142B4F]">
                  Recommended For You
                </h2>
                <p className="text-xs text-[#68758A] mt-1">
                  Verified opportunities where your profile satisfies published eligibility rules
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('my-matches')}
                className="group inline-flex items-center gap-1 text-xs font-semibold text-[#2864D8] hover:underline whitespace-nowrap shrink-0"
              >
                <span>See all matches</span>
                <span className="icon-shift-right">→</span>
              </button>
            </div>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {matchedList.slice(0, 2).map(({ opportunity }, idx) => (
              <RevealOnScroll key={opportunity.id} delayMs={idx * 90}>
                <OpportunityCard
                  opportunity={opportunity}
                  isSaved={savedIds.includes(opportunity.id)}
                  onToggleSave={onToggleSave}
                  onViewDetails={onViewDetails}
                  matchStatusLabel="Matched"
                />
              </RevealOnScroll>
            ))}
          </div>
        </section>

        {/* Upcoming Deadlines (4 cols) */}
        <section className="lg:col-span-4 space-y-5">
          <RevealOnScroll delayMs={120}>
            <div className="mb-5">
              <h2 className="font-display text-lg font-bold text-[#142B4F]">
                Upcoming Deadlines
              </h2>
              <p className="text-xs text-[#68758A] mt-1">
                Prioritised by closing date
              </p>
            </div>

            <div className="card-interactive bg-white border border-slate-200/90 rounded-xl divide-y divide-slate-100">
              {upcomingDeadlines.map((opp) => (
                <div key={opp.id} className="p-5 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <button
                      type="button"
                      onClick={() => onViewDetails(opp.id)}
                      className="font-display text-xs sm:text-sm font-bold text-[#182334] hover:text-[#2864D8] text-left line-clamp-1 transition-colors"
                    >
                      {opp.title}
                    </button>
                    <p className="text-xs text-[#68758A] mt-1 truncate">
                      {opp.category} ·{' '}
                      <span className="font-mono tabular-nums">
                        <AnimatedCounter value={opp.annualValueNumeric} prefix="$" />
                      </span>
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span
                      className={`font-mono text-xs font-semibold tabular-nums block ${
                        opp.daysRemaining <= 14 ? 'text-amber-700' : 'text-[#142B4F]'
                      }`}
                    >
                      <AnimatedCounter value={opp.daysRemaining} suffix="d left" />
                    </span>
                    <span className="font-mono text-[11px] text-[#68758A] tabular-nums mt-0.5 block">
                      {opp.deadline}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </RevealOnScroll>
        </section>
      </div>

      {/* Application Progress + Recently Added Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Application Progress (7 cols) */}
        <RevealOnScroll className="lg:col-span-7" delayMs={60}>
          <section className="card-interactive h-full bg-white border border-slate-200/90 rounded-xl p-6 sm:p-7">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="font-display text-lg font-bold text-[#142B4F]">
                  Application Progress
                </h2>
                <p className="text-xs text-[#68758A] mt-1">
                  Real-time stage and document readiness across active applications
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('my-applications')}
                className="group inline-flex items-center gap-1 text-xs font-semibold text-[#2864D8] hover:underline whitespace-nowrap shrink-0"
              >
                <span>Open Tracker</span>
                <span className="icon-shift-right">→</span>
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {applications.map((app) => {
                const opp = opportunities.find((o) => o.id === app.opportunityId);
                if (!opp) return null;
                const stageIndex = APPLICATION_STAGES.indexOf(app.status);
                const progressPct = Math.min(100, Math.max(15, ((stageIndex + 1) / 5) * 100));

                return (
                  <div key={app.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <button
                        type="button"
                        onClick={() => onViewDetails(opp.id)}
                        className="font-display text-sm font-bold text-[#182334] hover:text-[#2864D8] text-left transition-colors"
                      >
                        {opp.title}
                      </button>
                      <span className="text-xs font-semibold text-[#2864D8]">
                        {app.status}
                      </span>
                    </div>

                    {/* Clean Progress Bar */}
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-2.5">
                      <div
                        className="h-full bg-[#2864D8] rounded-full transition-all duration-500"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#68758A]">
                      <span>Next: {app.nextAction}</span>
                      <span className="font-mono tabular-nums">Due {opp.deadline}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </RevealOnScroll>

        {/* Recently Added Opportunities (5 cols) */}
        <RevealOnScroll className="lg:col-span-5" delayMs={140}>
          <section className="card-interactive h-full bg-white border border-slate-200/90 rounded-xl p-6 sm:p-7">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="font-display text-lg font-bold text-[#142B4F]">
                  Recently Added Opportunities
                </h2>
                <p className="text-xs text-[#68758A] mt-1">
                  Latest listings added to the verified registry
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('explore')}
                className="group inline-flex items-center gap-1 text-xs font-semibold text-[#2864D8] hover:underline whitespace-nowrap shrink-0"
              >
                <span>Browse All</span>
                <span className="icon-shift-right">→</span>
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {recentlyAdded.map((opp) => (
                <div key={opp.id} className="py-4 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-[11px] text-[#68758A] mb-1">
                      <span className="text-[#2864D8] font-medium">{opp.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>Added {opp.addedDate}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onViewDetails(opp.id)}
                      className="font-display text-xs sm:text-sm font-bold text-[#182334] hover:text-[#2864D8] text-left line-clamp-1 transition-colors"
                    >
                      {opp.title}
                    </button>
                    <p className="text-xs text-[#68758A] mt-1">{opp.provider}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onViewDetails(opp.id)}
                    className="btn-premium-secondary px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-[#142B4F] hover:border-[#2864D8] shrink-0"
                  >
                    Inspect
                  </button>
                </div>
              ))}
            </div>
          </section>
        </RevealOnScroll>
      </div>
    </div>
  );
};

// ============================================================================
// 6. STUDENT PROFILE VIEW
// ============================================================================
const StudentProfileView: React.FC<{
  studentProfile: StudentProfileData;
  onUpdateProfile: (profile: StudentProfileData) => void;
  matchedCount: number;
  possiblyMatchedCount: number;
  onNavigate: (page: PageId) => void;
}> = ({
  studentProfile,
  onUpdateProfile,
  matchedCount,
  possiblyMatchedCount,
  onNavigate,
}) => {
  const [draft, setDraft] = useState<StudentProfileData>(studentProfile);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(draft);
  };

  return (
    <div className="space-y-8">
      <RevealOnScroll>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#142B4F]">
              Student Academic & Eligibility Profile
            </h1>
            <p className="text-sm text-[#68758A] mt-1.5">
              Changes saved here immediately re-evaluate your eligibility across all opportunities.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs bg-white border border-slate-200 rounded-xl px-4 py-3">
            <div>
              <span className="text-[#68758A]">Current Matches: </span>
              <strong className="font-mono text-emerald-700 font-bold tabular-nums">
                <AnimatedCounter value={matchedCount} /> Matched
              </strong>
            </div>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <div>
              <strong className="font-mono text-amber-700 font-bold tabular-nums">
                <AnimatedCounter value={possiblyMatchedCount} /> Possibly Matched
              </strong>
            </div>
          </div>
        </div>
      </RevealOnScroll>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Academic & Financial Parameters (8 cols) */}
        <RevealOnScroll className="lg:col-span-8" delayMs={60}>
          <div className="card-interactive bg-white border border-slate-200/90 rounded-xl p-6 sm:p-8 space-y-6">
            <h2 className="font-display text-base font-bold text-[#142B4F] pb-4 border-b border-slate-100">
              1. Academic & Financial Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-[#182334] mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={draft.fullName}
                  onChange={(e) => setDraft({ ...draft, fullName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#182334] mb-2">
                  Institution Name
                </label>
                <input
                  type="text"
                  value={draft.institution}
                  onChange={(e) => setDraft({ ...draft, institution: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#182334] mb-2">
                  Education Level
                </label>
                <select
                  value={draft.educationLevel}
                  onChange={(e) =>
                    setDraft({ ...draft, educationLevel: e.target.value as EducationLevel })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm bg-white"
                >
                  <option value="High School Senior">High School Senior</option>
                  <option value="Undergraduate">Undergraduate</option>
                  <option value="Postgraduate">Postgraduate</option>
                  <option value="Doctoral">Doctoral</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#182334] mb-2">
                  Primary Field of Study
                </label>
                <select
                  value={draft.fieldOfStudy}
                  onChange={(e) => setDraft({ ...draft, fieldOfStudy: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm bg-white"
                >
                  <option value="Computer Science & Engineering">
                    Computer Science & Engineering
                  </option>
                  <option value="Electrical Engineering">Electrical Engineering</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Biomedical Sciences">Biomedical Sciences</option>
                  <option value="Economics">Economics</option>
                  <option value="Public Policy">Public Policy</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#182334] mb-2">
                  Cumulative GPA (4.00 Scale)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="4.0"
                  value={draft.gpa}
                  onChange={(e) =>
                    setDraft({ ...draft, gpa: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm font-mono tabular-nums"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#182334] mb-2">
                  Annual Household Income ($ USD)
                </label>
                <input
                  type="number"
                  step="500"
                  min="0"
                  value={draft.annualHouseholdIncome}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      annualHouseholdIncome: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm font-mono tabular-nums"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#182334] mb-2">
                  Enrollment Status
                </label>
                <select
                  value={draft.enrollmentStatus}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      enrollmentStatus: e.target.value as 'Full-Time' | 'Part-Time',
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm bg-white"
                >
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#182334] mb-2">
                  First-Generation University Student
                </label>
                <select
                  value={draft.firstGenerationStudent}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      firstGenerationStudent: e.target.value as 'Yes' | 'No' | 'Unverified',
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm bg-white"
                >
                  <option value="Yes">Yes — Confirmed First-Generation</option>
                  <option value="No">No</option>
                  <option value="Unverified">Unverified / Clarify Later</option>
                </select>
              </div>
            </div>

            <div className="pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => onNavigate('my-matches')}
                className="text-xs font-semibold text-[#2864D8] hover:underline"
              >
                Inspect how these values affect My Matches →
              </button>
              <button
                type="submit"
                className="btn-premium-primary px-6 py-3 rounded-lg text-xs font-semibold bg-[#142B4F] text-white hover:bg-[#2864D8]"
              >
                Save Profile & Recalculate Matches
              </button>
            </div>
          </div>
        </RevealOnScroll>

        {/* Document Verification Vault (4 cols) */}
        <RevealOnScroll className="lg:col-span-4" delayMs={140}>
          <div className="card-interactive h-full bg-white border border-slate-200/90 rounded-xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <div>
                <h2 className="font-display text-base font-bold text-[#142B4F]">
                  2. Document Verification Vault
                </h2>
                <p className="text-xs text-[#68758A] mt-1.5 leading-relaxed">
                  Toggle uploaded status to resolve "Needs clarification" criteria in My Matches.
                </p>
              </div>

              <div className="space-y-3.5">
                {[
                  {
                    key: 'transcriptUploaded' as const,
                    label: 'Official University Transcript',
                    desc: 'Verifies cumulative GPA & course load',
                  },
                  {
                    key: 'incomeCertificateUploaded' as const,
                    label: 'Household Income Certificate',
                    desc: 'Required for need-based grants & fee relief',
                  },
                  {
                    key: 'researchStatementUploaded' as const,
                    label: 'Research Statement / Portfolio',
                    desc: 'Unlocks Civic Systems & Research Internships',
                  },
                  {
                    key: 'recommendationLetterUploaded' as const,
                    label: 'Academic Reference Letter',
                    desc: 'Endorsement from faculty advisor',
                  },
                ].map((doc) => {
                  const isChecked = draft[doc.key];
                  return (
                    <label
                      key={doc.key}
                      className="flex items-start gap-3 p-3.5 rounded-lg border border-slate-200 hover:border-[#2864D8]/40 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) =>
                          setDraft({ ...draft, [doc.key]: e.target.checked })
                        }
                        className="mt-1 rounded border-slate-300 text-[#2864D8] focus:ring-[#2864D8]"
                      />
                      <div className="min-w-0">
                        <span className="block text-xs font-bold text-[#182334]">
                          {doc.label}
                        </span>
                        <span className="block text-[11px] text-[#68758A] mt-1">
                          {doc.desc}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="btn-premium-secondary w-full py-3 px-4 rounded-lg text-xs font-semibold bg-[#EAF3FF] text-[#142B4F] hover:bg-[#2864D8] hover:text-white border border-[#2864D8]/25"
            >
              Update Document Readiness
            </button>
          </div>
        </RevealOnScroll>
      </form>
    </div>
  );
};

// ============================================================================
// 7. EXPLORE OPPORTUNITIES CATALOGUE VIEW
// ============================================================================
export const ExploreOpportunitiesView: React.FC<{
  opportunities: Opportunity[];
  studentProfile: StudentProfileData;
  savedIds: string[];
  onToggleSave: (id: string) => void;
  onViewDetails: (id: string) => void;
}> = ({ opportunities, studentProfile, savedIds, onToggleSave, onViewDetails }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedEduLevel, setSelectedEduLevel] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [deadlineFilter, setDeadlineFilter] = useState<'all' | 'urgent' | 'open'>('open');
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opp) => {
      if (opp.archived) return false;

      const matchesSearch =
        !searchQuery.trim() ||
        opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' || opp.category === selectedCategory;

      const matchesEdu =
        selectedEduLevel === 'All' ||
        opp.educationLevels.includes(selectedEduLevel as EducationLevel);

      const matchesLocation =
        selectedLocation === 'All' ||
        opp.location.toLowerCase().includes(selectedLocation.toLowerCase());

      const matchesDeadline =
        deadlineFilter === 'all'
          ? true
          : deadlineFilter === 'urgent'
          ? opp.daysRemaining >= 0 && opp.daysRemaining <= 21
          : opp.daysRemaining >= 0;

      const matchesVerified =
        !verifiedOnly || opp.verificationStatus === 'Verified';

      return (
        matchesSearch &&
        matchesCategory &&
        matchesEdu &&
        matchesLocation &&
        matchesDeadline &&
        matchesVerified
      );
    });
  }, [
    opportunities,
    searchQuery,
    selectedCategory,
    selectedEduLevel,
    selectedLocation,
    deadlineFilter,
    verifiedOnly,
  ]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedEduLevel('All');
    setSelectedLocation('All');
    setDeadlineFilter('all');
    setVerifiedOnly(false);
  };

  return (
    <div className="space-y-8">
      <RevealOnScroll>
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#142B4F]">
            Opportunity Catalogue
          </h1>
          <p className="text-sm text-[#68758A] mt-1.5">
            Search and filter illustrative sample scholarships, fee assistance grants, and research internships.
          </p>
        </div>
      </RevealOnScroll>

      {/* Search & Filter Control Panel */}
      <RevealOnScroll delayMs={50}>
        <div className="bg-white border border-slate-200/90 rounded-xl p-6 sm:p-7 space-y-5">
          {/* Search Input + Verified Toggle */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#68758A] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by opportunity title, provider, or discipline (e.g., STEM, Fee Relief, Civic)..."
                className="w-full pl-11 pr-4 py-3 rounded-lg border border-slate-300 text-sm text-[#182334]"
              />
            </div>

            <button
              type="button"
              onClick={() => setVerifiedOnly(!verifiedOnly)}
              className={`btn-premium-secondary px-5 py-3 rounded-lg text-xs font-semibold border flex items-center justify-center gap-2 whitespace-nowrap shrink-0 ${
                verifiedOnly
                  ? 'bg-[#EAF3FF] border-[#2864D8] text-[#142B4F]'
                  : 'bg-white border-slate-300 text-[#68758A] hover:text-[#182334]'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verified Sources Only</span>
            </button>
          </div>

          {/* 4 Structured Filter Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-3 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-[#68758A] mb-2">
                Opportunity Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs font-medium text-[#182334] bg-white"
              >
                <option value="All">All Categories</option>
                <option value="Merit Scholarship">Merit Scholarship</option>
                <option value="Need-Based Grant">Need-Based Grant</option>
                <option value="Fee Assistance">Fee Assistance</option>
                <option value="Research Internship">Research Internship</option>
                <option value="Institutional Fellowship">Institutional Fellowship</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#68758A] mb-2">
                Education Level
              </label>
              <select
                value={selectedEduLevel}
                onChange={(e) => setSelectedEduLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs font-medium text-[#182334] bg-white"
              >
                <option value="All">All Education Levels</option>
                <option value="High School Senior">High School Senior</option>
                <option value="Undergraduate">Undergraduate</option>
                <option value="Postgraduate">Postgraduate</option>
                <option value="Doctoral">Doctoral</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#68758A] mb-2">
                Location / Scope
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs font-medium text-[#182334] bg-white"
              >
                <option value="All">All Locations</option>
                <option value="National">National</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Rural">Regional Rural Districts</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#68758A] mb-2">
                Application Window
              </label>
              <select
                value={deadlineFilter}
                onChange={(e) =>
                  setDeadlineFilter(e.target.value as 'all' | 'urgent' | 'open')
                }
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs font-medium text-[#182334] bg-white"
              >
                <option value="open">Active Cycles Only</option>
                <option value="urgent">Closing Within 21 Days</option>
                <option value="all">Include Expired Cycles</option>
              </select>
            </div>
          </div>

          {/* Active Result Count & Reset */}
          <div className="flex items-center justify-between pt-2 text-xs text-[#68758A]">
            <span>
              Showing{' '}
              <strong className="font-mono text-[#182334] tabular-nums">
                {filteredOpportunities.length}
              </strong>{' '}
              of{' '}
              <strong className="font-mono text-[#182334] tabular-nums">
                {opportunities.length}
              </strong>{' '}
              sample opportunities
            </span>
            <button
              type="button"
              onClick={handleResetFilters}
              className="font-semibold text-[#2864D8] hover:underline"
            >
              Reset All Filters
            </button>
          </div>
        </div>
      </RevealOnScroll>

      {/* Results Grid */}
      {filteredOpportunities.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-3">
          <p className="font-display text-base font-bold text-[#142B4F]">
            No opportunities match your current filter selection
          </p>
          <p className="text-xs text-[#68758A] max-w-md mx-auto">
            Try clearing your search keyword or expanding the education level and deadline filters.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="btn-premium-primary px-4 py-2.5 rounded-lg text-xs font-semibold bg-[#142B4F] text-white"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredOpportunities.map((opp, idx) => {
            const evalResult = evaluateOpportunityForStudent(opp, studentProfile);
            const matchLabel =
              evalResult.category === 'MATCHED'
                ? 'Matched'
                : evalResult.category === 'POSSIBLY_MATCHED'
                ? 'Possibly Matched'
                : 'Ineligible';
            return (
              <RevealOnScroll key={opp.id} delayMs={(idx % 4) * 60}>
                <OpportunityCard
                  opportunity={opp}
                  isSaved={savedIds.includes(opp.id)}
                  onToggleSave={onToggleSave}
                  onViewDetails={onViewDetails}
                  matchStatusLabel={matchLabel}
                />
              </RevealOnScroll>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 8. OPPORTUNITY DETAILS VIEW
// ============================================================================
const OpportunityDetailsView: React.FC<{
  opportunity: Opportunity;
  studentProfile: StudentProfileData;
  isSaved: boolean;
  existingApplication?: ApplicationRecord;
  onToggleSave: (id: string) => void;
  onStartOrUpdateApplication: (opportunityId: string, status?: ApplicationStatus) => void;
  onNavigate: (page: PageId) => void;
}> = ({
  opportunity,
  studentProfile,
  isSaved,
  existingApplication,
  onToggleSave,
  onStartOrUpdateApplication,
  onNavigate,
}) => {
  const [sourceModalOpen, setSourceModalOpen] = useState(false);
  const evaluation = evaluateOpportunityForStudent(opportunity, studentProfile);

  return (
    <div className="space-y-8">
      {/* Back navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => onNavigate('explore')}
          className="group inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#68758A] hover:text-[#142B4F] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Opportunity Catalogue</span>
        </button>

        <VerificationIndicator
          status={opportunity.verificationStatus}
          showAudit={opportunity.verifiedBy}
        />
      </div>

      {/* Main Header Card */}
      <RevealOnScroll>
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-center gap-2.5 text-xs text-[#68758A] mb-4">
            <span className="font-semibold text-[#2864D8]">{opportunity.category}</span>
            <span aria-hidden="true">·</span>
            <span>{opportunity.educationLevels.join(', ')}</span>
            <span aria-hidden="true">·</span>
            <span>{opportunity.location}</span>
            <span aria-hidden="true">·</span>
            <span>Illustrative Sample Opportunity</span>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#142B4F] mb-2.5">
            {opportunity.title}
          </h1>
          <p className="text-sm text-[#68758A] mb-8">
            Provided by <strong className="text-[#182334]">{opportunity.provider}</strong> ({opportunity.providerType})
          </p>

          {/* Key Metrics Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-5 sm:p-6 rounded-xl bg-[#F8FAFD] border border-slate-200/80 mb-8">
            <div>
              <span className="block text-xs text-[#68758A] mb-1">Annual Financial Support</span>
              <span className="font-mono text-xl font-bold text-[#142B4F] tabular-nums">
                <AnimatedCounter
                  value={opportunity.annualValueNumeric}
                  prefix="$"
                  suffix=" / yr"
                />
              </span>
            </div>
            <div>
              <span className="block text-xs text-[#68758A] mb-1">Application Deadline</span>
              <span className="font-mono text-xl font-bold text-[#182334] tabular-nums">
                {opportunity.deadline}{' '}
                <span className="text-xs font-normal text-[#68758A]">
                  (
                  {opportunity.daysRemaining >= 0 ? (
                    <AnimatedCounter
                      value={opportunity.daysRemaining}
                      suffix="d remaining"
                    />
                  ) : (
                    'Closed'
                  )}
                  )
                </span>
              </span>
            </div>
            <div>
              <span className="block text-xs text-[#68758A] mb-1">Your Eligibility Result</span>
              <span
                className={`font-display text-base font-bold ${
                  evaluation.category === 'MATCHED'
                    ? 'text-emerald-700'
                    : evaluation.category === 'POSSIBLY_MATCHED'
                    ? 'text-amber-700'
                    : 'text-rose-700'
                }`}
              >
                {evaluation.category === 'MATCHED'
                  ? 'Matched (All Criteria Met)'
                  : evaluation.category === 'POSSIBLY_MATCHED'
                  ? 'Possibly Matched (Needs Clarification)'
                  : 'Currently Ineligible'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={() => {
                  onStartOrUpdateApplication(opportunity.id, 'Preparing Documents');
                  onNavigate('my-applications');
                }}
                className="btn-premium-primary px-6 py-3 rounded-lg text-xs sm:text-sm font-semibold bg-[#142B4F] text-white hover:bg-[#2864D8] whitespace-nowrap shrink-0"
              >
                {existingApplication
                  ? `Continue Application (${existingApplication.status}) →`
                  : 'Apply Now / Add to Application Tracker'}
              </button>

              <button
                type="button"
                onClick={() => onToggleSave(opportunity.id)}
                className={`btn-premium-secondary inline-flex items-center gap-2 px-4 py-3 rounded-lg text-xs sm:text-sm font-semibold border whitespace-nowrap shrink-0 ${
                  isSaved
                    ? 'bg-[#EAF3FF] border-[#2864D8] text-[#142B4F]'
                    : 'bg-white border-slate-300 text-[#182334] hover:border-[#142B4F]'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#2864D8] text-[#2864D8]' : ''}`} />
                <span>{isSaved ? 'Saved Opportunity' : 'Save Opportunity'}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setSourceModalOpen(!sourceModalOpen)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2864D8] hover:underline"
            >
              <span>Inspect Official Source Registry URL</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {sourceModalOpen && (
            <div className="mt-6 p-5 rounded-xl bg-[#EAF3FF]/60 border border-[#2864D8]/30 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <strong className="text-[#142B4F]">Official Source Verification Record</strong>
                <span className="font-mono text-[#68758A]">Verified on {opportunity.verifiedDate}</span>
              </div>
              <p className="font-mono text-[#2864D8] break-all">{opportunity.officialSourceUrl}</p>
              <p className="text-[#68758A]">
                Note: This is an illustrative sample URL demonstrating how ScholarBridge links applicants directly to verified institutional circulars without third-party intermediaries.
              </p>
            </div>
          )}
        </div>
      </RevealOnScroll>

      {/* Two-Column Breakdown: Left (Description, Benefits, Documents) + Right (Live Eligibility Checklist) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <div className="lg:col-span-7 space-y-6">
          <RevealOnScroll delayMs={60}>
            <div className="card-interactive bg-white border border-slate-200/90 rounded-xl p-6 sm:p-8 space-y-5">
              <h2 className="font-display text-lg font-bold text-[#142B4F]">
                Overview & Benefits Breakdown
              </h2>
              <p className="text-sm text-[#68758A] leading-relaxed">
                {opportunity.description}
              </p>
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#142B4F] mb-3.5">
                  Financial & Institutional Support Included
                </h3>
                <ul className="space-y-3">
                  {opportunity.coverageDetails.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#182334]">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delayMs={120}>
            <div className="card-interactive bg-white border border-slate-200/90 rounded-xl p-6 sm:p-8 space-y-4">
              <h2 className="font-display text-lg font-bold text-[#142B4F]">
                Required Application Documents
              </h2>
              <p className="text-xs text-[#68758A]">
                Prepare these documents before submitting via the official institutional portal:
              </p>
              <div className="divide-y divide-slate-100">
                {opportunity.requiredDocuments.map((doc, idx) => (
                  <div key={idx} className="py-3.5 flex items-center justify-between gap-4 text-xs sm:text-sm">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-[#2864D8] shrink-0" />
                      <span className="font-medium text-[#182334]">{doc}</span>
                    </div>
                    <span className="text-xs text-[#68758A]">Mandatory</span>
                  </div>
                ))}
              </div>
            </div>
          </RevealOnScroll>
        </div>

        {/* Right: Rule-by-Rule Eligibility Comparison */}
        <RevealOnScroll className="lg:col-span-5" delayMs={160}>
          <div className="card-interactive bg-white border border-slate-200/90 rounded-xl p-6 sm:p-8 space-y-5">
            <div className="pb-4 border-b border-slate-100">
              <h2 className="font-display text-lg font-bold text-[#142B4F]">
                Rule-by-Rule Eligibility Check
              </h2>
              <p className="text-xs text-[#68758A] mt-1">
                Evaluated against {studentProfile.fullName}’s current profile
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              {evaluation.criteria.map((crit) => (
                <div key={crit.id} className="py-4 first:pt-0 last:pb-0 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-display text-xs font-bold text-[#182334]">
                      {crit.label}
                    </span>
                    <CriterionStatusIndicator status={crit.status} />
                  </div>
                  <p className="text-xs text-[#68758A]">{crit.requirementText}</p>
                  <p className="text-xs font-medium text-[#142B4F]">{crit.studentValueText}</p>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => onNavigate('student-profile')}
                className="btn-premium-secondary w-full py-3 px-4 rounded-lg text-xs font-semibold bg-[#F8FAFD] border border-slate-200 text-[#142B4F] hover:border-[#2864D8]"
              >
                Update Profile or Upload Documents →
              </button>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </div>
  );
};

// ============================================================================
// 9. MY MATCHES VIEW (Matched / Possibly Matched / Ineligible + "Why this result?")
// ============================================================================
const MyMatchesView: React.FC<{
  matchedList: { opportunity: Opportunity; evaluation: ReturnType<typeof evaluateOpportunityForStudent> }[];
  possiblyMatchedList: { opportunity: Opportunity; evaluation: ReturnType<typeof evaluateOpportunityForStudent> }[];
  ineligibleList: { opportunity: Opportunity; evaluation: ReturnType<typeof evaluateOpportunityForStudent> }[];
  savedIds: string[];
  onToggleSave: (id: string) => void;
  onViewDetails: (id: string) => void;
  onNavigate: (page: PageId) => void;
}> = ({
  matchedList,
  possiblyMatchedList,
  ineligibleList,
  savedIds,
  onToggleSave,
  onViewDetails,
  onNavigate,
}) => {
  const [expandedIds, setExpandedIds] = useState<string[]>([
    matchedList[0]?.opportunity.id || 'opp-101',
    possiblyMatchedList[0]?.opportunity.id || 'opp-103',
  ]);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const renderMatchSection = (
    title: string,
    subtitle: string,
    tierBadgeText: string,
    tierTone: 'emerald' | 'amber' | 'slate',
    items: { opportunity: Opportunity; evaluation: ReturnType<typeof evaluateOpportunityForStudent> }[]
  ) => {
    return (
      <section className="space-y-5">
        <RevealOnScroll>
          <div className="pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="font-display text-xl font-bold text-[#142B4F]">{title}</h2>
                <span className="font-mono text-xs font-bold text-[#68758A] tabular-nums">
                  (<AnimatedCounter value={items.length} />)
                </span>
              </div>
              <p className="text-xs text-[#68758A] mt-1">{subtitle}</p>
            </div>
            <span
              className={`text-xs font-semibold ${
                tierTone === 'emerald'
                  ? 'text-emerald-700'
                  : tierTone === 'amber'
                  ? 'text-amber-700'
                  : 'text-[#68758A]'
              }`}
            >
              {tierBadgeText}
            </span>
          </div>
        </RevealOnScroll>

        <div className="space-y-5">
          {items.map(({ opportunity, evaluation }, idx) => {
            const isExpanded = expandedIds.includes(opportunity.id);
            const isSaved = savedIds.includes(opportunity.id);

            return (
              <RevealOnScroll key={opportunity.id} delayMs={idx * 65}>
                <article className="card-interactive bg-white border border-slate-200/90 rounded-xl p-6 sm:p-7">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#68758A]">
                        <span className="font-semibold text-[#2864D8]">
                          {opportunity.category}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{opportunity.provider}</span>
                        <span aria-hidden="true">·</span>
                        <VerificationIndicator status={opportunity.verificationStatus} />
                      </div>

                      <h3 className="font-display text-lg font-bold text-[#182334]">
                        <button
                          type="button"
                          onClick={() => onViewDetails(opportunity.id)}
                          className="text-left hover:text-[#2864D8] transition-colors"
                        >
                          {opportunity.title}
                        </button>
                      </h3>

                      <p className="text-xs sm:text-sm text-[#68758A]">{evaluation.summaryReason}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3.5 shrink-0">
                      <div className="text-left lg:text-right mr-2">
                        <span className="block font-mono text-base sm:text-lg font-bold text-[#142B4F] tabular-nums">
                          <AnimatedCounter
                            value={opportunity.annualValueNumeric}
                            prefix="$"
                            suffix=" / yr"
                          />
                        </span>
                        <span className="block font-mono text-xs text-[#68758A] tabular-nums mt-0.5">
                          Due {opportunity.deadline}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => onToggleSave(opportunity.id)}
                        className={`btn-premium-secondary px-3.5 py-2.5 rounded-lg text-xs font-semibold border ${
                          isSaved
                            ? 'bg-[#EAF3FF] border-[#2864D8] text-[#142B4F]'
                            : 'bg-white border-slate-200 text-[#68758A] hover:text-[#182334]'
                        }`}
                      >
                        {isSaved ? 'Saved' : 'Save'}
                      </button>

                      <button
                        type="button"
                        onClick={() => onViewDetails(opportunity.id)}
                        className="btn-premium-primary px-4 py-2.5 rounded-lg text-xs font-semibold bg-[#142B4F] text-white hover:bg-[#2864D8]"
                      >
                        View Details
                      </button>
                    </div>
                  </div>

                  {/* Expandable "Why this result?" section */}
                  <div className="mt-5 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => toggleExpand(opportunity.id)}
                      className="w-full flex items-center justify-between text-xs font-semibold text-[#142B4F] hover:text-[#2864D8] py-1 transition-colors"
                    >
                      <span>
                        Why this result? ({evaluation.criteria.filter((c) => c.status === 'Satisfied').length} of{' '}
                        {evaluation.criteria.length} criteria satisfied)
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-300 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {isExpanded && (
                      <div className="mt-4 bg-[#F8FAFD] border border-slate-200/80 rounded-xl p-5 divide-y divide-slate-200/70">
                        {evaluation.criteria.map((crit) => (
                          <div
                            key={crit.id}
                            className="py-3 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                          >
                            <div>
                              <span className="font-bold text-[#182334]">{crit.label}: </span>
                              <span className="text-[#68758A]">{crit.requirementText}</span>
                              <span aria-hidden="true" className="mx-1.5 text-slate-300">·</span>
                              <span className="font-medium text-[#142B4F]">{crit.studentValueText}</span>
                            </div>
                            <CriterionStatusIndicator status={crit.status} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              </RevealOnScroll>
            );
          })}
        </div>
      </section>
    );
  };

  return (
    <div className="space-y-12">
      <RevealOnScroll>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#142B4F]">
              My Eligibility Matches
            </h1>
            <p className="text-sm text-[#68758A] mt-1.5">
              Deterministic rule-by-rule evaluation against your academic profile. No arbitrary probability scores.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('student-profile')}
            className="btn-premium-secondary px-4 py-2.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-[#142B4F] hover:border-[#2864D8] whitespace-nowrap shrink-0"
          >
            Edit Profile Criteria →
          </button>
        </div>
      </RevealOnScroll>

      {/* SECTION 1: MATCHED */}
      {renderMatchSection(
        'Matched',
        'Student satisfies all available published eligibility criteria.',
        'All Criteria Satisfied',
        'emerald',
        matchedList
      )}

      {/* SECTION 2: POSSIBLY MATCHED */}
      {renderMatchSection(
        'Possibly Matched',
        'Core academic profile fits, but some information is incomplete or requires document clarification.',
        'Requires Profile Clarification',
        'amber',
        possiblyMatchedList
      )}

      {/* SECTION 3: INELIGIBLE */}
      {renderMatchSection(
        'Ineligible',
        'One or more specified eligibility requirements are not satisfied or the cycle has closed.',
        'Requirements Not Met',
        'slate',
        ineligibleList
      )}
    </div>
  );
};

// ============================================================================
// 10. SAVED OPPORTUNITIES VIEW
// ============================================================================
const SavedOpportunitiesView: React.FC<{
  opportunities: Opportunity[];
  savedIds: string[];
  onToggleSave: (id: string) => void;
  onViewDetails: (id: string) => void;
  onStartOrUpdateApplication: (opportunityId: string, status?: ApplicationStatus) => void;
  onNavigate: (page: PageId) => void;
}> = ({ opportunities, savedIds, onToggleSave, onViewDetails, onNavigate }) => {
  const totalSavedValue = opportunities.reduce(
    (sum, o) => sum + o.annualValueNumeric,
    0
  );

  return (
    <div className="space-y-8">
      <RevealOnScroll>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#142B4F]">
              Saved Opportunities
            </h1>
            <p className="text-sm text-[#68758A] mt-1.5">
              Your personal shortlist of scholarships, grants, and internships (
              <AnimatedCounter value={opportunities.length} /> saved · Combined annual value:{' '}
              <strong className="font-mono text-[#142B4F] tabular-nums">
                <AnimatedCounter value={totalSavedValue} prefix="$" />
              </strong>
              ).
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('explore')}
            className="btn-premium-primary px-4 py-2.5 rounded-lg text-xs font-semibold bg-[#142B4F] text-white hover:bg-[#2864D8] whitespace-nowrap shrink-0"
          >
            Browse More Opportunities →
          </button>
        </div>
      </RevealOnScroll>

      {opportunities.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-3">
          <p className="font-display text-base font-bold text-[#142B4F]">
            You have no saved opportunities yet
          </p>
          <p className="text-xs text-[#68758A] max-w-md mx-auto">
            Bookmark scholarships while exploring the catalogue or reviewing your matches to compare deadlines here.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('explore')}
            className="btn-premium-primary px-4 py-2.5 rounded-lg text-xs font-semibold bg-[#142B4F] text-white"
          >
            Explore Catalogue
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {opportunities.map((opp, idx) => (
            <RevealOnScroll key={opp.id} delayMs={idx * 75}>
              <OpportunityCard
                opportunity={opp}
                isSaved={savedIds.includes(opp.id)}
                onToggleSave={onToggleSave}
                onViewDetails={onViewDetails}
              />
            </RevealOnScroll>
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 11. MY APPLICATIONS TRACKER VIEW
// ============================================================================
const MyApplicationsView: React.FC<{
  applications: ApplicationRecord[];
  opportunities: Opportunity[];
  onStartOrUpdateApplication: (opportunityId: string, status: ApplicationStatus) => void;
  onToggleApplicationDoc: (applicationId: string, docName: string) => void;
  onViewDetails: (id: string) => void;
  onNavigate: (page: PageId) => void;
}> = ({
  applications,
  opportunities,
  onStartOrUpdateApplication,
  onToggleApplicationDoc,
  onViewDetails,
  onNavigate,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const filteredApps =
    statusFilter === 'All'
      ? applications
      : applications.filter((a) => a.status === statusFilter);

  return (
    <div className="space-y-8">
      <RevealOnScroll>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#142B4F]">
              Application Tracker
            </h1>
            <p className="text-sm text-[#68758A] mt-1.5">
              Monitor submission progress, required documents, and institutional review stages.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('explore')}
            className="btn-premium-primary px-4 py-2.5 rounded-lg text-xs font-semibold bg-[#142B4F] text-white hover:bg-[#2864D8] whitespace-nowrap shrink-0"
          >
            + Add Opportunity to Tracker
          </button>
        </div>
      </RevealOnScroll>

      {/* Interactive Status Filter Bar */}
      <RevealOnScroll delayMs={40}>
        <div className="flex items-center gap-2 p-1.5 bg-white border border-slate-200 rounded-xl overflow-x-auto">
          {['All', ...APPLICATION_STAGES].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                statusFilter === st
                  ? 'bg-[#142B4F] text-white'
                  : 'text-[#68758A] hover:text-[#182334]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </RevealOnScroll>

      {/* Application Cards */}
      <div className="space-y-6">
        {filteredApps.map((app, idx) => {
          const opp = opportunities.find((o) => o.id === app.opportunityId);
          if (!opp) return null;
          const allDocs = opp.requiredDocuments;

          return (
            <RevealOnScroll key={app.id} delayMs={idx * 75}>
              <div className="card-interactive bg-white border border-slate-200/90 rounded-xl p-6 sm:p-8 space-y-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#68758A] mb-1.5">
                      <span className="font-semibold text-[#2864D8]">{opp.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{opp.provider}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">
                        Deadline: {opp.deadline} (<AnimatedCounter value={opp.daysRemaining} suffix="d left" />)
                      </span>
                    </div>
                    <h2 className="font-display text-lg font-bold text-[#142B4F]">
                      <button
                        type="button"
                        onClick={() => onViewDetails(opp.id)}
                        className="text-left hover:text-[#2864D8] transition-colors"
                      >
                        {opp.title}
                      </button>
                    </h2>
                  </div>

                  {/* Interactive Status Selector */}
                  <div className="flex items-center gap-3 shrink-0">
                    <label className="text-xs font-semibold text-[#68758A]">
                      Current Stage:
                    </label>
                    <select
                      value={app.status}
                      onChange={(e) =>
                        onStartOrUpdateApplication(
                          opp.id,
                          e.target.value as ApplicationStatus
                        )
                      }
                      className="px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs font-bold text-[#142B4F] bg-[#F8FAFD]"
                    >
                      {APPLICATION_STAGES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Visual 6-Stage Timeline Indicator */}
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                  {APPLICATION_STAGES.map((stage, stageIdx) => {
                    const currentIdx = APPLICATION_STAGES.indexOf(app.status);
                    const isCompleted =
                      stageIdx <= currentIdx && app.status !== 'Rejected';
                    const isCurrent = stage === app.status;

                    return (
                      <button
                        key={stage}
                        type="button"
                        onClick={() => onStartOrUpdateApplication(opp.id, stage)}
                        className={`p-3 rounded-lg border text-left transition-all duration-200 hover:-translate-y-0.5 ${
                          isCurrent
                            ? 'bg-[#EAF3FF] border-[#2864D8] text-[#142B4F]'
                            : isCompleted
                            ? 'bg-emerald-50/60 border-emerald-200 text-emerald-800'
                            : 'bg-[#F8FAFD] border-slate-200 text-[#68758A]'
                        }`}
                      >
                        <span className="block font-mono text-[10px] tabular-nums">
                          STAGE 0{stageIdx + 1}
                        </span>
                        <span className="block text-xs font-semibold truncate mt-1">
                          {stage}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Document Checklist & Next Action */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
                  <div className="lg:col-span-7 space-y-3">
                    <span className="block text-xs font-bold text-[#142B4F]">
                      Required Documents Checklist (Click to toggle completion)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {allDocs.map((docName) => {
                        const isDone = app.completedDocuments.includes(docName);
                        return (
                          <button
                            key={docName}
                            type="button"
                            onClick={() => onToggleApplicationDoc(app.id, docName)}
                            className={`p-3 rounded-lg border text-left flex items-start gap-2.5 text-xs transition-all duration-200 hover:-translate-y-0.5 ${
                              isDone
                                ? 'bg-white border-emerald-200 text-[#182334]'
                                : 'bg-amber-50/40 border-amber-200 text-amber-900'
                            }`}
                          >
                            <CheckCircle2
                              className={`w-4 h-4 shrink-0 mt-0.5 ${
                                isDone ? 'text-emerald-600' : 'text-amber-500'
                              }`}
                            />
                            <div>
                              <span className="font-medium block">{docName}</span>
                              <span className="text-[11px] text-[#68758A] mt-0.5 block">
                                {isDone ? 'Ready / Attached' : 'Missing document'}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="lg:col-span-5 bg-[#F8FAFD] border border-slate-200/80 rounded-xl p-5 flex flex-col justify-between space-y-3">
                    <div>
                      <span className="block text-[11px] font-semibold text-[#68758A] uppercase">
                        Recommended Next Action
                      </span>
                      <p className="text-xs sm:text-sm font-semibold text-[#142B4F] mt-1.5 leading-relaxed">
                        {app.missingDocuments.length > 0
                          ? `Upload remaining ${app.missingDocuments.length} document(s): ${app.missingDocuments.join(', ')}`
                          : app.nextAction}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-slate-200/70 flex items-center justify-between text-xs text-[#68758A]">
                      <span>
                        {app.submissionDate
                          ? `Submitted: ${app.submissionDate}`
                          : `Last updated: ${app.lastUpdated}`}
                      </span>
                      <button
                        type="button"
                        onClick={() => onViewDetails(opp.id)}
                        className="font-semibold text-[#2864D8] hover:underline"
                      >
                        Opportunity Details →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// 12. NOTIFICATIONS VIEW
// ============================================================================
const NotificationsView: React.FC<{
  notifications: NotificationItem[];
  onMarkNotificationRead: (id: string) => void;
  onMarkAllNotificationsRead: () => void;
  onViewDetails: (id: string) => void;
  onNavigate: (page: PageId) => void;
}> = ({
  notifications,
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
  onViewDetails,
  onNavigate,
}) => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const list =
    filter === 'unread' ? notifications.filter((n) => !n.read) : notifications;

  return (
    <div className="space-y-8">
      <RevealOnScroll>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#142B4F]">
              Notifications & Deadline Alerts
            </h1>
            <p className="text-sm text-[#68758A] mt-1.5">
              Timely updates on approaching scholarship deadlines, new eligibility matches, and application status changes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-lg">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                  filter === 'all'
                    ? 'bg-[#142B4F] text-white'
                    : 'text-[#68758A] hover:text-[#182334]'
                }`}
              >
                All (<AnimatedCounter value={notifications.length} />)
              </button>
              <button
                type="button"
                onClick={() => setFilter('unread')}
                className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                  filter === 'unread'
                    ? 'bg-[#142B4F] text-white'
                    : 'text-[#68758A] hover:text-[#182334]'
                }`}
              >
                Unread (<AnimatedCounter value={notifications.filter((n) => !n.read).length} />)
              </button>
            </div>

            <button
              type="button"
              onClick={onMarkAllNotificationsRead}
              className="btn-premium-secondary px-4 py-2 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-[#142B4F] hover:border-[#2864D8]"
            >
              Mark All as Read
            </button>
          </div>
        </div>
      </RevealOnScroll>

      <RevealOnScroll delayMs={60}>
        <div className="bg-white border border-slate-200/90 rounded-xl divide-y divide-slate-100 overflow-hidden">
          {list.length === 0 ? (
            <div className="p-12 text-center text-xs text-[#68758A]">
              No unread notifications remaining.
            </div>
          ) : (
            list.map((notif) => (
              <div
                key={notif.id}
                className={`p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:bg-[#F8FAFD] ${
                  !notif.read ? 'bg-[#EAF3FF]/30' : ''
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-[#68758A]">
                    <span className="font-semibold text-[#2864D8]">
                      {notif.category}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{notif.timestamp}</span>
                    {!notif.read && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="font-semibold text-[#142B4F]">Unread</span>
                      </>
                    )}
                  </div>
                  <h3 className="font-display text-sm sm:text-base font-bold text-[#182334]">
                    {notif.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#68758A] leading-relaxed max-w-2xl">
                    {notif.message}
                  </p>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  {!notif.read && (
                    <button
                      type="button"
                      onClick={() => onMarkNotificationRead(notif.id)}
                      className="btn-premium-secondary px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-xs font-medium text-[#68758A] hover:text-[#182334]"
                    >
                      Mark Read
                    </button>
                  )}
                  {notif.relatedOpportunityId ? (
                    <button
                      type="button"
                      onClick={() => {
                        onMarkNotificationRead(notif.id);
                        onViewDetails(notif.relatedOpportunityId!);
                      }}
                      className="btn-premium-primary px-4 py-2 rounded-lg bg-[#142B4F] text-white text-xs font-semibold hover:bg-[#2864D8]"
                    >
                      Inspect Opportunity →
                    </button>
                  ) : notif.targetPage ? (
                    <button
                      type="button"
                      onClick={() => {
                        onMarkNotificationRead(notif.id);
                        onNavigate(notif.targetPage!);
                      }}
                      className="btn-premium-primary px-4 py-2 rounded-lg bg-[#142B4F] text-white text-xs font-semibold hover:bg-[#2864D8]"
                    >
                      Open View →
                    </button>
                  ) : null}
                </div>
              </div>
            ))
          )}
        </div>
      </RevealOnScroll>
    </div>
  );
};
