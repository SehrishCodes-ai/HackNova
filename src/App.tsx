/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import {
  PageId,
  Opportunity,
  StudentProfileData,
  ApplicationRecord,
  ApplicationStatus,
  NotificationItem,
  VerificationStatus,
  ToastMessage,
} from './types';
import {
  INITIAL_OPPORTUNITIES,
  INITIAL_STUDENT_PROFILE,
  INITIAL_SAVED_IDS,
  INITIAL_APPLICATIONS,
  INITIAL_NOTIFICATIONS,
} from './data/mockData';
import { api } from './api/client';
import {
  LandingPage,
  AboutPage,
  LoginPage,
  RegisterPage,
  PublicExplorePage,
  PublicOpportunityDetailsPage,
} from './components/PublicPages';
import { StudentWorkspace } from './components/StudentPages';
import { AdminWorkspace } from './components/AdminPages';
import { ThemeProvider } from './components/MotionPrimitives';

const STUDENT_ONLY_PAGES: PageId[] = [
  'student-dashboard',
  'student-profile',
  'my-matches',
  'saved-opportunities',
  'my-applications',
  'notifications',
];

const ADMIN_ONLY_PAGES: PageId[] = [
  'admin-dashboard',
  'manage-opportunities',
  'add-edit-opportunity',
  'verification-centre',
  'expiry-management',
  'student-engagement',
  'application-analytics',
  'analytics-reports',
];

export default function App() {
  // Root route (/) always opens the public ScholarBridge landing page
  const [currentPage, setCurrentPage] = useState<PageId>('landing');
  const [aboutSubTab, setAboutSubTab] = useState<'how-it-works' | 'about'>('about');
  const [authRole, setAuthRole] = useState<'student' | 'admin' | null>(null);

  // Core Application State
  const [opportunities, setOpportunities] = useState<Opportunity[]>(
    INITIAL_OPPORTUNITIES
  );
  const [studentProfile, setStudentProfile] = useState<StudentProfileData>(
    INITIAL_STUDENT_PROFILE
  );
  const [savedIds, setSavedIds] = useState<string[]>(INITIAL_SAVED_IDS);
  const [applications, setApplications] = useState<ApplicationRecord[]>(
    INITIAL_APPLICATIONS
  );
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    INITIAL_NOTIFICATIONS
  );
  const [selectedOpportunityId, setSelectedOpportunityId] =
    useState<string>('opp-101');
  const [editingOpportunityId, setEditingOpportunityId] = useState<
    string | null
  >(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const pushToast = useCallback(
    (
      title: string,
      description?: string,
      tone: 'default' | 'success' | 'warning' = 'default'
    ) => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      setToasts((prev) => [...prev, { id, title, description, tone }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  // Initial Data Synchronization from PostgreSQL REST API
  useEffect(() => {
    // 1. Fetch live opportunities catalogue from PostgreSQL
    api.getOpportunities()
      .then((data) => {
        if (data && data.length > 0) {
          setOpportunities(data);
          if (data[0] && data[0].id) {
            setSelectedOpportunityId(data[0].id);
          }
        }
      })
      .catch((err) => {
        console.info('[ScholarBridge API] Operating in fallback mode:', err.message);
      });

    // 2. Restore authenticated session if token exists
    api.getMe()
      .then((res) => {
        if (res && res.user) {
          setAuthRole(res.user.role);
          if (res.user.role === 'student') {
            api.getStudentProfile().then(setStudentProfile).catch(() => {});
            api.getSavedIds().then(setSavedIds).catch(() => {});
            api.getApplications().then(setApplications).catch(() => {});
            api.getNotifications().then(setNotifications).catch(() => {});
          }
        }
      })
      .catch(() => {});
  }, []);

  // Role-based navigation guard
  const handleNavigate = useCallback(
    (targetPage: PageId, subTab?: 'how-it-works' | 'about') => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (subTab) {
        setAboutSubTab(subTab);
      }

      // Enforce strict role separation
      if (STUDENT_ONLY_PAGES.includes(targetPage)) {
        if (authRole === 'admin') {
          setCurrentPage('admin-dashboard');
          return;
        }
        if (authRole !== 'student') {
          setCurrentPage('login');
          pushToast(
            'Student Authentication Required',
            'Please sign in through the Student Portal to access your dashboard.',
            'default'
          );
          return;
        }
      }

      if (ADMIN_ONLY_PAGES.includes(targetPage)) {
        if (authRole === 'student') {
          setCurrentPage('student-dashboard');
          return;
        }
        if (authRole !== 'admin') {
          setCurrentPage('login');
          pushToast(
            'Administrator Authentication Required',
            'Please sign in with Administrator credentials to access the Governance Console.',
            'default'
          );
          return;
        }
      }

      setCurrentPage(targetPage);
    },
    [authRole, pushToast]
  );

  // Save / Unsave Opportunity
  const handleToggleSave = useCallback(
    (id: string) => {
      const opp = opportunities.find((o) => o.id === id);
      const isCurrentlySaved = savedIds.includes(id);
      api.toggleSave(id, isCurrentlySaved).catch(() => {});
      setSavedIds((prev) => {
        const exists = prev.includes(id);
        if (exists) {
          pushToast(
            'Removed from Saved Opportunities',
            opp?.title,
            'default'
          );
          return prev.filter((item) => item !== id);
        } else {
          pushToast(
            'Saved Opportunity',
            `${opp?.title || 'Opportunity'} added to your shortlist.`,
            'success'
          );
          return [...prev, id];
        }
      });
    },
    [opportunities, savedIds, pushToast]
  );

  // View Opportunity Details
  const handleViewDetails = useCallback((id: string) => {
    setSelectedOpportunityId(id);
    api.getOpportunity(id).catch(() => {});
    setCurrentPage('opportunity-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Authentication Handlers
  const handleLoginSuccess = useCallback(
    (role: 'student' | 'admin', email: string) => {
      setAuthRole(role);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (role === 'student') {
        api.getStudentProfile().then(setStudentProfile).catch(() => {});
        api.getSavedIds().then(setSavedIds).catch(() => {});
        api.getApplications().then(setApplications).catch(() => {});
        api.getNotifications().then(setNotifications).catch(() => {});
        setCurrentPage('student-dashboard');
        pushToast(
          'Signed in to Student Workspace',
          `Welcome back, ${studentProfile.fullName} (${email})`,
          'success'
        );
      } else {
        setCurrentPage('admin-dashboard');
        pushToast(
          'Signed in to Administrator Console',
          `Authenticated as ${email}`,
          'success'
        );
      }
    },
    [studentProfile.fullName, pushToast]
  );

  const handleLogout = useCallback(() => {
    api.logout();
    setAuthRole(null);
    setCurrentPage('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    pushToast(
      'Signed Out',
      'You have been returned to the public ScholarBridge landing page.',
      'default'
    );
  }, [pushToast]);

  const handleCompleteRegistration = useCallback(
    (updatedProfile: StudentProfileData) => {
      api.register(updatedProfile).catch(() => {});
      setStudentProfile(updatedProfile);
      setAuthRole('student');
      setCurrentPage('student-dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      pushToast(
        'Student Profile Created',
        'Your eligibility rules have been evaluated across all opportunities.',
        'success'
      );
    },
    [pushToast]
  );

  const handleUpdateProfile = useCallback(
    (updatedProfile: StudentProfileData) => {
      api.updateStudentProfile(updatedProfile).catch(() => {});
      setStudentProfile(updatedProfile);
      pushToast(
        'Profile Updated & Matches Recalculated',
        'Your Matched and Possibly Matched sections reflect your latest criteria.',
        'success'
      );
    },
    [pushToast]
  );

  // Student Application Tracker Actions
  const handleStartOrUpdateApplication = useCallback(
    (opportunityId: string, newStatus: ApplicationStatus = 'Preparing Documents') => {
      api.startOrUpdateApplication(opportunityId, newStatus).catch(() => {});
      const opp = opportunities.find((o) => o.id === opportunityId);
      setApplications((prev) => {
        const existing = prev.find((a) => a.opportunityId === opportunityId);
        if (existing) {
          return prev.map((a) =>
            a.opportunityId === opportunityId
              ? {
                  ...a,
                  status: newStatus,
                  lastUpdated: new Date().toISOString().split('T')[0],
                  submissionDate:
                    newStatus === 'Submitted' ? new Date().toISOString().split('T')[0] : a.submissionDate,
                }
              : a
          );
        } else {
          const newRecord: ApplicationRecord = {
            id: `app-${Date.now()}`,
            opportunityId,
            status: newStatus,
            lastUpdated: new Date().toISOString().split('T')[0],
            missingDocuments: opp ? opp.requiredDocuments.slice(1) : [],
            completedDocuments: opp ? opp.requiredDocuments.slice(0, 1) : [],
            nextAction: `Complete remaining documents before ${opp?.deadline || 'deadline'}`,
            notes: 'Added via ScholarBridge Opportunity Navigator.',
          };
          return [newRecord, ...prev];
        }
      });
      pushToast(
        `Application Stage: ${newStatus}`,
        opp?.title,
        'success'
      );
    },
    [opportunities, pushToast]
  );

  const handleToggleApplicationDoc = useCallback(
    (applicationId: string, docName: string) => {
      api.toggleApplicationDoc(applicationId, docName).catch(() => {});
      setApplications((prev) =>
        prev.map((app) => {
          if (app.id !== applicationId) return app;
          const isCompleted = app.completedDocuments.includes(docName);
          const completedDocuments = isCompleted
            ? app.completedDocuments.filter((d) => d !== docName)
            : [...app.completedDocuments, docName];
          const missingDocuments = isCompleted
            ? [...app.missingDocuments, docName]
            : app.missingDocuments.filter((d) => d !== docName);
          return {
            ...app,
            completedDocuments,
            missingDocuments,
            lastUpdated: new Date().toISOString().split('T')[0],
          };
        })
      );
      pushToast('Document Checklist Updated', docName, 'default');
    },
    [pushToast]
  );

  // Notifications Actions
  const handleMarkNotificationRead = useCallback((id: string) => {
    api.markNotificationRead(id).catch(() => {});
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const handleMarkAllNotificationsRead = useCallback(() => {
    api.markAllNotificationsRead().catch(() => {});
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    pushToast('All Notifications Marked as Read', undefined, 'default');
  }, [pushToast]);

  // Admin Actions
  const handleSaveOpportunity = useCallback(
    (opp: Opportunity, isEdit: boolean) => {
      api.saveOpportunity(opp, isEdit).catch(() => {});
      setOpportunities((prev) =>
        isEdit ? prev.map((o) => (o.id === opp.id ? opp : o)) : [opp, ...prev]
      );
      pushToast(
        isEdit ? 'Opportunity Record Updated' : 'New Opportunity Published',
        opp.title,
        'success'
      );
    },
    [pushToast]
  );

  const handleUpdateVerificationStatus = useCallback(
    (id: string, status: VerificationStatus) => {
      api.updateVerification(id, status).catch(() => {});
      const opp = opportunities.find((o) => o.id === id);
      setOpportunities((prev) =>
        prev.map((o) =>
          o.id === id
            ? {
                ...o,
                verificationStatus: status,
                verifiedDate: new Date().toISOString().split('T')[0],
                verifiedBy: `Admin Verification Desk · Status: ${status}`,
              }
            : o
        )
      );
      pushToast(
        `Verification Status Updated: ${status}`,
        opp?.title,
        status === 'Verified' ? 'success' : 'warning'
      );
    },
    [opportunities, pushToast]
  );

  const handleToggleArchiveOpportunity = useCallback(
    (id: string) => {
      api.toggleArchive(id).catch(() => {});
      const opp = opportunities.find((o) => o.id === id);
      setOpportunities((prev) =>
        prev.map((o) => (o.id === id ? { ...o, archived: !o.archived } : o))
      );
      pushToast(
        opp?.archived ? 'Opportunity Restored' : 'Opportunity Archived',
        opp?.title,
        'default'
      );
    },
    [opportunities, pushToast]
  );

  // Determine which layout/view to render
  const isStudentWorkspaceView =
    authRole === 'student' &&
    (STUDENT_ONLY_PAGES.includes(currentPage) ||
      currentPage === 'explore' ||
      currentPage === 'opportunity-details');

  const isAdminWorkspaceView =
    authRole === 'admin' && ADMIN_ONLY_PAGES.includes(currentPage);

  return (
    <ThemeProvider>
      <div className="relative min-h-screen">
        {/* 1. PUBLIC PAGES & UNAUTHENTICATED DISCOVERY */}
        {!isStudentWorkspaceView && !isAdminWorkspaceView && (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentPage}-${aboutSubTab}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              {currentPage === 'landing' && (
                <LandingPage
                  opportunities={opportunities}
                  savedIds={savedIds}
                  onToggleSave={handleToggleSave}
                  onViewDetails={handleViewDetails}
                  onNavigate={handleNavigate}
                />
              )}

              {currentPage === 'about' && (
                <AboutPage activeSubTab={aboutSubTab} onNavigate={handleNavigate} />
              )}

              {currentPage === 'login' && (
                <LoginPage
                  onNavigate={handleNavigate}
                  onLoginSuccess={handleLoginSuccess}
                />
              )}

              {currentPage === 'register' && (
                <RegisterPage
                  initialProfile={studentProfile}
                  onNavigate={handleNavigate}
                  onCompleteRegistration={handleCompleteRegistration}
                />
              )}

              {currentPage === 'explore' && (
                <PublicExplorePage
                  opportunities={opportunities}
                  studentProfile={studentProfile}
                  savedIds={savedIds}
                  onToggleSave={handleToggleSave}
                  onViewDetails={handleViewDetails}
                  onNavigate={handleNavigate}
                />
              )}

              {currentPage === 'opportunity-details' && (
                <PublicOpportunityDetailsPage
                  opportunity={
                    opportunities.find((o) => o.id === selectedOpportunityId) ||
                    opportunities[0]
                  }
                  isSaved={savedIds.includes(selectedOpportunityId)}
                  onToggleSave={handleToggleSave}
                  onNavigate={handleNavigate}
                />
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {/* 2. AUTHENTICATED STUDENT WORKSPACE */}
        {isStudentWorkspaceView && (
          <StudentWorkspace
            currentPage={currentPage}
            onNavigate={handleNavigate}
            studentProfile={studentProfile}
            onUpdateProfile={handleUpdateProfile}
            opportunities={opportunities}
            selectedOpportunityId={selectedOpportunityId}
            onSelectOpportunity={setSelectedOpportunityId}
            savedIds={savedIds}
            onToggleSave={handleToggleSave}
            applications={applications}
            onStartOrUpdateApplication={handleStartOrUpdateApplication}
            onToggleApplicationDoc={handleToggleApplicationDoc}
            notifications={notifications}
            onMarkNotificationRead={handleMarkNotificationRead}
            onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
            onLogout={handleLogout}
          />
        )}

        {/* 3. AUTHENTICATED ADMINISTRATOR WORKSPACE */}
        {isAdminWorkspaceView && (
          <AdminWorkspace
            currentPage={currentPage}
            onNavigate={handleNavigate}
            opportunities={opportunities}
            applications={applications}
            editingOpportunityId={editingOpportunityId}
            onStartEditOpportunity={setEditingOpportunityId}
            onSaveOpportunity={handleSaveOpportunity}
            onUpdateVerificationStatus={handleUpdateVerificationStatus}
            onToggleArchiveOpportunity={handleToggleArchiveOpportunity}
            onLogout={handleLogout}
          />
        )}

        {/* Animated Toast Notifications Container */}
        <div
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
        >
          <AnimatePresence>
            {toasts.map((t) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 14, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="pointer-events-auto bg-white border border-slate-200/90 rounded-xl p-4 shadow-lg flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-2.5">
                  {t.tone === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : t.tone === 'warning' ? (
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  ) : (
                    <Info className="w-4 h-4 text-[#2864D8] shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-display text-xs font-bold text-[#142B4F]">
                      {t.title}
                    </p>
                    {t.description && (
                      <p className="text-[11px] text-[#68758A] mt-0.5 line-clamp-2">
                        {t.description}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setToasts((prev) => prev.filter((item) => item.id !== t.id))
                  }
                  aria-label="Close notification"
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </ThemeProvider>
  );
}
