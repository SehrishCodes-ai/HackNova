import React, { useState } from 'react';
import {
  BarChart3,
  Database,
  PlusCircle,
  ShieldCheck,
  CalendarClock,
  Users,
  FileSpreadsheet,
  Search,
  Edit3,
  Archive,
  Download,
  Menu,
  X,
  Home,
} from 'lucide-react';
import {
  PageId,
  Opportunity,
  OpportunityCategory,
  EducationLevel,
  VerificationStatus,
  ApplicationRecord,
} from '../types';
import { ScholarBridgeLogo, VerificationIndicator } from './BrandMark';
import {
  ThemeToggle,
  RevealOnScroll,
  AnimatedCounter,
} from './MotionPrimitives';

interface AdminWorkspaceProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  opportunities: Opportunity[];
  applications: ApplicationRecord[];
  editingOpportunityId: string | null;
  onStartEditOpportunity: (id: string | null) => void;
  onSaveOpportunity: (opp: Opportunity, isEdit: boolean) => void;
  onUpdateVerificationStatus: (id: string, status: VerificationStatus) => void;
  onToggleArchiveOpportunity: (id: string) => void;
  onLogout: () => void;
}

export const AdminWorkspace: React.FC<AdminWorkspaceProps> = ({
  currentPage,
  onNavigate,
  opportunities,
  applications,
  editingOpportunityId,
  onStartEditOpportunity,
  onSaveOpportunity,
  onUpdateVerificationStatus,
  onToggleArchiveOpportunity,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pendingCount = opportunities.filter(
    (o) => o.verificationStatus === 'Pending Review' && !o.archived
  ).length;

  const expiringCount = opportunities.filter(
    (o) => o.daysRemaining >= 0 && o.daysRemaining <= 20 && !o.archived
  ).length;

  const sidebarItems: {
    id: PageId;
    label: string;
    icon: React.FC<{ className?: string }>;
    badgeCount?: number;
  }[] = [
    { id: 'admin-dashboard', label: 'Overview', icon: BarChart3 },
    {
      id: 'manage-opportunities',
      label: 'Manage Opportunities',
      icon: Database,
      badgeCount: opportunities.filter((o) => !o.archived).length,
    },
    { id: 'add-edit-opportunity', label: 'Add Opportunity', icon: PlusCircle },
    {
      id: 'verification-centre',
      label: 'Verification Centre',
      icon: ShieldCheck,
      badgeCount: pendingCount > 0 ? pendingCount : undefined,
    },
    {
      id: 'expiry-management',
      label: 'Expiry Management',
      icon: CalendarClock,
      badgeCount: expiringCount > 0 ? expiringCount : undefined,
    },
    { id: 'student-engagement', label: 'Student Engagement', icon: Users },
    { id: 'analytics-reports', label: 'Analytics & Reports', icon: FileSpreadsheet },
  ];

  const handleNav = (page: PageId) => {
    if (page === 'add-edit-opportunity') {
      onStartEditOpportunity(null);
    }
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  const pageLabels: Record<string, string> = {
    'admin-dashboard': 'Institutional Governance Overview',
    'manage-opportunities': 'Manage Opportunities Catalogue',
    'add-edit-opportunity': editingOpportunityId
      ? 'Edit Opportunity Record'
      : 'Add New Opportunity',
    'verification-centre': 'Source Verification Centre',
    'expiry-management': 'Cycle Expiry Management',
    'student-engagement': 'Student Discovery & Engagement Telemetry',
    'application-analytics': 'Application Funnel Analytics',
    'analytics-reports': 'Analytics & Reports',
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFD] text-[#182334]">
      {/* Visually Distinct Deep Midnight Navy Admin Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-[#142B4F] text-white z-30">
        <div className="h-20 px-6 flex items-center justify-between border-b border-white/10">
          <ScholarBridgeLogo variant="light" onClick={() => handleNav('landing')} />
        </div>

        <div className="px-6 py-4 border-b border-white/10 bg-[#0F213D]">
          <span className="block font-mono text-[10px] tracking-wider uppercase text-[#93C5FD]">
            INSTITUTIONAL ADMIN CONSOLE
          </span>
          <span className="block font-display text-xs font-bold text-white mt-1">
            Verification & Governance Desk
          </span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto" aria-label="Admin Sidebar">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              currentPage === item.id ||
              (currentPage === 'application-analytics' &&
                item.id === 'analytics-reports');
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all duration-200 whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-[#2864D8] text-white shadow-2xs'
                    : 'text-slate-300 hover:text-white hover:bg-white/10 hover:translate-x-0.5'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-white' : 'text-[#93C5FD]'
                    }`}
                  />
                  <span>{item.label}</span>
                </span>
                {typeof item.badgeCount === 'number' && (
                  <span className="font-mono text-[11px] text-slate-200 tabular-nums">
                    {item.badgeCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-1.5 bg-[#0F213D]">
          <button
            type="button"
            onClick={() => handleNav('landing')}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Home className="w-3.5 h-3.5 text-[#93C5FD]" />
            <span>Public Landing Page</span>
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-300 hover:text-white hover:bg-rose-500/20 transition-colors"
          >
            <span>Sign Out of Admin Console</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] bg-[#142B4F] text-white h-full flex flex-col z-10">
            <div className="h-20 px-6 flex items-center justify-between border-b border-white/10">
              <ScholarBridgeLogo variant="light" onClick={() => handleNav('landing')} />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg text-slate-300 hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNav(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold ${
                      isActive ? 'bg-[#2864D8] text-white' : 'text-slate-300'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="p-4 border-t border-white/10 space-y-2">
              <button
                type="button"
                onClick={() => handleNav('landing')}
                className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-medium text-slate-300"
              >
                ← Public Landing Page
              </button>
              <button
                type="button"
                onClick={onLogout}
                className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-300"
              >
                Sign Out of Admin Console
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-20 h-20 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 lg:px-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Toggle admin menu"
              className="lg:hidden p-2 rounded-lg text-[#142B4F] hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-[#68758A] truncate">
              <span className="hidden sm:inline">Admin Console</span>
              <span aria-hidden="true" className="hidden sm:inline">/</span>
              <span className="font-semibold text-[#142B4F] truncate">
                {pageLabels[currentPage] || 'Admin Workspace'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <ThemeToggle />

            <button
              type="button"
              onClick={() => handleNav('verification-centre')}
              className="btn-premium-secondary px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-[#142B4F] hover:border-[#2864D8] whitespace-nowrap shrink-0"
            >
              Verification Queue ({pendingCount})
            </button>
            <button
              type="button"
              onClick={() => {
                onStartEditOpportunity(null);
                onNavigate('add-edit-opportunity');
              }}
              className="btn-premium-primary px-4 py-2.5 rounded-lg text-xs font-semibold bg-[#142B4F] text-white hover:bg-[#2864D8] whitespace-nowrap shrink-0"
            >
              + Add Opportunity
            </button>
          </div>
        </header>

        <main className="flex-1 px-4 sm:px-8 lg:px-10 py-8 lg:py-10 max-w-[1200px] w-full mx-auto">
          {currentPage === 'admin-dashboard' && (
            <AdminDashboardView
              opportunities={opportunities}
              applications={applications}
              onNavigate={handleNav}
            />
          )}

          {currentPage === 'manage-opportunities' && (
            <ManageOpportunitiesView
              opportunities={opportunities}
              onEdit={(id) => {
                onStartEditOpportunity(id);
                onNavigate('add-edit-opportunity');
              }}
              onToggleArchive={onToggleArchiveOpportunity}
              onUpdateVerification={onUpdateVerificationStatus}
              onAddNew={() => {
                onStartEditOpportunity(null);
                onNavigate('add-edit-opportunity');
              }}
            />
          )}

          {currentPage === 'add-edit-opportunity' && (
            <AddEditOpportunityView
              existingOpportunity={
                editingOpportunityId
                  ? opportunities.find((o) => o.id === editingOpportunityId) || null
                  : null
              }
              onSave={(opp, isEdit) => {
                onSaveOpportunity(opp, isEdit);
                onNavigate('manage-opportunities');
              }}
              onCancel={() => onNavigate('manage-opportunities')}
            />
          )}

          {currentPage === 'verification-centre' && (
            <VerificationCentreView
              opportunities={opportunities}
              onUpdateVerification={onUpdateVerificationStatus}
              onEdit={(id) => {
                onStartEditOpportunity(id);
                onNavigate('add-edit-opportunity');
              }}
            />
          )}

          {(currentPage === 'expiry-management' ||
            currentPage === 'student-engagement' ||
            currentPage === 'application-analytics' ||
            currentPage === 'analytics-reports') && (
            <AnalyticsAndGovernanceViews
              activeSection={currentPage}
              opportunities={opportunities}
              applications={applications}
              onUpdateVerification={onUpdateVerificationStatus}
              onNavigate={handleNav}
            />
          )}
        </main>
      </div>
    </div>
  );
};

// ============================================================================
// 13. ADMIN DASHBOARD VIEW
// ============================================================================
const AdminDashboardView: React.FC<{
  opportunities: Opportunity[];
  applications: ApplicationRecord[];
  onNavigate: (page: PageId) => void;
}> = ({ opportunities, onNavigate }) => {
  const activeOpps = opportunities.filter((o) => !o.archived);
  const verifiedCount = activeOpps.filter(
    (o) => o.verificationStatus === 'Verified'
  ).length;
  const expiringCount = activeOpps.filter(
    (o) => o.daysRemaining >= 0 && o.daysRemaining <= 20
  ).length;
  const totalViews = activeOpps.reduce((sum, o) => sum + o.viewsCount, 0);
  const totalSaves = activeOpps.reduce((sum, o) => sum + o.savesCount, 0);
  const verifiedPct = Math.round(
    (verifiedCount / Math.max(1, activeOpps.length)) * 100
  );

  const categoryBreakdown: { label: OpportunityCategory; count: number; color: string }[] = [
    {
      label: 'Merit Scholarship',
      count: activeOpps.filter((o) => o.category === 'Merit Scholarship').length,
      color: '#142B4F',
    },
    {
      label: 'Need-Based Grant',
      count: activeOpps.filter((o) => o.category === 'Need-Based Grant').length,
      color: '#2864D8',
    },
    {
      label: 'Fee Assistance',
      count: activeOpps.filter((o) => o.category === 'Fee Assistance').length,
      color: '#3B82F6',
    },
    {
      label: 'Research Internship',
      count: activeOpps.filter((o) => o.category === 'Research Internship').length,
      color: '#60A5FA',
    },
    {
      label: 'Institutional Fellowship',
      count: activeOpps.filter((o) => o.category === 'Institutional Fellowship').length,
      color: '#93C5FD',
    },
  ];

  const monthlyTrend = [
    { month: 'May', views: 2100, saves: 490 },
    { month: 'Jun', views: 2650, saves: 610 },
    { month: 'Jul', views: 2980, saves: 720 },
    { month: 'Aug', views: 3420, saves: 890 },
    { month: 'Sep', views: 4100, saves: 1080 },
    { month: 'Oct', views: 4890, saves: 1340 },
  ];

  const funnelStages = [
    { stage: 'Not Started', count: 312 },
    { stage: 'Preparing Documents', count: 428 },
    { stage: 'Submitted', count: 519 },
    { stage: 'Under Review', count: 244 },
    { stage: 'Approved', count: 118 },
  ];

  return (
    <div className="space-y-8">
      <RevealOnScroll>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#142B4F]">
              Administrative Governance Overview
            </h1>
            <p className="text-sm text-[#68758A] mt-2 leading-relaxed">
              Real-time registry verification metrics, student discovery engagement, and application progress.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('verification-centre')}
              className="btn-premium-secondary px-4 py-2.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-[#142B4F] hover:border-[#2864D8]"
            >
              Open Verification Centre
            </button>
            <button
              type="button"
              onClick={() => onNavigate('analytics-reports')}
              className="btn-premium-primary px-4 py-2.5 rounded-lg text-xs font-semibold bg-[#2864D8] text-white hover:bg-[#142B4F]"
            >
              Export Audit Report
            </button>
          </div>
        </div>
      </RevealOnScroll>

      {/* 6 Required Dashboard KPI Cards in a Balanced 3-Column Grid with Animated Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <RevealOnScroll delayMs={40}>
          <div className="card-interactive h-full bg-white border border-slate-200/90 rounded-xl p-6 flex flex-col justify-between">
            <span className="text-xs font-semibold text-[#68758A]">Total Opportunities</span>
            <p className="font-mono text-2xl sm:text-3xl font-bold text-[#142B4F] mt-3 tabular-nums">
              <AnimatedCounter value={activeOpps.length} />
            </p>
            <span className="text-xs text-[#68758A] mt-2">Active sample catalogue</span>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delayMs={80}>
          <div className="card-interactive h-full bg-white border border-slate-200/90 rounded-xl p-6 flex flex-col justify-between">
            <span className="text-xs font-semibold text-[#68758A]">Verified Opportunities</span>
            <p className="font-mono text-2xl sm:text-3xl font-bold text-emerald-700 mt-3 tabular-nums">
              <AnimatedCounter value={verifiedCount} />
            </p>
            <span className="text-xs text-emerald-700 font-medium mt-2">
              <AnimatedCounter value={verifiedPct} suffix="% source audited" />
            </span>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delayMs={120}>
          <div className="card-interactive h-full bg-white border border-slate-200/90 rounded-xl p-6 flex flex-col justify-between">
            <span className="text-xs font-semibold text-[#68758A]">Expiring Opportunities</span>
            <p className="font-mono text-2xl sm:text-3xl font-bold text-amber-700 mt-3 tabular-nums">
              <AnimatedCounter value={expiringCount} />
            </p>
            <span className="text-xs text-amber-700 font-medium mt-2">Closing ≤ 20 days</span>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delayMs={160}>
          <div className="card-interactive h-full bg-white border border-slate-200/90 rounded-xl p-6 flex flex-col justify-between">
            <span className="text-xs font-semibold text-[#68758A]">Registered Students</span>
            <p className="font-mono text-2xl sm:text-3xl font-bold text-[#142B4F] mt-3 tabular-nums">
              <AnimatedCounter value={1482} />
            </p>
            <span className="text-xs text-[#2864D8] font-medium mt-2">
              +<AnimatedCounter value={14} suffix="% vs prior month" />
            </span>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delayMs={200}>
          <div className="card-interactive h-full bg-white border border-slate-200/90 rounded-xl p-6 flex flex-col justify-between">
            <span className="text-xs font-semibold text-[#68758A]">Total Views</span>
            <p className="font-mono text-2xl sm:text-3xl font-bold text-[#142B4F] mt-3 tabular-nums">
              <AnimatedCounter value={totalViews} />
            </p>
            <span className="text-xs text-[#68758A] mt-2">Catalogue impressions</span>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delayMs={240}>
          <div className="card-interactive h-full bg-white border border-slate-200/90 rounded-xl p-6 flex flex-col justify-between">
            <span className="text-xs font-semibold text-[#68758A]">Total Saves</span>
            <p className="font-mono text-2xl sm:text-3xl font-bold text-[#2864D8] mt-3 tabular-nums">
              <AnimatedCounter value={totalSaves} />
            </p>
            <span className="text-xs text-[#68758A] mt-2">Student bookmarks</span>
          </div>
        </RevealOnScroll>
      </div>

      {/* 3 Required Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Chart 1: Views and Saves Trends (7 cols) */}
        <RevealOnScroll className="lg:col-span-7" delayMs={80}>
          <section className="card-interactive h-full bg-white border border-slate-200/90 rounded-xl p-6 sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div>
                <h2 className="font-display text-base font-bold text-[#142B4F]">
                  Views and Saves Trends (6-Month Window)
                </h2>
                <p className="text-xs text-[#68758A] mt-1">
                  Monthly opportunity detail views vs. student shortlist saves
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="inline-flex items-center gap-1.5 font-medium text-[#142B4F]">
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#142B4F]" />
                  Total Views
                </span>
                <span className="inline-flex items-center gap-1.5 font-medium text-[#2864D8]">
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#2864D8]" />
                  Saved Bookmarks
                </span>
              </div>
            </div>

            <div className="grid grid-cols-6 gap-4 items-end h-56 pt-4 px-2 border-b border-slate-200">
              {monthlyTrend.map((m) => {
                const viewsHeightPct = Math.round((m.views / 5000) * 100);
                const savesHeightPct = Math.round((m.saves / 5000) * 100);
                return (
                  <div key={m.month} className="flex flex-col items-center h-full justify-end">
                    <div className="w-full flex items-end justify-center gap-2 h-44">
                      <div
                        className="w-4 sm:w-5 bg-[#142B4F] rounded-t-sm transition-all duration-500 hover:opacity-85"
                        style={{ height: `${viewsHeightPct}%` }}
                        title={`${m.month} Views: ${m.views}`}
                      />
                      <div
                        className="w-4 sm:w-5 bg-[#2864D8] rounded-t-sm transition-all duration-500 hover:opacity-85"
                        style={{ height: `${savesHeightPct}%` }}
                        title={`${m.month} Saves: ${m.saves}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-6 gap-4 pt-3 text-center">
              {monthlyTrend.map((m) => (
                <div key={m.month}>
                  <span className="block text-xs font-semibold text-[#182334]">{m.month}</span>
                  <span className="block font-mono text-[10px] text-[#68758A] tabular-nums mt-0.5">
                    {m.views} / {m.saves}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </RevealOnScroll>

        {/* Chart 2: Opportunity Category Distribution (5 cols) */}
        <RevealOnScroll className="lg:col-span-5" delayMs={150}>
          <section className="card-interactive h-full bg-white border border-slate-200/90 rounded-xl p-6 sm:p-7 flex flex-col justify-between">
            <div>
              <h2 className="font-display text-base font-bold text-[#142B4F]">
                Opportunity Category Distribution
              </h2>
              <p className="text-xs text-[#68758A] mt-1 mb-6">
                Breakdown across scholarship, grant, and fellowship types
              </p>

              <div className="space-y-4">
                {categoryBreakdown.map((cat) => {
                  const pct = Math.round(
                    (cat.count / Math.max(1, activeOpps.length)) * 100
                  );
                  return (
                    <div key={cat.label} className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-[#182334]">{cat.label}</span>
                        <span className="font-mono font-semibold text-[#142B4F] tabular-nums">
                          <AnimatedCounter value={cat.count} /> (
                          <AnimatedCounter value={pct} suffix="%" />)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.max(10, pct)}%`,
                            backgroundColor: cat.color,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-5 mt-6 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[#68758A]">Catalogue balance verified</span>
              <button
                type="button"
                onClick={() => onNavigate('manage-opportunities')}
                className="font-semibold text-[#2864D8] hover:underline"
              >
                Manage Categories →
              </button>
            </div>
          </section>
        </RevealOnScroll>
      </div>

      {/* Chart 3: Application Progress Distribution across Student Cohort */}
      <RevealOnScroll delayMs={100}>
        <section className="card-interactive bg-white border border-slate-200/90 rounded-xl p-6 sm:p-7">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="font-display text-base font-bold text-[#142B4F]">
                Student Application Progress Funnel
              </h2>
              <p className="text-xs text-[#68758A] mt-1">
                Aggregate student progression from initial shortlist to institutional approval
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('application-analytics')}
              className="text-xs font-semibold text-[#2864D8] hover:underline"
            >
              View Detailed Funnel Analytics →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {funnelStages.map((item, idx) => (
              <div
                key={item.stage}
                className="card-interactive p-5 rounded-xl bg-[#F8FAFD] border border-slate-200/80 flex flex-col justify-between"
              >
                <div>
                  <span className="font-mono text-[10px] text-[#68758A]">
                    STAGE 0{idx + 1}
                  </span>
                  <p className="font-display text-xs font-bold text-[#182334] mt-1">
                    {item.stage}
                  </p>
                </div>
                <div className="mt-4">
                  <p className="font-mono text-2xl font-bold text-[#142B4F] tabular-nums">
                    <AnimatedCounter value={item.count} />
                  </p>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2.5 overflow-hidden">
                    <div
                      className="h-full bg-[#2864D8] transition-all duration-500"
                      style={{ width: `${Math.min(100, (item.count / 550) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </RevealOnScroll>
    </div>
  );
};

// ============================================================================
// 14. MANAGE OPPORTUNITIES DATA TABLE VIEW
// ============================================================================
const ManageOpportunitiesView: React.FC<{
  opportunities: Opportunity[];
  onEdit: (id: string) => void;
  onToggleArchive: (id: string) => void;
  onUpdateVerification: (id: string, status: VerificationStatus) => void;
  onAddNew: () => void;
}> = ({
  opportunities,
  onEdit,
  onToggleArchive,
  onUpdateVerification,
  onAddNew,
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showArchived, setShowArchived] = useState(false);

  const filtered = opportunities.filter((o) => {
    if (!showArchived && o.archived) return false;
    const matchesSearch =
      !search.trim() ||
      o.title.toLowerCase().includes(search.toLowerCase()) ||
      o.provider.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === 'All' || o.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      <RevealOnScroll>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#142B4F]">
              Manage Opportunities
            </h1>
            <p className="text-sm text-[#68758A] mt-2 leading-relaxed">
              Search, edit, verify, or archive scholarship and internship records in the institutional catalogue.
            </p>
          </div>

          <button
            type="button"
            onClick={onAddNew}
            className="btn-premium-primary px-5 py-2.5 rounded-lg text-xs font-semibold bg-[#142B4F] text-white hover:bg-[#2864D8] whitespace-nowrap shrink-0"
          >
            + Add New Opportunity
          </button>
        </div>
      </RevealOnScroll>

      {/* Table Filter Bar */}
      <RevealOnScroll delayMs={50}>
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#68758A] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter table by opportunity name or provider..."
              className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs font-medium bg-white"
            >
              <option value="All">All Categories</option>
              <option value="Merit Scholarship">Merit Scholarship</option>
              <option value="Need-Based Grant">Need-Based Grant</option>
              <option value="Fee Assistance">Fee Assistance</option>
              <option value="Research Internship">Research Internship</option>
              <option value="Institutional Fellowship">Institutional Fellowship</option>
            </select>

            <label className="inline-flex items-center gap-2 text-xs text-[#68758A] cursor-pointer">
              <input
                type="checkbox"
                checked={showArchived}
                onChange={(e) => setShowArchived(e.target.checked)}
                className="rounded border-slate-300 text-[#2864D8]"
              />
              <span>Show Archived</span>
            </label>
          </div>
        </div>
      </RevealOnScroll>

      {/* High-Density Data Table */}
      <RevealOnScroll delayMs={100}>
        <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-[#F8FAFD] text-[11px] font-bold uppercase tracking-wider text-[#68758A]">
                  <th className="py-4 px-5">Opportunity Name & Provider</th>
                  <th className="py-4 px-5">Category</th>
                  <th className="py-4 px-5 text-right">Annual Value</th>
                  <th className="py-4 px-5">Deadline</th>
                  <th className="py-4 px-5">Verification Status</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filtered.map((opp) => (
                  <tr
                    key={opp.id}
                    className={`hover:bg-[#F8FAFD] transition-colors ${
                      opp.archived ? 'opacity-60' : ''
                    }`}
                  >
                    <td className="py-4 px-5 max-w-xs">
                      <p className="font-display font-bold text-[#182334] truncate">
                        {opp.title}
                      </p>
                      <p className="text-[11px] text-[#68758A] truncate mt-1">
                        {opp.provider}
                      </p>
                    </td>
                    <td className="py-4 px-5 text-[#182334] whitespace-nowrap">
                      {opp.category}
                    </td>
                    <td className="py-4 px-5 text-right font-mono font-semibold text-[#142B4F] tabular-nums whitespace-nowrap">
                      <AnimatedCounter value={opp.annualValueNumeric} prefix="$" />
                    </td>
                    <td className="py-4 px-5 font-mono text-[#182334] tabular-nums whitespace-nowrap">
                      {opp.deadline}
                    </td>
                    <td className="py-4 px-5 whitespace-nowrap">
                      <VerificationIndicator status={opp.verificationStatus} />
                    </td>
                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        {opp.verificationStatus !== 'Verified' && (
                          <button
                            type="button"
                            onClick={() => onUpdateVerification(opp.id, 'Verified')}
                            className="btn-premium-secondary px-3 py-1.5 rounded-lg border border-emerald-200 text-emerald-700 hover:bg-emerald-50 font-semibold"
                          >
                            Verify
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => onEdit(opp.id)}
                          className="btn-premium-secondary inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-[#142B4F] hover:border-[#2864D8] font-semibold"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onToggleArchive(opp.id)}
                          className="btn-premium-secondary inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-[#68758A] hover:text-rose-700 hover:border-rose-200 font-medium"
                        >
                          <Archive className="w-3 h-3" />
                          <span>{opp.archived ? 'Restore' : 'Archive'}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </RevealOnScroll>
    </div>
  );
};

// ============================================================================
// 15. ADD / EDIT OPPORTUNITY FORM VIEW
// ============================================================================
const AddEditOpportunityView: React.FC<{
  existingOpportunity: Opportunity | null;
  onSave: (opp: Opportunity, isEdit: boolean) => void;
  onCancel: () => void;
}> = ({ existingOpportunity, onSave, onCancel }) => {
  const [title, setTitle] = useState(
    existingOpportunity?.title || ''
  );
  const [provider, setProvider] = useState(
    existingOpportunity?.provider || ''
  );
  const [description, setDescription] = useState(
    existingOpportunity?.description || ''
  );
  const [category, setCategory] = useState<OpportunityCategory>(
    existingOpportunity?.category || 'Merit Scholarship'
  );
  const [educationLevel, setEducationLevel] = useState<EducationLevel>(
    existingOpportunity?.educationLevels[0] || 'Undergraduate'
  );
  const [location, setLocation] = useState(
    existingOpportunity?.location || 'National'
  );
  const [minGpa, setMinGpa] = useState(
    String(existingOpportunity?.minGpa ?? '3.40')
  );
  const [maxIncome, setMaxIncome] = useState(
    String(existingOpportunity?.maxHouseholdIncome ?? '60000')
  );
  const [benefitsSummary, setBenefitsSummary] = useState(
    existingOpportunity?.benefitsSummary || '$5,000 / year tuition & book grant'
  );
  const [annualValue, setAnnualValue] = useState(
    String(existingOpportunity?.annualValueNumeric ?? '5000')
  );
  const [requiredDocs, setRequiredDocs] = useState(
    existingOpportunity?.requiredDocuments.join(', ') ||
      'Official University Transcript, Household Income Certificate, Academic Reference Letter'
  );
  const [deadline, setDeadline] = useState(
    existingOpportunity?.deadline || '2026-12-10'
  );
  const [officialSourceUrl, setOfficialSourceUrl] = useState(
    existingOpportunity?.officialSourceUrl ||
      'https://sample-registry.scholarbridge.example.org/new-sample-2026'
  );
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !provider.trim() || !officialSourceUrl.trim()) {
      setError('Please complete Opportunity Title, Provider, and Official Source URL.');
      return;
    }

    const formattedTitle = title.includes('Sample')
      ? title.trim()
      : `${title.trim()} (Illustrative Sample)`;

    const newOpp: Opportunity = {
      id: existingOpportunity?.id || `opp-${Date.now()}`,
      title: formattedTitle,
      isIllustrativeSample: true,
      provider: provider.trim(),
      providerType: existingOpportunity?.providerType || 'Foundation',
      category,
      educationLevels: [educationLevel],
      location: location.trim(),
      benefitsSummary: benefitsSummary.trim(),
      annualValueNumeric: parseFloat(annualValue) || 5000,
      coverageDetails: [benefitsSummary.trim()],
      deadline,
      daysRemaining: 32,
      verificationStatus: existingOpportunity?.verificationStatus || 'Verified',
      verifiedDate: '2026-10-30',
      verifiedBy: 'Admin Console Entry · Audit #SB-940',
      officialSourceUrl: officialSourceUrl.trim(),
      description:
        description.trim() ||
        'Illustrative sample opportunity added via the ScholarBridge Institutional Admin Console.',
      requiredDocuments: requiredDocs
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      viewsCount: existingOpportunity?.viewsCount ?? 120,
      savesCount: existingOpportunity?.savesCount ?? 24,
      applicationsCount: existingOpportunity?.applicationsCount ?? 8,
      addedDate: existingOpportunity?.addedDate || '2026-10-30',
      minGpa: parseFloat(minGpa) || 3.0,
      maxHouseholdIncome: parseFloat(maxIncome) || undefined,
      allowedMajors: ['All'],
    };

    onSave(newOpp, Boolean(existingOpportunity));
  };

  return (
    <div className="space-y-8">
      <RevealOnScroll>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#142B4F]">
              {existingOpportunity ? 'Edit Opportunity Record' : 'Add New Opportunity'}
            </h1>
            <p className="text-sm text-[#68758A] mt-2 leading-relaxed">
              Publish or update a verified opportunity with structured eligibility criteria and official source attribution.
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="btn-premium-secondary px-4 py-2.5 rounded-lg border border-slate-300 text-xs font-semibold text-[#68758A] hover:text-[#182334]"
          >
            Cancel
          </button>
        </div>
      </RevealOnScroll>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
          {error}
        </div>
      )}

      <RevealOnScroll delayMs={60}>
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-slate-200/90 rounded-xl p-6 sm:p-8 space-y-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-[#182334] mb-2">
                Opportunity Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., National Quantum Computing Undergraduate Grant"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#182334] mb-2">
                Provider / Sponsoring Institution *
              </label>
              <input
                type="text"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                placeholder="e.g., Quantum Research Trust (Sample Provider)"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#182334] mb-2">
              Opportunity Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the purpose, target cohort, and institutional scope of the opportunity..."
              className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-semibold text-[#182334] mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as OpportunityCategory)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm bg-white"
              >
                <option value="Merit Scholarship">Merit Scholarship</option>
                <option value="Need-Based Grant">Need-Based Grant</option>
                <option value="Fee Assistance">Fee Assistance</option>
                <option value="Research Internship">Research Internship</option>
                <option value="Institutional Fellowship">Institutional Fellowship</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#182334] mb-2">
                Education Level
              </label>
              <select
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value as EducationLevel)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm bg-white"
              >
                <option value="High School Senior">High School Senior</option>
                <option value="Undergraduate">Undergraduate</option>
                <option value="Postgraduate">Postgraduate</option>
                <option value="Doctoral">Doctoral</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#182334] mb-2">
                Location / Geographic Scope
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm"
              />
            </div>
          </div>

          {/* Eligibility & Financial Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-[#182334] mb-2">
                Minimum GPA Requirement
              </label>
              <input
                type="number"
                step="0.05"
                min="0"
                max="4.0"
                value={minGpa}
                onChange={(e) => setMinGpa(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm font-mono tabular-nums"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#182334] mb-2">
                Max Household Income ($)
              </label>
              <input
                type="number"
                step="1000"
                value={maxIncome}
                onChange={(e) => setMaxIncome(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm font-mono tabular-nums"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#182334] mb-2">
                Annual Support Value ($)
              </label>
              <input
                type="number"
                step="100"
                value={annualValue}
                onChange={(e) => setAnnualValue(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm font-mono tabular-nums"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#182334] mb-2">
                Application Deadline
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-[#182334] mb-2">
                Benefits Summary
              </label>
              <input
                type="text"
                value={benefitsSummary}
                onChange={(e) => setBenefitsSummary(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#182334] mb-2">
                Required Documents (Comma-separated)
              </label>
              <input
                type="text"
                value={requiredDocs}
                onChange={(e) => setRequiredDocs(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#182334] mb-2">
              Official Source Registry URL *
            </label>
            <input
              type="url"
              value={officialSourceUrl}
              onChange={(e) => setOfficialSourceUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm font-mono"
              required
            />
          </div>

          <div className="pt-6 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="btn-premium-secondary px-5 py-2.5 rounded-lg border border-slate-300 text-xs font-semibold text-[#68758A] hover:text-[#182334]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-premium-primary px-6 py-2.5 rounded-lg bg-[#142B4F] text-white text-xs font-semibold hover:bg-[#2864D8]"
            >
              {existingOpportunity ? 'Save Opportunity Changes' : 'Publish Verified Opportunity'}
            </button>
          </div>
        </form>
      </RevealOnScroll>
    </div>
  );
};

// ============================================================================
// 16. VERIFICATION CENTRE VIEW
// ============================================================================
const VerificationCentreView: React.FC<{
  opportunities: Opportunity[];
  onUpdateVerification: (id: string, status: VerificationStatus) => void;
  onEdit: (id: string) => void;
}> = ({ opportunities, onUpdateVerification, onEdit }) => {
  const [activeTab, setActiveTab] = useState<VerificationStatus>('Pending Review');

  const counts = {
    'Pending Review': opportunities.filter(
      (o) => o.verificationStatus === 'Pending Review'
    ).length,
    Verified: opportunities.filter((o) => o.verificationStatus === 'Verified').length,
    Expired: opportunities.filter((o) => o.verificationStatus === 'Expired').length,
  };

  const list = opportunities.filter((o) => o.verificationStatus === activeTab);

  return (
    <div className="space-y-8">
      <RevealOnScroll>
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#142B4F]">
            Verification Centre
          </h1>
          <p className="text-sm text-[#68758A] mt-2 leading-relaxed">
            Audit primary institutional circulars, validate official source URLs, and manage verification statuses.
          </p>
        </div>
      </RevealOnScroll>

      {/* Functional Verification Status Tabs */}
      <RevealOnScroll delayMs={40}>
        <div className="flex items-center gap-2 p-1.5 bg-white border border-slate-200 rounded-xl w-fit">
          {(['Pending Review', 'Verified', 'Expired'] as VerificationStatus[]).map(
            (tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === tab
                    ? 'bg-[#142B4F] text-white'
                    : 'text-[#68758A] hover:text-[#182334]'
                }`}
              >
                {tab === 'Pending Review'
                  ? `Pending Opportunities (${counts['Pending Review']})`
                  : tab === 'Verified'
                  ? `Verified Opportunities (${counts.Verified})`
                  : `Expired Opportunities (${counts.Expired})`}
              </button>
            )
          )}
        </div>
      </RevealOnScroll>

      <div className="space-y-4">
        {list.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-xs text-[#68758A]">
            No opportunities currently in the {activeTab} queue.
          </div>
        ) : (
          list.map((opp, idx) => (
            <RevealOnScroll key={opp.id} delayMs={idx * 70}>
              <div className="card-interactive bg-white border border-slate-200/90 rounded-xl p-6 sm:p-7 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#68758A]">
                    <VerificationIndicator status={opp.verificationStatus} />
                    <span aria-hidden="true">·</span>
                    <span>Verification Date: {opp.verifiedDate}</span>
                    <span aria-hidden="true">·</span>
                    <span>{opp.verifiedBy}</span>
                  </div>

                  <h3 className="font-display text-lg font-bold text-[#142B4F]">
                    {opp.title}
                  </h3>
                  <p className="text-xs text-[#68758A]">
                    Provider: <strong className="text-[#182334]">{opp.provider}</strong> · Deadline:{' '}
                    <span className="font-mono tabular-nums">{opp.deadline}</span>
                  </p>
                  <div className="text-xs font-mono text-[#2864D8] break-all">
                    Source URL: {opp.officialSourceUrl}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  {opp.verificationStatus !== 'Verified' && (
                    <button
                      type="button"
                      onClick={() => onUpdateVerification(opp.id, 'Verified')}
                      className="btn-premium-primary px-4 py-2.5 rounded-lg text-xs font-semibold bg-emerald-700 text-white hover:bg-emerald-800"
                    >
                      Approve & Mark Verified
                    </button>
                  )}
                  {opp.verificationStatus !== 'Pending Review' && (
                    <button
                      type="button"
                      onClick={() => onUpdateVerification(opp.id, 'Pending Review')}
                      className="btn-premium-secondary px-4 py-2.5 rounded-lg text-xs font-semibold border border-amber-300 text-amber-800 bg-amber-50 hover:bg-amber-100"
                    >
                      Flag for Re-verification
                    </button>
                  )}
                  {opp.verificationStatus !== 'Expired' && (
                    <button
                      type="button"
                      onClick={() => onUpdateVerification(opp.id, 'Expired')}
                      className="btn-premium-secondary px-4 py-2.5 rounded-lg text-xs font-semibold border border-slate-200 text-[#68758A] hover:text-rose-700"
                    >
                      Mark Cycle Expired
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onEdit(opp.id)}
                    className="btn-premium-secondary px-4 py-2.5 rounded-lg text-xs font-semibold border border-slate-200 text-[#142B4F] hover:border-[#2864D8]"
                  >
                    Edit Record
                  </button>
                </div>
              </div>
            </RevealOnScroll>
          ))
        )}
      </div>
    </div>
  );
};

// ============================================================================
// 17. ANALYTICS, EXPIRY MANAGEMENT, STUDENT ENGAGEMENT & REPORTS VIEWS
// ============================================================================
const AnalyticsAndGovernanceViews: React.FC<{
  activeSection: PageId;
  opportunities: Opportunity[];
  applications: ApplicationRecord[];
  onUpdateVerification: (id: string, status: VerificationStatus) => void;
  onNavigate: (page: PageId) => void;
}> = ({ activeSection, opportunities, onUpdateVerification, onNavigate }) => {
  const handleDownloadCsv = () => {
    const headers = [
      'ID',
      'Title',
      'Provider',
      'Category',
      'AnnualValueUSD',
      'Deadline',
      'VerificationStatus',
      'Views',
      'Saves',
      'Applications',
    ];
    const rows = opportunities.map((o) => [
      o.id,
      `"${o.title.replace(/"/g, '""')}"`,
      `"${o.provider.replace(/"/g, '""')}"`,
      o.category,
      o.annualValueNumeric,
      o.deadline,
      o.verificationStatus,
      o.viewsCount,
      o.savesCount,
      o.applicationsCount,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'scholarbridge_institutional_report_2026.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      <RevealOnScroll>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#142B4F]">
              {activeSection === 'expiry-management'
                ? 'Cycle Expiry Management'
                : activeSection === 'student-engagement'
                ? 'Student Discovery & Engagement Telemetry'
                : activeSection === 'application-analytics'
                ? 'Application Funnel Analytics'
                : 'Analytics & Institutional Reports'}
            </h1>
            <p className="text-sm text-[#68758A] mt-2 leading-relaxed">
              Comprehensive metrics on scholarship performance, deadline lifecycles, and student conversion rates.
            </p>
          </div>

          <button
            type="button"
            onClick={handleDownloadCsv}
            className="btn-premium-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold bg-[#142B4F] text-white hover:bg-[#2864D8] whitespace-nowrap shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Download CSV Report</span>
          </button>
        </div>
      </RevealOnScroll>

      {/* Sub-navigation bar across the 4 governance & analytics tabs */}
      <RevealOnScroll delayMs={40}>
        <div className="flex items-center gap-2 p-1.5 bg-white border border-slate-200 rounded-xl overflow-x-auto w-fit">
          {[
            { id: 'analytics-reports' as PageId, label: 'All Reports & Exports' },
            { id: 'expiry-management' as PageId, label: 'Expiry Management' },
            { id: 'student-engagement' as PageId, label: 'Student Engagement' },
            { id: 'application-analytics' as PageId, label: 'Application Analytics' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onNavigate(tab.id)}
              className={`px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                activeSection === tab.id
                  ? 'bg-[#142B4F] text-white'
                  : 'text-[#68758A] hover:text-[#182334]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </RevealOnScroll>

      {/* Detailed Performance & Conversion Table */}
      <RevealOnScroll delayMs={90}>
        <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="font-display text-base font-bold text-[#142B4F]">
                Opportunity Engagement, Save-to-Application Conversion & Expiry Ledger
              </h2>
              <p className="text-xs text-[#68758A] mt-1">
                Sorted by deadline proximity and student engagement volume
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-[#F8FAFD] text-[11px] font-bold uppercase tracking-wider text-[#68758A]">
                  <th className="py-4 px-5">Opportunity</th>
                  <th className="py-4 px-5">Deadline Window</th>
                  <th className="py-4 px-5 text-right">Views</th>
                  <th className="py-4 px-5 text-right">Saves</th>
                  <th className="py-4 px-5 text-right">Applications</th>
                  <th className="py-4 px-5 text-right">Save → Apply Rate</th>
                  <th className="py-4 px-5 text-right">Lifecycle Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {opportunities.map((opp) => {
                  const convRate = Math.round(
                    (opp.applicationsCount / Math.max(1, opp.savesCount)) * 100
                  );
                  return (
                    <tr key={opp.id} className="hover:bg-[#F8FAFD] transition-colors">
                      <td className="py-4 px-5 max-w-xs">
                        <p className="font-display font-bold text-[#182334] truncate">
                          {opp.title}
                        </p>
                        <p className="text-[11px] text-[#68758A] truncate mt-1">
                          {opp.category} · {opp.provider}
                        </p>
                      </td>
                      <td className="py-4 px-5 font-mono tabular-nums whitespace-nowrap">
                        <span
                          className={
                            opp.daysRemaining < 0
                              ? 'text-[#68758A]'
                              : opp.daysRemaining <= 14
                              ? 'text-amber-700 font-semibold'
                              : 'text-[#182334]'
                          }
                        >
                          {opp.deadline} (
                          {opp.daysRemaining >= 0 ? (
                            <AnimatedCounter value={opp.daysRemaining} suffix="d left" />
                          ) : (
                            'Expired'
                          )}
                          )
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right font-mono tabular-nums">
                        <AnimatedCounter value={opp.viewsCount} />
                      </td>
                      <td className="py-4 px-5 text-right font-mono tabular-nums">
                        <AnimatedCounter value={opp.savesCount} />
                      </td>
                      <td className="py-4 px-5 text-right font-mono font-semibold text-[#142B4F] tabular-nums">
                        <AnimatedCounter value={opp.applicationsCount} />
                      </td>
                      <td className="py-4 px-5 text-right font-mono text-emerald-700 font-semibold tabular-nums">
                        <AnimatedCounter value={convRate} suffix="%" />
                      </td>
                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        {opp.verificationStatus === 'Expired' ? (
                          <button
                            type="button"
                            onClick={() => onUpdateVerification(opp.id, 'Verified')}
                            className="btn-premium-secondary px-3 py-1.5 rounded-lg border border-slate-200 text-[#2864D8] hover:border-[#2864D8] font-semibold"
                          >
                            Renew Cycle
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onUpdateVerification(opp.id, 'Expired')}
                            className="btn-premium-secondary px-3 py-1.5 rounded-lg border border-slate-200 text-[#68758A] hover:text-rose-700 font-medium"
                          >
                            Close Cycle
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </RevealOnScroll>
    </div>
  );
};
