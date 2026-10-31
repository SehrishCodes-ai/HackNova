import React, { useState } from 'react';
import {
  ShieldCheck,
  Clock,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  XCircle,
  Bookmark,
  ArrowUpRight,
} from 'lucide-react';
import { Opportunity, VerificationStatus, CriterionStatus } from '../types';
import { AnimatedCounter } from './MotionPrimitives';

export const ScholarBridgeLogo: React.FC<{
  variant?: 'dark' | 'light';
  onClick?: () => void;
}> = ({ variant = 'dark', onClick }) => {
  const isLight = variant === 'light';
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2864D8] rounded-lg py-1 whitespace-nowrap shrink-0 group"
    >
      <span className="w-9 h-9 rounded-lg bg-[#142B4F] flex items-center justify-center border border-[#2864D8]/35 shadow-2xs shrink-0 transition-transform duration-200 group-hover:scale-105">
        <svg
          width="19"
          height="19"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M3 17C5.5 11.5 9.2 9 12 9C14.8 9 18.5 11.5 21 17"
            stroke="#EAF3FF"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M2 17H22"
            stroke="#2864D8"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M7.5 17V11.5M12 17V9M16.5 17V11.5"
            stroke="#EAF3FF"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <circle cx="12" cy="5" r="2" fill="#2864D8" />
        </svg>
      </span>
      <span
        className={`font-display text-lg sm:text-xl font-bold tracking-tight whitespace-nowrap shrink-0 transition-colors ${
          isLight ? 'text-white' : 'text-[#142B4F]'
        }`}
      >
        Scholar<span className={isLight ? 'text-[#93C5FD]' : 'text-[#2864D8]'}>Bridge</span>
      </span>
    </button>
  );
};

export const VerificationIndicator: React.FC<{
  status: VerificationStatus;
  showAudit?: string;
}> = ({ status, showAudit }) => {
  if (status === 'Verified') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 whitespace-nowrap shrink-0">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span>Verified Source</span>
        {showAudit && (
          <>
            <span aria-hidden="true" className="text-[#68758A]">·</span>
            <span className="text-[#68758A] font-normal">{showAudit}</span>
          </>
        )}
      </span>
    );
  }
  if (status === 'Pending Review') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 whitespace-nowrap shrink-0">
        <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
        <span>Pending Source Review</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#68758A] whitespace-nowrap shrink-0">
      <AlertCircle className="w-3.5 h-3.5 text-[#68758A] shrink-0" />
      <span>Cycle Closed (Expired)</span>
    </span>
  );
};

export const CriterionStatusIndicator: React.FC<{ status: CriterionStatus }> = ({ status }) => {
  if (status === 'Satisfied') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 whitespace-nowrap shrink-0">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span>Satisfied</span>
      </span>
    );
  }
  if (status === 'Needs clarification') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 whitespace-nowrap shrink-0">
        <HelpCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
        <span>Needs clarification</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 whitespace-nowrap shrink-0">
      <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
      <span>Not satisfied</span>
    </span>
  );
};

export const OpportunityCard: React.FC<{
  opportunity: Opportunity;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onViewDetails: (id: string) => void;
  matchStatusLabel?: 'Matched' | 'Possibly Matched' | 'Ineligible';
}> = ({ opportunity, isSaved, onToggleSave, onViewDetails, matchStatusLabel }) => {
  const isUrgent = opportunity.daysRemaining > 0 && opportunity.daysRemaining <= 14;
  const [justSavedPulse, setJustSavedPulse] = useState(false);

  const handleSaveClick = () => {
    setJustSavedPulse(true);
    onToggleSave(opportunity.id);
    setTimeout(() => setJustSavedPulse(false), 450);
  };

  return (
    <article className="card-interactive group h-full bg-white border border-slate-200/90 rounded-xl p-6 sm:p-7 flex flex-col justify-between">
      <div>
        {/* Quiet 1-line unboxed metadata header */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#68758A] mb-3.5">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-semibold text-[#2864D8] truncate">{opportunity.category}</span>
            <span aria-hidden="true">·</span>
            <span className="truncate">{opportunity.educationLevels.join(', ')}</span>
            <span aria-hidden="true">·</span>
            <span>{opportunity.location}</span>
          </div>
          <VerificationIndicator status={opportunity.verificationStatus} />
        </div>

        {/* Title & Provider */}
        <h3 className="font-display text-lg font-bold text-[#182334] leading-snug mb-2">
          <button
            type="button"
            onClick={() => onViewDetails(opportunity.id)}
            className="text-left hover:text-[#2864D8] transition-colors focus:outline-none focus-visible:underline"
          >
            {opportunity.title}
          </button>
        </h3>
        <p className="text-xs text-[#68758A] mb-5">
          Provided by <span className="font-medium text-[#182334]">{opportunity.provider}</span>
        </p>

        {/* Financial & Support Benefit Callout */}
        <div className="py-4 border-y border-slate-100 mb-5 flex items-baseline justify-between gap-4">
          <div>
            <span className="block text-[11px] text-[#68758A] mb-1">Annual Support Value</span>
            <span className="font-mono text-base sm:text-lg font-semibold text-[#142B4F] tabular-nums">
              <AnimatedCounter value={opportunity.annualValueNumeric} prefix="$" />
            </span>
          </div>
          <div className="text-right">
            <span className="block text-[11px] text-[#68758A] mb-1">Application Deadline</span>
            <span
              className={`font-mono text-xs sm:text-sm font-medium tabular-nums ${
                opportunity.daysRemaining < 0
                  ? 'text-[#68758A]'
                  : isUrgent
                  ? 'text-amber-700 font-semibold'
                  : 'text-[#182334]'
              }`}
            >
              {opportunity.deadline}{' '}
              {opportunity.daysRemaining >= 0 ? (
                <>
                  (<AnimatedCounter value={opportunity.daysRemaining} suffix="d left" />)
                </>
              ) : (
                '(Closed)'
              )}
            </span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-[#68758A] leading-relaxed line-clamp-2 mb-6">
          {opportunity.benefitsSummary}
        </p>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleSaveClick}
            aria-label={isSaved ? 'Remove from saved opportunities' : 'Save opportunity'}
            className={`btn-premium-secondary inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg text-xs font-medium border whitespace-nowrap shrink-0 ${
              isSaved
                ? 'bg-[#EAF3FF] border-[#2864D8]/30 text-[#142B4F]'
                : 'bg-white border-slate-200 text-[#68758A] hover:text-[#182334] hover:border-slate-300'
            }`}
          >
            <Bookmark
              className={`w-3.5 h-3.5 transition-transform duration-300 ${
                isSaved ? 'fill-[#2864D8] text-[#2864D8]' : ''
              } ${justSavedPulse ? 'scale-125' : 'scale-100'}`}
            />
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>

          {matchStatusLabel && (
            <span className="text-xs text-[#68758A] hidden sm:inline">
              <span aria-hidden="true">· </span>
              <span
                className={
                  matchStatusLabel === 'Matched'
                    ? 'text-emerald-700 font-medium'
                    : matchStatusLabel === 'Possibly Matched'
                    ? 'text-amber-700 font-medium'
                    : 'text-[#68758A]'
                }
              >
                {matchStatusLabel}
              </span>
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => onViewDetails(opportunity.id)}
          className="btn-premium-primary inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold bg-[#142B4F] text-white hover:bg-[#2864D8] whitespace-nowrap shrink-0"
        >
          <span>View Details</span>
          <ArrowUpRight className="w-3.5 h-3.5 icon-shift-up-right" />
        </button>
      </div>
    </article>
  );
};
