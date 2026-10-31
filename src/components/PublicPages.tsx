import React, { useState } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
  SlidersHorizontal,
  ChevronDown,
  Menu,
  X,
  GraduationCap,
  Building2,
  Search,
  Bookmark,
  ExternalLink,
  FileText,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react';
import {
  PageId,
  Opportunity,
  StudentProfileData,
  EducationLevel,
} from '../types';
import {
  ScholarBridgeLogo,
  OpportunityCard,
  VerificationIndicator,
  CriterionStatusIndicator,
} from './BrandMark';
import { ExploreOpportunitiesView } from './StudentPages';
import AetherFlowHero from '@/components/ui/aether-flow-hero';
import {
  ThemeToggle,
  RevealOnScroll,
  AnimatedCounter,
} from './MotionPrimitives';

interface PublicNavbarProps {
  currentPage: PageId;
  activeSubTab?: 'how-it-works' | 'about';
  onNavigate: (page: PageId, subTab?: 'how-it-works' | 'about') => void;
}

export const PublicNavbar: React.FC<PublicNavbarProps> = ({
  currentPage,
  activeSubTab,
  onNavigate,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (page: PageId, subTab?: 'how-it-works' | 'about') => {
    onNavigate(page, subTab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-colors duration-200">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark with Breathing Room */}
        <div className="pr-2 shrink-0">
          <ScholarBridgeLogo onClick={() => handleNav('landing')} />
        </div>

        {/* Zone 2: Centered Navigation Links with Animated Underlines */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-8 text-sm font-medium text-[#68758A]"
        >
          <button
            type="button"
            onClick={() => handleNav('landing')}
            className={`nav-link-animated py-1.5 whitespace-nowrap shrink-0 ${
              currentPage === 'landing'
                ? 'nav-link-active text-[#142B4F] font-semibold'
                : 'hover:text-[#142B4F]'
            }`}
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => handleNav('explore')}
            className={`nav-link-animated py-1.5 whitespace-nowrap shrink-0 ${
              currentPage === 'explore' || currentPage === 'opportunity-details'
                ? 'nav-link-active text-[#142B4F] font-semibold'
                : 'hover:text-[#142B4F]'
            }`}
          >
            Explore Opportunities
          </button>
          <button
            type="button"
            onClick={() => handleNav('about', 'how-it-works')}
            className={`nav-link-animated py-1.5 whitespace-nowrap shrink-0 ${
              currentPage === 'about' && activeSubTab === 'how-it-works'
                ? 'nav-link-active text-[#142B4F] font-semibold'
                : 'hover:text-[#142B4F]'
            }`}
          >
            How It Works
          </button>
          <button
            type="button"
            onClick={() => handleNav('about', 'about')}
            className={`nav-link-animated py-1.5 whitespace-nowrap shrink-0 ${
              currentPage === 'about' && activeSubTab !== 'how-it-works'
                ? 'nav-link-active text-[#142B4F] font-semibold'
                : 'hover:text-[#142B4F]'
            }`}
          >
            About
          </button>
        </nav>

        {/* Zone 3: Theme Toggle + Properly Aligned Login & Get Started Actions */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <ThemeToggle />

          <button
            type="button"
            onClick={() => handleNav('login')}
            className={`btn-premium-secondary hidden sm:inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap shrink-0 ${
              currentPage === 'login'
                ? 'text-[#2864D8] bg-[#EAF3FF]/70'
                : 'text-[#142B4F] hover:bg-slate-100'
            }`}
          >
            Login
          </button>

          <button
            type="button"
            onClick={() => handleNav('register')}
            className="btn-premium-primary px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#142B4F] rounded-lg hover:bg-[#2864D8] whitespace-nowrap shrink-0 shadow-2xs"
          >
            Get Started
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="md:hidden p-2.5 rounded-lg text-[#182334] hover:bg-slate-100 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Responsive Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <button
            type="button"
            onClick={() => handleNav('landing')}
            className="block w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium text-[#182334] hover:bg-[#EAF3FF]"
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => handleNav('explore')}
            className="block w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium text-[#182334] hover:bg-[#EAF3FF]"
          >
            Explore Opportunities
          </button>
          <button
            type="button"
            onClick={() => handleNav('about', 'how-it-works')}
            className="block w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium text-[#182334] hover:bg-[#EAF3FF]"
          >
            How It Works
          </button>
          <button
            type="button"
            onClick={() => handleNav('about', 'about')}
            className="block w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium text-[#182334] hover:bg-[#EAF3FF]"
          >
            About
          </button>
          <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleNav('login')}
              className="btn-premium-secondary w-full text-center px-4 py-2.5 rounded-lg text-sm font-semibold text-[#142B4F] border border-slate-300 hover:bg-slate-50"
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => handleNav('register')}
              className="btn-premium-primary w-full text-center px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#142B4F]"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export const PublicFooter: React.FC<{
  onNavigate: (page: PageId, subTab?: 'how-it-works' | 'about') => void;
}> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#142B4F] text-white border-t border-slate-800">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-12 border-b border-white/10">
          <div className="lg:col-span-2 space-y-4">
            <ScholarBridgeLogo variant="light" onClick={() => onNavigate('landing')} />
            <p className="text-sm text-slate-300 max-w-md leading-relaxed">
              Find Your Opportunity. Build Your Future. ScholarBridge is a Smart
              Scholarship & Student Support Navigator helping students discover
              verified scholarships, fee assistance, internships, and institutional
              support opportunities.
            </p>
            <p className="text-xs text-slate-400 pt-1">
              Contact Placeholder: support@scholarbridge.example.org · Institutional Desk: +1 (800) 555-0194
            </p>
          </div>

          <div>
            <h4 className="font-display text-xs font-semibold tracking-wider text-slate-300 uppercase mb-4">
              Platform Navigation
            </h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('landing')}
                  className="hover:text-white transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('explore')}
                  className="hover:text-white transition-colors"
                >
                  Explore Opportunities
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('about', 'how-it-works')}
                  className="hover:text-white transition-colors"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('about', 'about')}
                  className="hover:text-white transition-colors"
                >
                  About ScholarBridge
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-xs font-semibold tracking-wider text-slate-300 uppercase mb-4">
              Account Access
            </h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('login')}
                  className="hover:text-white transition-colors"
                >
                  Login (Role Selection)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('register')}
                  className="hover:text-white transition-colors"
                >
                  Student Registration
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors"
                >
                  Verification Standards
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors"
                >
                  Eligibility Transparency
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            © 2026 ScholarBridge Navigator. All listed scholarships and grants are clearly labelled illustrative sample opportunities.
          </p>
          <div className="flex items-center gap-4">
            <span>Privacy Policy</span>
            <span aria-hidden="true">·</span>
            <span>Terms of Use</span>
            <span aria-hidden="true">·</span>
            <span>Accessibility</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

// ============================================================================
// 1. LANDING PAGE (Root Route /)
// ============================================================================
export const LandingPage: React.FC<{
  opportunities: Opportunity[];
  savedIds: string[];
  onToggleSave: (id: string) => void;
  onViewDetails: (id: string) => void;
  onNavigate: (page: PageId, subTab?: 'how-it-works' | 'about') => void;
}> = ({ opportunities, savedIds, onToggleSave, onViewDetails, onNavigate }) => {
  const featuredOpportunities = opportunities
    .filter((o) => o.verificationStatus === 'Verified')
    .slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFD]">
      <PublicNavbar currentPage="landing" onNavigate={onNavigate} />

      <main className="flex-1">
        {/* HERO SECTION — Centered Vertical Composition + Product Preview */}
        <AetherFlowHero
          onPrimaryCta={() => onNavigate('register')}
          onSecondaryCta={() => onNavigate('explore')}
          onInspectSample={onViewDetails}
        />

        {/* HOW IT WORKS — 3 Visually Engaging Steps (80px-96px section spacing) */}
        <section className="py-20 lg:py-24 bg-white border-b border-slate-200/80">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <RevealOnScroll>
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                <div>
                  <p className="text-xs font-bold tracking-widest text-[#2864D8] uppercase mb-2.5">
                    HOW IT WORKS
                  </p>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#142B4F] tracking-tight">
                    Three Steps from Profile to Application
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('about', 'how-it-works')}
                  className="group text-sm font-semibold text-[#2864D8] hover:text-[#142B4F] inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors"
                >
                  <span>Read full methodology</span>
                  <ArrowRight className="w-4 h-4 icon-shift-right" />
                </button>
              </div>
            </RevealOnScroll>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              <RevealOnScroll delayMs={60}>
                <div className="card-interactive h-full bg-[#F8FAFD] border border-slate-200/90 rounded-xl p-7 sm:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="font-mono text-xs font-semibold text-[#2864D8]">
                        STEP 01
                      </span>
                      <SlidersHorizontal className="w-5 h-5 text-[#142B4F]" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-[#142B4F] mb-3">
                      01. Build Your Profile.
                    </h3>
                    <p className="text-sm text-[#68758A] leading-relaxed mb-8">
                      Enter your academic level, degree discipline, cumulative GPA,
                      household income bracket, and document readiness once during
                      registration.
                    </p>
                  </div>
                  <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs">
                    <span className="text-[#68758A]">Structured eligibility inputs</span>
                    <button
                      type="button"
                      onClick={() => onNavigate('register')}
                      className="group inline-flex items-center gap-1 font-semibold text-[#142B4F] hover:text-[#2864D8]"
                    >
                      <span>Create Profile</span>
                      <span className="icon-shift-right">→</span>
                    </button>
                  </div>
                </div>
              </RevealOnScroll>

              <RevealOnScroll delayMs={140}>
                <div className="card-interactive h-full bg-[#F8FAFD] border border-slate-200/90 rounded-xl p-7 sm:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="font-mono text-xs font-semibold text-[#2864D8]">
                        STEP 02
                      </span>
                      <Search className="w-5 h-5 text-[#142B4F]" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-[#142B4F] mb-3">
                      02. Discover Your Matches.
                    </h3>
                    <p className="text-sm text-[#68758A] leading-relaxed mb-8">
                      Review opportunities classified transparently into Matched,
                      Possibly Matched, and Ineligible — with an expandable “Why this
                      result?” explanation for every requirement.
                    </p>
                  </div>
                  <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs">
                    <span className="text-[#68758A]">No black-box percentages</span>
                    <button
                      type="button"
                      onClick={() => onNavigate('explore')}
                      className="group inline-flex items-center gap-1 font-semibold text-[#142B4F] hover:text-[#2864D8]"
                    >
                      <span>Browse Catalogue</span>
                      <span className="icon-shift-right">→</span>
                    </button>
                  </div>
                </div>
              </RevealOnScroll>

              <RevealOnScroll delayMs={220}>
                <div className="card-interactive h-full bg-[#F8FAFD] border border-slate-200/90 rounded-xl p-7 sm:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="font-mono text-xs font-semibold text-[#2864D8]">
                        STEP 03
                      </span>
                      <FileCheck2 className="w-5 h-5 text-[#142B4F]" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-[#142B4F] mb-3">
                      03. Track Your Applications.
                    </h3>
                    <p className="text-sm text-[#68758A] leading-relaxed mb-8">
                      Monitor missing documents, submission dates, and institutional
                      review stages from Not Started through Approved so you never miss
                      a deadline.
                    </p>
                  </div>
                  <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs">
                    <span className="text-[#68758A]">6-stage visual tracker</span>
                    <button
                      type="button"
                      onClick={() => onNavigate('login')}
                      className="group inline-flex items-center gap-1 font-semibold text-[#142B4F] hover:text-[#2864D8]"
                    >
                      <span>Sign In to Track</span>
                      <span className="icon-shift-right">→</span>
                    </button>
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </section>

        {/* FEATURED OPPORTUNITIES */}
        <section className="py-20 lg:py-24 bg-[#F8FAFD] border-b border-slate-200/80">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <RevealOnScroll>
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                <div>
                  <p className="text-xs font-bold tracking-widest text-[#2864D8] uppercase mb-2.5">
                    VERIFIED SAMPLE CATALOGUE
                  </p>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#142B4F] tracking-tight">
                    Featured Opportunities
                  </h2>
                  <p className="text-sm text-[#68758A] mt-2">
                    Clearly labelled illustrative sample opportunities — visitors can inspect full details without logging in.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('explore')}
                  className="btn-premium-secondary inline-flex items-center gap-2 px-5 py-3 rounded-lg text-xs font-semibold text-[#142B4F] bg-white border border-slate-300 hover:border-[#2864D8] whitespace-nowrap shrink-0"
                >
                  <span>
                    Explore All{' '}
                    <AnimatedCounter value={opportunities.length} /> Sample Opportunities
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 icon-shift-right" />
                </button>
              </div>
            </RevealOnScroll>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {featuredOpportunities.map((opp, idx) => (
                <RevealOnScroll key={opp.id} delayMs={idx * 85}>
                  <OpportunityCard
                    opportunity={opp}
                    isSaved={savedIds.includes(opp.id)}
                    onToggleSave={onToggleSave}
                    onViewDetails={onViewDetails}
                  />
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* WHY SCHOLARBRIDGE */}
        <section className="py-20 lg:py-24 bg-white border-b border-slate-200/80">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <RevealOnScroll>
              <div className="max-w-2xl mb-12">
                <p className="text-xs font-bold tracking-widest text-[#2864D8] uppercase mb-2.5">
                  WHY SCHOLARBRIDGE
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#142B4F] tracking-tight mb-3">
                  Built for Clarity, Verification, and Student Trust
                </h2>
                <p className="text-sm sm:text-base text-[#68758A] leading-relaxed">
                  Students lose thousands of hours navigating expired links, ambiguous
                  eligibility rules, and fragmented portals. ScholarBridge replaces
                  guesswork with verifiable structure.
                </p>
              </div>
            </RevealOnScroll>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              <RevealOnScroll className="lg:col-span-2" delayMs={60}>
                <div className="card-interactive h-full bg-[#F8FAFD] border border-slate-200/90 rounded-xl p-7 sm:p-8 flex flex-col justify-between">
                  <div>
                    <span className="font-mono text-xs font-semibold text-[#2864D8]">
                      01 · TRANSPARENT ELIGIBILITY MATCHING
                    </span>
                    <h3 className="font-display text-xl font-bold text-[#142B4F] mt-2.5 mb-3">
                      Every Match Explains Exact Criteria — Never Arbitrary Guesswork
                    </h3>
                    <p className="text-sm text-[#68758A] leading-relaxed max-w-2xl mb-6">
                      Instead of opaque percentage scores that mislead applicants,
                      ScholarBridge evaluates each requirement individually and shows
                      whether it is Satisfied, Needs clarification, or Not satisfied.
                    </p>
                  </div>

                  <div className="bg-white border border-slate-200/90 rounded-xl p-5 grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div>
                      <CriterionStatusIndicator status="Satisfied" />
                      <p className="text-xs text-[#68758A] mt-2 leading-relaxed">
                        Student profile meets or exceeds the published requirement.
                      </p>
                    </div>
                    <div>
                      <CriterionStatusIndicator status="Needs clarification" />
                      <p className="text-xs text-[#68758A] mt-2 leading-relaxed">
                        Core profile fits, but an attestation or document upload is needed.
                      </p>
                    </div>
                    <div>
                      <CriterionStatusIndicator status="Not satisfied" />
                      <p className="text-xs text-[#68758A] mt-2 leading-relaxed">
                        One or more strict institutional rules are not met.
                      </p>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>

              <RevealOnScroll delayMs={140}>
                <div className="card-interactive h-full bg-[#F8FAFD] border border-slate-200/90 rounded-xl p-7 sm:p-8 flex flex-col justify-between">
                  <div>
                    <span className="font-mono text-xs font-semibold text-[#2864D8]">
                      02 · VERIFIED OPPORTUNITY SOURCES
                    </span>
                    <h3 className="font-display text-xl font-bold text-[#142B4F] mt-2.5 mb-3">
                      Primary Source Audit Trail
                    </h3>
                    <p className="text-sm text-[#68758A] leading-relaxed mb-6">
                      Every listing records its official provider URL, verification
                      status, audit date, and automatic expiry transition when a cycle
                      closes.
                    </p>
                  </div>
                  <div className="bg-white border border-slate-200/90 rounded-xl p-5 space-y-2">
                    <VerificationIndicator status="Verified" showAudit="Oct 2026" />
                    <p className="text-xs text-[#68758A]">
                      Audited against primary institutional circulars.
                    </p>
                  </div>
                </div>
              </RevealOnScroll>

              <RevealOnScroll delayMs={180}>
                <div className="card-interactive h-full bg-[#F8FAFD] border border-slate-200/90 rounded-xl p-7 sm:p-8 flex flex-col justify-between">
                  <div>
                    <span className="font-mono text-xs font-semibold text-[#2864D8]">
                      03 · CENTRALISED APPLICATION TRACKING
                    </span>
                    <h3 className="font-display text-xl font-bold text-[#142B4F] mt-2.5 mb-3">
                      Document & Stage Readiness
                    </h3>
                    <p className="text-sm text-[#68758A] leading-relaxed">
                      Track every scholarship from initial document preparation to
                      submission and final review outcome, with clear visibility into
                      missing attachments.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs text-[#142B4F] font-semibold">
                    <span>Not Started → Preparing → Submitted → Approved</span>
                  </div>
                </div>
              </RevealOnScroll>

              <RevealOnScroll className="lg:col-span-2" delayMs={240}>
                <div className="card-interactive h-full bg-[#F8FAFD] border border-slate-200/90 rounded-xl p-7 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div className="max-w-xl">
                    <span className="font-mono text-xs font-semibold text-[#2864D8]">
                      04 · DEADLINE AWARENESS
                    </span>
                    <h3 className="font-display text-xl font-bold text-[#142B4F] mt-2.5 mb-2.5">
                      Prioritised Timeline & Urgency Indicators
                    </h3>
                    <p className="text-sm text-[#68758A] leading-relaxed">
                      Opportunities closing within{' '}
                      <AnimatedCounter value={14} suffix=" days" /> are highlighted across your
                      dashboard, saved list, and notifications centre so high-value
                      deadlines never slip past unnoticed.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate('explore')}
                    className="btn-premium-primary px-6 py-3.5 rounded-lg text-xs font-semibold bg-[#142B4F] text-white hover:bg-[#2864D8] whitespace-nowrap shrink-0 inline-flex items-center gap-1.5"
                  >
                    <span>Explore Catalogue</span>
                    <span className="icon-shift-right">→</span>
                  </button>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </section>

        {/* FINAL CTA SECTION */}
        <section className="py-20 lg:py-24 bg-[#EAF3FF]/60">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <RevealOnScroll direction="scale">
              <div className="bg-[#142B4F] rounded-2xl p-8 sm:p-12 lg:p-14 text-white flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 shadow-xl">
                <div className="max-w-2xl">
                  <p className="text-xs font-bold tracking-widest text-[#93C5FD] uppercase mb-2.5">
                    START YOUR JOURNEY
                  </p>
                  <h2 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight mb-3 balance-text text-white">
                    Your Next Opportunity Starts Here.
                  </h2>
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                    Register as a student to build your eligibility profile, or sign in
                    through our role-based portal.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 shrink-0">
                  <button
                    type="button"
                    onClick={() => onNavigate('register')}
                    className="btn-premium-primary px-6 py-3.5 rounded-lg text-sm font-semibold bg-[#2864D8] text-white hover:bg-blue-500 whitespace-nowrap shrink-0"
                  >
                    Get Started (Student Registration)
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('login')}
                    className="btn-premium-secondary px-6 py-3.5 rounded-lg text-sm font-semibold bg-white/10 text-white hover:bg-white/20 border border-white/20 whitespace-nowrap shrink-0"
                  >
                    Login to Account
                  </button>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </section>
      </main>

      <PublicFooter onNavigate={onNavigate} />
    </div>
  );
};

// ============================================================================
// PUBLIC EXPLORE OPPORTUNITIES WRAPPER (For Unauthenticated Visitors)
// ============================================================================
export const PublicExplorePage: React.FC<{
  opportunities: Opportunity[];
  studentProfile: StudentProfileData;
  savedIds: string[];
  onToggleSave: (id: string) => void;
  onViewDetails: (id: string) => void;
  onNavigate: (page: PageId, subTab?: 'how-it-works' | 'about') => void;
}> = ({
  opportunities,
  studentProfile,
  savedIds,
  onToggleSave,
  onViewDetails,
  onNavigate,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFD]">
      <PublicNavbar currentPage="explore" onNavigate={onNavigate} />
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-8">
        {/* Visitor Banner */}
        <RevealOnScroll>
          <div className="p-5 sm:p-6 rounded-xl bg-[#EAF3FF] border border-[#2864D8]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs sm:text-sm text-[#142B4F] leading-relaxed">
              <strong>Public Discovery Mode:</strong> You are browsing the verified
              sample catalogue as a visitor. Sign in or register as a student to unlock
              personalized rule-by-rule eligibility matching.
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="btn-premium-secondary px-4 py-2 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-[#142B4F] hover:border-[#2864D8]"
              >
                Student Login
              </button>
              <button
                type="button"
                onClick={() => onNavigate('register')}
                className="btn-premium-primary px-4 py-2 rounded-lg text-xs font-semibold bg-[#142B4F] text-white hover:bg-[#2864D8]"
              >
                Get Started
              </button>
            </div>
          </div>
        </RevealOnScroll>

        <ExploreOpportunitiesView
          opportunities={opportunities}
          studentProfile={studentProfile}
          savedIds={savedIds}
          onToggleSave={onToggleSave}
          onViewDetails={onViewDetails}
        />
      </main>
      <PublicFooter onNavigate={onNavigate} />
    </div>
  );
};

// ============================================================================
// PUBLIC OPPORTUNITY DETAILS WRAPPER (For Unauthenticated Visitors)
// ============================================================================
export const PublicOpportunityDetailsPage: React.FC<{
  opportunity: Opportunity;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onNavigate: (page: PageId, subTab?: 'how-it-works' | 'about') => void;
}> = ({ opportunity, isSaved, onToggleSave, onNavigate }) => {
  const [sourceModalOpen, setSourceModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFD]">
      <PublicNavbar currentPage="opportunity-details" onNavigate={onNavigate} />

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-8">
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
                <span className="block text-xs text-[#68758A] mb-1">Minimum GPA & Income Cap</span>
                <span className="font-mono text-sm font-bold text-[#142B4F] tabular-nums">
                  GPA ≥ <AnimatedCounter value={opportunity.minGpa} decimals={2} />
                  {opportunity.maxHouseholdIncome ? (
                    <>
                      {' · Income ≤ '}
                      <AnimatedCounter
                        value={opportunity.maxHouseholdIncome}
                        prefix="$"
                      />
                    </>
                  ) : (
                    ''
                  )}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="flex flex-wrap items-center gap-3.5">
                <button
                  type="button"
                  onClick={() => onNavigate('login')}
                  className="btn-premium-primary px-6 py-3 rounded-lg text-xs sm:text-sm font-semibold bg-[#142B4F] text-white hover:bg-[#2864D8] whitespace-nowrap shrink-0 inline-flex items-center gap-1.5"
                >
                  <span>Sign In as Student to Apply & Track</span>
                  <span className="icon-shift-right">→</span>
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
                  <span>{isSaved ? 'Saved' : 'Save Opportunity'}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSourceModalOpen(!sourceModalOpen)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2864D8] hover:underline"
              >
                <span>Official Source Link</span>
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
              </div>
            )}
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <RevealOnScroll className="lg:col-span-7" delayMs={80}>
            <div className="card-interactive h-full bg-white border border-slate-200/90 rounded-xl p-6 sm:p-8 space-y-5">
              <h2 className="font-display text-lg font-bold text-[#142B4F]">
                Benefits & Financial Support
              </h2>
              <p className="text-sm text-[#68758A] leading-relaxed">
                {opportunity.description}
              </p>
              <ul className="space-y-3 pt-2">
                {opportunity.coverageDetails.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#182334]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </RevealOnScroll>

          <RevealOnScroll className="lg:col-span-5" delayMs={160}>
            <div className="card-interactive h-full bg-white border border-slate-200/90 rounded-xl p-6 sm:p-8 space-y-5">
              <h2 className="font-display text-lg font-bold text-[#142B4F]">
                Eligibility Criteria & Required Documents
              </h2>
              <div className="space-y-2.5 text-xs sm:text-sm text-[#68758A]">
                <p>
                  • <strong className="text-[#182334]">Education Level:</strong>{' '}
                  {opportunity.educationLevels.join(', ')}
                </p>
                <p>
                  • <strong className="text-[#182334]">Minimum GPA:</strong>{' '}
                  {opportunity.minGpa.toFixed(2)} / 4.00
                </p>
                <p>
                  • <strong className="text-[#182334]">Eligible Disciplines:</strong>{' '}
                  {opportunity.allowedMajors.join(', ')}
                </p>
                {opportunity.maxHouseholdIncome && (
                  <p>
                    • <strong className="text-[#182334]">Household Income Ceiling:</strong>{' '}
                    ${opportunity.maxHouseholdIncome.toLocaleString()} / yr
                  </p>
                )}
              </div>
              <div className="pt-4 border-t border-slate-100 space-y-2.5">
                <span className="block text-xs font-bold text-[#142B4F]">
                  Required Documents:
                </span>
                {opportunity.requiredDocuments.map((doc, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-[#182334]">
                    <FileText className="w-4 h-4 text-[#2864D8] shrink-0" />
                    <span>{doc}</span>
                  </div>
                ))}
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </main>

      <PublicFooter onNavigate={onNavigate} />
    </div>
  );
};

// ============================================================================
// 2. ABOUT / HOW IT WORKS PAGE
// ============================================================================
export const AboutPage: React.FC<{
  activeSubTab?: 'how-it-works' | 'about';
  onNavigate: (page: PageId, subTab?: 'how-it-works' | 'about') => void;
}> = ({ activeSubTab = 'about', onNavigate }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does ScholarBridge determine if I am Matched, Possibly Matched, or Ineligible?',
      a: 'ScholarBridge compares your structured Student Profile (education level, field of study, cumulative GPA, household income, and uploaded document verifications) against each opportunity’s published rules. If all rules pass, it is marked as Matched. If core criteria match but a document or status (like First-Generation attestation) is unverified, it is marked Possibly Matched. If any hard requirement is not met, it is marked Ineligible.',
    },
    {
      q: 'Why does ScholarBridge avoid showing "94% Match Probability" scores?',
      a: 'Arbitrary match percentages can mislead students into thinking they have a guaranteed probability of receiving a scholarship. Eligibility is binary or conditional based on institutional rules, so we show transparent rule-by-rule statuses instead.',
    },
    {
      q: 'Are the opportunities shown in this demonstration real scholarships?',
      a: 'All opportunities in this prototype are clearly labelled illustrative sample opportunities created to demonstrate discovery, eligibility matching, application tracking, and institutional verification workflows.',
    },
    {
      q: 'How are Student and Administrator roles separated?',
      a: 'Students authenticate into a dedicated Student Navigator Workspace focused on profile matching and application tracking, while Institutional Administrators authenticate into a separate Governance & Verification Console.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFD]">
      <PublicNavbar
        currentPage="about"
        activeSubTab={activeSubTab}
        onNavigate={onNavigate}
      />

      <main className="flex-1">
        <section className="bg-white border-b border-slate-200/80 py-16 lg:py-20">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <RevealOnScroll>
              <div className="max-w-3xl">
                <p className="text-xs font-bold tracking-widest text-[#2864D8] uppercase mb-3">
                  {activeSubTab === 'how-it-works'
                    ? 'HOW SCHOLARBRIDGE WORKS'
                    : 'ABOUT SCHOLARBRIDGE & METHODOLOGY'}
                </p>
                <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#142B4F] tracking-tight mb-4 balance-text">
                  Transparent Eligibility Navigation for Students & Institutions
                </h1>
                <p className="text-base text-[#68758A] leading-relaxed">
                  ScholarBridge bridges the information gap between verified funding
                  bodies and deserving students through deterministic rule matching,
                  source verification, and structured application tracking.
                </p>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        <section className="py-16 lg:py-20 border-b border-slate-200/80">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <RevealOnScroll>
              <h2 className="font-display text-2xl font-bold text-[#142B4F] mb-2.5">
                Our Three-State Eligibility Engine
              </h2>
              <p className="text-sm text-[#68758A] mb-10 max-w-2xl">
                Every opportunity in ScholarBridge is evaluated rule-by-rule against
                your academic and financial profile.
              </p>
            </RevealOnScroll>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              <RevealOnScroll delayMs={60}>
                <div className="card-interactive h-full bg-white border border-slate-200 rounded-xl p-7">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-display text-base font-bold text-[#142B4F]">
                      1. Matched
                    </span>
                    <CriterionStatusIndicator status="Satisfied" />
                  </div>
                  <p className="text-sm text-[#68758A] leading-relaxed mb-5">
                    You satisfy all published academic, demographic, enrollment, and
                    financial eligibility criteria based on your verified profile.
                  </p>
                  <p className="text-xs text-emerald-700 font-medium">
                    Ready for immediate application preparation.
                  </p>
                </div>
              </RevealOnScroll>

              <RevealOnScroll delayMs={140}>
                <div className="card-interactive h-full bg-white border border-slate-200 rounded-xl p-7">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-display text-base font-bold text-[#142B4F]">
                      2. Possibly Matched
                    </span>
                    <CriterionStatusIndicator status="Needs clarification" />
                  </div>
                  <p className="text-sm text-[#68758A] leading-relaxed mb-5">
                    You meet the primary academic and degree criteria, but one or more
                    supporting fields (such as a research statement or first-gen
                    attestation) require completion.
                  </p>
                  <p className="text-xs text-amber-700 font-medium">
                    Prompts exact profile action to clarify eligibility.
                  </p>
                </div>
              </RevealOnScroll>

              <RevealOnScroll delayMs={220}>
                <div className="card-interactive h-full bg-white border border-slate-200 rounded-xl p-7">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-display text-base font-bold text-[#142B4F]">
                      3. Ineligible
                    </span>
                    <CriterionStatusIndicator status="Not satisfied" />
                  </div>
                  <p className="text-sm text-[#68758A] leading-relaxed mb-5">
                    One or more strict criteria (such as degree level, required major,
                    or household income ceiling) are not satisfied.
                  </p>
                  <p className="text-xs text-rose-700 font-medium">
                    Saves hours of wasted application effort.
                  </p>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-20 bg-white">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
            <RevealOnScroll>
              <h2 className="font-display text-2xl font-bold text-[#142B4F] mb-8">
                Frequently Asked Questions
              </h2>
              <div className="divide-y divide-slate-200 border-y border-slate-200">
                {faqs.map((item, index) => {
                  const isOpen = openFaq === index;
                  return (
                    <div key={index} className="py-5">
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : index)}
                        className="w-full flex items-center justify-between text-left gap-4"
                      >
                        <span className="font-display text-base font-bold text-[#182334]">
                          {item.q}
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 text-[#68758A] shrink-0 transition-transform duration-300 ${
                            isOpen ? 'rotate-180 text-[#2864D8]' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <p className="mt-3.5 text-sm text-[#68758A] leading-relaxed">
                          {item.a}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-12 flex flex-wrap items-center justify-between gap-4 p-6 sm:p-8 rounded-xl bg-[#F8FAFD] border border-slate-200">
                <div>
                  <h3 className="font-display text-base font-bold text-[#142B4F]">
                    Ready to sign in or register?
                  </h3>
                  <p className="text-xs sm:text-sm text-[#68758A] mt-1">
                    Choose your role on the Login page or create a new Student account.
                  </p>
                </div>
                <div className="flex items-center gap-3.5">
                  <button
                    type="button"
                    onClick={() => onNavigate('register')}
                    className="btn-premium-primary px-5 py-2.5 rounded-lg text-xs font-semibold bg-[#142B4F] text-white hover:bg-[#2864D8]"
                  >
                    Student Registration
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('login')}
                    className="btn-premium-secondary px-5 py-2.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-[#142B4F] hover:border-[#142B4F]"
                  >
                    Go to Role Login
                  </button>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </section>
      </main>

      <PublicFooter onNavigate={onNavigate} />
    </div>
  );
};

// ============================================================================
// 3. LOGIN PAGE — Dedicated Role-Selection Screen + Distinct Student & Admin Login Interfaces
// ============================================================================
export const LoginPage: React.FC<{
  onNavigate: (page: PageId) => void;
  onLoginSuccess: (role: 'student' | 'admin', email: string) => void;
}> = ({ onNavigate, onLoginSuccess }) => {
  const [step, setStep] = useState<'select-role' | 'student-login' | 'admin-login'>(
    'select-role'
  );
  const [studentEmail, setStudentEmail] = useState(
    'aarav.mehta@university.edu.sample'
  );
  const [studentPassword, setStudentPassword] = useState('ScholarBridge2026');
  const [showStudentPass, setShowStudentPass] = useState(false);

  const [adminEmail, setAdminEmail] = useState(
    'governance.desk@scholarbridge.example.org'
  );
  const [adminBadgeId, setAdminBadgeId] = useState('SB-ADM-904');
  const [adminPassword, setAdminPassword] = useState('AdminGovernance2026');
  const [showAdminPass, setShowAdminPass] = useState(false);
  const [error, setError] = useState('');

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentEmail.includes('@')) {
      setError('Please enter a valid student email address.');
      return;
    }
    if (studentPassword.trim().length < 4) {
      setError('Please enter your student password.');
      return;
    }
    onLoginSuccess('student', studentEmail);
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail.includes('@') || !adminBadgeId.trim()) {
      setError('Please enter your institutional email and administrator badge ID.');
      return;
    }
    if (adminPassword.trim().length < 4) {
      setError('Please enter your administrator password.');
      return;
    }
    onLoginSuccess('admin', adminEmail);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFD]">
      <PublicNavbar currentPage="login" onNavigate={onNavigate} />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-16 lg:py-20">
        {/* STEP 1: DEDICATED ROLE-SELECTION SCREEN */}
        {step === 'select-role' && (
          <RevealOnScroll className="w-full max-w-3xl space-y-10">
            <div className="text-center max-w-xl mx-auto">
              <p className="text-xs font-bold tracking-widest text-[#2864D8] uppercase mb-2.5">
                ROLE-BASED PORTAL ACCESS
              </p>
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#142B4F]">
                Select Your Login Portal
              </h1>
              <p className="text-sm sm:text-base text-[#68758A] mt-3 leading-relaxed">
                ScholarBridge provides strictly separated workspaces for students and
                institutional administrators. Choose your role to continue.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {/* Option A: Student Login */}
              <div className="card-interactive bg-white border border-slate-200/90 rounded-2xl p-7 sm:p-8 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#EAF3FF] text-[#2864D8] flex items-center justify-center mb-6">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-xs font-semibold text-[#2864D8]">
                    OPTION A · STUDENT WORKSPACE
                  </span>
                  <h2 className="font-display text-xl font-bold text-[#142B4F] mt-1.5 mb-3">
                    Student Login
                  </h2>
                  <p className="text-xs sm:text-sm text-[#68758A] leading-relaxed mb-6">
                    Access your personal Student Dashboard, rule-by-rule eligibility
                    matches, saved scholarships, and 6-stage application tracker.
                  </p>
                  <ul className="space-y-2.5 text-xs text-[#182334] mb-8">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Personalized Matched / Possibly Matched analysis</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Centralised document & application status tracker</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3.5 pt-5 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setError('');
                      setStep('student-login');
                    }}
                    className="btn-premium-primary w-full py-3.5 px-4 rounded-lg text-xs sm:text-sm font-semibold text-white bg-[#2864D8] hover:bg-[#142B4F] flex items-center justify-center gap-2"
                  >
                    <span>Continue to Student Login</span>
                    <ArrowRight className="w-4 h-4 icon-shift-right" />
                  </button>
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => onNavigate('register')}
                      className="text-xs font-semibold text-[#68758A] hover:text-[#142B4F] transition-colors"
                    >
                      New student? Create your Student Registration →
                    </button>
                  </div>
                </div>
              </div>

              {/* Option B: Administrator Login */}
              <div className="card-interactive bg-white border border-slate-200/90 rounded-2xl p-7 sm:p-8 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#142B4F] text-white flex items-center justify-center mb-6">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-xs font-semibold text-[#142B4F]">
                    OPTION B · GOVERNANCE CONSOLE
                  </span>
                  <h2 className="font-display text-xl font-bold text-[#142B4F] mt-1.5 mb-3">
                    Administrator Login
                  </h2>
                  <p className="text-xs sm:text-sm text-[#68758A] leading-relaxed mb-6">
                    Dedicated institutional console for managing opportunities,
                    auditing primary source circulars, and generating analytics
                    reports.
                  </p>
                  <ul className="space-y-2.5 text-xs text-[#182334] mb-8">
                    <li className="flex items-center gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-[#142B4F] shrink-0" />
                      <span>Primary source verification & expiry management</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-[#142B4F] shrink-0" />
                      <span>Catalogue governance & engagement analytics</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3.5 pt-5 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setError('');
                      setStep('admin-login');
                    }}
                    className="btn-premium-primary w-full py-3.5 px-4 rounded-lg text-xs sm:text-sm font-semibold text-white bg-[#142B4F] hover:bg-[#1E3A68] flex items-center justify-center gap-2"
                  >
                    <span>Continue to Administrator Login</span>
                    <ArrowRight className="w-4 h-4 icon-shift-right" />
                  </button>
                  <div className="text-center">
                    <span className="text-xs text-[#68758A]">
                      Requires institutional verifier credentials
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        )}

        {/* STEP 2A: DEDICATED STUDENT LOGIN INTERFACE */}
        {step === 'student-login' && (
          <RevealOnScroll className="w-full max-w-md">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-8 sm:p-10 shadow-sm">
              <button
                type="button"
                onClick={() => setStep('select-role')}
                className="group inline-flex items-center gap-1.5 text-xs font-semibold text-[#68758A] hover:text-[#142B4F] mb-6 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                <span>Back to Role Selection</span>
              </button>

              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-11 h-11 rounded-xl bg-[#EAF3FF] text-[#2864D8] flex items-center justify-center shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold tracking-wider text-[#2864D8] uppercase">
                    STUDENT PORTAL
                  </p>
                  <h1 className="font-display text-2xl font-extrabold text-[#142B4F]">
                    Student Sign In
                  </h1>
                </div>
              </div>

              {error && (
                <div className="mb-5 p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleStudentSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-[#182334] mb-2">
                    University / Student Email
                  </label>
                  <input
                    type="email"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-[#182334]"
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-semibold text-[#182334]">
                      Password
                    </label>
                    <span className="text-[11px] text-[#68758A]">
                      Sample student credentials ready
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type={showStudentPass ? 'text' : 'password'}
                      value={studentPassword}
                      onChange={(e) => setStudentPassword(e.target.value)}
                      className="w-full pl-4 pr-11 py-3 rounded-lg border border-slate-300 text-sm text-[#182334]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowStudentPass(!showStudentPass)}
                      aria-label={showStudentPass ? 'Hide password' : 'Show password'}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#68758A] hover:text-[#142B4F] transition-colors"
                    >
                      {showStudentPass ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-premium-primary w-full py-3.5 px-4 rounded-lg text-sm font-semibold text-white bg-[#2864D8] hover:bg-[#142B4F] flex items-center justify-center gap-2"
                >
                  <span>Sign In to Student Dashboard</span>
                  <span className="icon-shift-right">→</span>
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-slate-200 text-center">
                <p className="text-xs text-[#68758A]">
                  Don’t have a student profile yet?{' '}
                  <button
                    type="button"
                    onClick={() => onNavigate('register')}
                    className="font-semibold text-[#2864D8] hover:underline"
                  >
                    Register as a Student
                  </button>
                </p>
              </div>
            </div>
          </RevealOnScroll>
        )}

        {/* STEP 2B: DEDICATED ADMINISTRATOR LOGIN INTERFACE */}
        {step === 'admin-login' && (
          <RevealOnScroll className="w-full max-w-md">
            <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-[#142B4F] text-white p-7 sm:p-8">
                <button
                  type="button"
                  onClick={() => setStep('select-role')}
                  className="group inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white mb-4 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                  <span>Back to Role Selection</span>
                </button>
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-white/10 text-[#93C5FD] flex items-center justify-center shrink-0">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold tracking-wider text-[#93C5FD] uppercase">
                      INSTITUTIONAL GOVERNANCE
                    </p>
                    <h1 className="font-display text-xl font-extrabold text-white">
                      Administrator Sign In
                    </h1>
                  </div>
                </div>
              </div>

              <div className="p-8 sm:p-10">
                {error && (
                  <div className="mb-5 p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
                    {error}
                  </div>
                )}

                <form onSubmit={handleAdminSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-[#182334] mb-2">
                      Institutional Administrator Email
                    </label>
                    <input
                      type="email"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-[#182334]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#182334] mb-2">
                      Verification Desk Badge ID
                    </label>
                    <input
                      type="text"
                      value={adminBadgeId}
                      onChange={(e) => setAdminBadgeId(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm font-mono text-[#182334]"
                      required
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-semibold text-[#182334]">
                        Administrator Password
                      </label>
                      <span className="text-[11px] text-[#68758A]">
                        Demo credentials pre-filled
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type={showAdminPass ? 'text' : 'password'}
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        className="w-full pl-4 pr-11 py-3 rounded-lg border border-slate-300 text-sm text-[#182334]"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowAdminPass(!showAdminPass)}
                        aria-label={showAdminPass ? 'Hide password' : 'Show password'}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#68758A] hover:text-[#142B4F] transition-colors"
                      >
                        {showAdminPass ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn-premium-primary w-full py-3.5 px-4 rounded-lg text-sm font-semibold text-white bg-[#142B4F] hover:bg-[#2864D8] flex items-center justify-center gap-2"
                  >
                    <span>Authenticate into Admin Dashboard</span>
                    <span className="icon-shift-right">→</span>
                  </button>
                </form>
              </div>
            </div>
          </RevealOnScroll>
        )}
      </main>

      <PublicFooter onNavigate={onNavigate} />
    </div>
  );
};

// ============================================================================
// 4. STUDENT REGISTRATION PAGE
// ============================================================================
export const RegisterPage: React.FC<{
  initialProfile: StudentProfileData;
  onNavigate: (page: PageId) => void;
  onCompleteRegistration: (updatedProfile: StudentProfileData) => void;
}> = ({ initialProfile, onNavigate, onCompleteRegistration }) => {
  const [fullName, setFullName] = useState(initialProfile.fullName);
  const [email, setEmail] = useState(initialProfile.email);
  const [institution, setInstitution] = useState(initialProfile.institution);
  const [educationLevel, setEducationLevel] = useState<EducationLevel>(
    initialProfile.educationLevel
  );
  const [fieldOfStudy, setFieldOfStudy] = useState(initialProfile.fieldOfStudy);
  const [gpa, setGpa] = useState(String(initialProfile.gpa));
  const [income, setIncome] = useState(String(initialProfile.annualHouseholdIncome));
  const [firstGen, setFirstGen] = useState<'Yes' | 'No' | 'Unverified'>('Yes');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericGpa = parseFloat(gpa);
    const numericIncome = parseFloat(income);

    if (!fullName.trim() || !email.includes('@')) {
      setError('Please enter your full name and a valid academic email.');
      return;
    }
    if (isNaN(numericGpa) || numericGpa < 0 || numericGpa > 4.0) {
      setError('Please enter a valid GPA between 0.00 and 4.00.');
      return;
    }
    if (isNaN(numericIncome) || numericIncome < 0) {
      setError('Please enter a valid annual household income figure.');
      return;
    }

    onCompleteRegistration({
      ...initialProfile,
      fullName: fullName.trim(),
      email: email.trim(),
      institution: institution.trim(),
      educationLevel,
      fieldOfStudy,
      gpa: numericGpa,
      annualHouseholdIncome: numericIncome,
      firstGenerationStudent: firstGen,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFD]">
      <PublicNavbar currentPage="register" onNavigate={onNavigate} />

      <main className="flex-1 py-16 lg:py-20 px-4 sm:px-6">
        <RevealOnScroll className="max-w-2xl mx-auto">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-7 sm:p-10 shadow-sm">
            <div className="mb-8">
              <p className="text-xs font-bold tracking-widest text-[#2864D8] uppercase mb-2">
                STUDENT REGISTRATION & ELIGIBILITY ONBOARDING
              </p>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#142B4F]">
                Create Your ScholarBridge Student Account
              </h1>
              <p className="text-sm text-[#68758A] mt-2 leading-relaxed">
                Your academic and household details are used strictly to evaluate
                scholarship and fellowship eligibility rules transparently.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-[#182334] mb-2">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-[#182334]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#182334] mb-2">
                    University / Student Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-[#182334]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-[#182334] mb-2">
                    Current Institution
                  </label>
                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-[#182334]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#182334] mb-2">
                    Education Level
                  </label>
                  <select
                    value={educationLevel}
                    onChange={(e) => setEducationLevel(e.target.value as EducationLevel)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-[#182334] bg-white"
                  >
                    <option value="High School Senior">High School Senior</option>
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Postgraduate">Postgraduate</option>
                    <option value="Doctoral">Doctoral</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="sm:col-span-1">
                  <label className="block text-xs font-semibold text-[#182334] mb-2">
                    Field of Study / Major
                  </label>
                  <select
                    value={fieldOfStudy}
                    onChange={(e) => setFieldOfStudy(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-[#182334] bg-white"
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
                    Cumulative GPA (4.0 Scale)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="4.0"
                    value={gpa}
                    onChange={(e) => setGpa(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm font-mono text-[#182334]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#182334] mb-2">
                    Annual Household Income ($)
                  </label>
                  <input
                    type="number"
                    step="500"
                    min="0"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm font-mono text-[#182334]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#182334] mb-2">
                  First-Generation University Student Status
                </label>
                <div className="grid grid-cols-3 gap-3.5">
                  {(['Yes', 'No', 'Unverified'] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setFirstGen(option)}
                      className={`btn-premium-secondary py-3 px-3 rounded-lg text-xs font-semibold border ${
                        firstGen === option
                          ? 'bg-[#EAF3FF] border-[#2864D8] text-[#142B4F]'
                          : 'bg-white border-slate-200 text-[#68758A] hover:text-[#182334]'
                      }`}
                    >
                      {option === 'Yes'
                        ? 'Yes (First-Gen)'
                        : option === 'No'
                        ? 'No'
                        : 'Clarify Later'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => onNavigate('login')}
                  className="text-xs font-semibold text-[#68758A] hover:text-[#142B4F] transition-colors"
                >
                  Already registered? Sign in instead
                </button>

                <button
                  type="submit"
                  className="btn-premium-primary w-full sm:w-auto px-6 py-3.5 rounded-lg text-sm font-semibold text-white bg-[#142B4F] hover:bg-[#2864D8] inline-flex items-center justify-center gap-2"
                >
                  <span>Complete Registration & Open Student Dashboard</span>
                  <span className="icon-shift-right">→</span>
                </button>
              </div>
            </form>
          </div>
        </RevealOnScroll>
      </main>

      <PublicFooter onNavigate={onNavigate} />
    </div>
  );
};
