"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { CriterionStatusIndicator } from '@/src/components/BrandMark';
import { useTheme, AnimatedCounter } from '@/src/components/MotionPrimitives';

export const cn = (...classes: (string | undefined | null | false)[]) =>
  classes.filter(Boolean).join(' ');

export interface AetherFlowHeroProps {
  onPrimaryCta?: () => void;
  onSecondaryCta?: () => void;
  onInspectSample?: (id: string) => void;
}

const AetherFlowHero: React.FC<AetherFlowHeroProps> = ({
  onPrimaryCta,
  onSecondaryCta,
  onInspectSample,
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [previewExpandedCriteria, setPreviewExpandedCriteria] =
    React.useState(true);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const mouse: { x: number | null; y: number | null; radius: number } = {
      x: null,
      y: null,
      radius: 200,
    };

    class Particle {
      x: number;
      y: number;
      directionX: number;
      directionY: number;
      size: number;
      color: string;

      constructor(
        x: number,
        y: number,
        directionX: number,
        directionY: number,
        size: number,
        color: string
      ) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      update() {
        if (!canvas) return;
        if (this.x > canvas.width || this.x < 0) {
          this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
          this.directionY = -this.directionY;
        }

        // Interactive cursor untangling / repulsion physics
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius + this.size && distance > 0) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (mouse.radius - distance) / mouse.radius;
            this.x -= forceDirectionX * force * 5;
            this.y -= forceDirectionY * force * 5;
          }
        }

        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
      }
    }

    function init() {
      if (!canvas) return;
      particles = [];
      const numberOfParticles = Math.min(
        135,
        Math.max(55, (canvas.height * canvas.width) / 9500)
      );
      for (let i = 0; i < numberOfParticles; i++) {
        const size = Math.random() * 2.2 + 1.2;
        const x = Math.random() * (canvas.width - size * 4) + size * 2;
        const y = Math.random() * (canvas.height - size * 4) + size * 2;
        const directionX = Math.random() * 0.42 - 0.21;
        const directionY = Math.random() * 0.42 - 0.21;
        // Dark, clearly visible particle nodes in light mode; luminous sky-blue nodes in dark mode
        const color = isDark
          ? 'rgba(96, 165, 250, 0.85)'
          : 'rgba(20, 43, 79, 0.72)';
        particles.push(
          new Particle(x, y, directionX, directionY, size, color)
        );
      }
    }

    const resizeCanvas = () => {
      if (!canvas) return;
      const parent = canvas.parentElement;
      canvas.width = parent ? parent.clientWidth : window.innerWidth;
      canvas.height = parent ? parent.clientHeight : window.innerHeight;
      init();
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const connect = () => {
      if (!canvas || !ctx) return;
      let opacityValue = 1;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          const distance =
            (particles[a].x - particles[b].x) *
              (particles[a].x - particles[b].x) +
            (particles[a].y - particles[b].y) *
              (particles[a].y - particles[b].y);

          if (distance < (canvas.width / 7) * (canvas.height / 7)) {
            opacityValue = Math.max(0, 1 - distance / 20000);

            const dx_mouse_a =
              mouse.x !== null ? particles[a].x - mouse.x : Infinity;
            const dy_mouse_a =
              mouse.y !== null ? particles[a].y - mouse.y : Infinity;
            const distance_mouse_a = Math.sqrt(
              dx_mouse_a * dx_mouse_a + dy_mouse_a * dy_mouse_a
            );

            if (mouse.x !== null && distance_mouse_a < mouse.radius) {
              // Active untangling highlight near cursor
              ctx.strokeStyle = isDark
                ? `rgba(234, 243, 255, ${Math.min(0.95, opacityValue * 0.9)})`
                : `rgba(40, 100, 216, ${Math.min(0.9, opacityValue * 0.85)})`;
              ctx.lineWidth = 1.4;
            } else {
              // Clearly visible dark web lines (not over, not faded out)
              ctx.strokeStyle = isDark
                ? `rgba(59, 130, 246, ${opacityValue * 0.58})`
                : `rgba(20, 43, 79, ${opacityValue * 0.45})`;
              ctx.lineWidth = 1.15;
            }

            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      if (!canvas || !ctx) return;
      animationFrameId = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
      }
      connect();
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
    };

    const handleMouseOut = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseOut);

    init();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseOut);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark]);

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.11 + 0.08,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  return (
    <section
      className={`relative w-full overflow-hidden border-b transition-colors duration-300 py-20 sm:py-24 lg:py-28 ${
        isDark
          ? 'bg-[#081224] border-slate-800'
          : 'bg-gradient-to-b from-[#EAF3FF]/85 via-[#F4F8FE] to-[#F8FAFD] border-slate-200/90'
      }`}
    >
      {/* Interactive Untangling Web Network Canvas — Unobstructed & Clearly Visible */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      <div className="relative z-10 max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        {/* 1. Centered Vertical Hero Text & CTA Composition */}
        <div className="w-full max-w-3xl mx-auto flex flex-col items-center text-center">
          {/* Eyebrow Badge -> 24px gap to Heading */}
          <motion.div
            custom={0}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-6 backdrop-blur-xs shadow-2xs ${
              isDark
                ? 'bg-[#2864D8]/25 border-[#60A5FA]/40 text-[#EAF3FF]'
                : 'bg-white/90 border-[#2864D8]/30 text-[#142B4F]'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-[#2864D8]" />
            <span className="text-xs font-bold tracking-widest uppercase">
              YOUR FUTURE. MORE POSSIBILITIES.
            </span>
          </motion.div>

          {/* Main Heading -> Constrained max-width + 24px gap to Description */}
          <motion.h1
            custom={1}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className={`font-display font-extrabold tracking-tight leading-[1.12] balance-text max-w-3xl mx-auto mb-6 ${
              isDark
                ? 'text-white'
                : 'text-[#142B4F]'
            }`}
            style={{ fontSize: 'clamp(2.25rem, 4.2vw, 3.75rem)' }}
          >
            The Right Opportunity Can{' '}
            <span className={isDark ? 'text-[#93C5FD]' : 'text-[#2864D8]'}>
              Change Everything.
            </span>
          </motion.h1>

          {/* Supporting Description -> Constrained max-w-2xl + 36px gap to CTAs */}
          <motion.p
            custom={2}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className={`max-w-2xl mx-auto text-base sm:text-lg leading-relaxed mb-9 ${
              isDark ? 'text-slate-300' : 'text-[#182334]/85'
            }`}
          >
            Discover scholarships, financial support and internships that match
            your education, aspirations and eligibility — all in one trusted
            place.
          </motion.p>

          {/* Side-by-Side CTA Buttons with Premium Hover & Light Sweep */}
          <motion.div
            custom={3}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap items-center justify-center gap-4 mb-10"
          >
            <button
              type="button"
              onClick={onPrimaryCta}
              className="btn-premium-primary group px-7 py-3.5 bg-[#142B4F] text-white font-semibold text-sm rounded-lg shadow-md hover:bg-[#2864D8] inline-flex items-center justify-center gap-2.5 whitespace-nowrap shrink-0"
            >
              <span>Find My Opportunities</span>
              <ArrowRight className="h-4 w-4 icon-shift-right" />
            </button>

            <button
              type="button"
              onClick={onSecondaryCta}
              className={`btn-premium-secondary group px-7 py-3.5 font-semibold text-sm rounded-lg border backdrop-blur-xs inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0 ${
                isDark
                  ? 'bg-white/10 text-white border-white/25 hover:bg-white/20'
                  : 'bg-white/95 text-[#142B4F] border-slate-300 hover:border-[#2864D8]'
              }`}
            >
              <span>Explore Opportunities</span>
            </button>
          </motion.div>

          {/* Centered & Evenly Distributed Trust Indicators */}
          <motion.div
            custom={4}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className={`w-full pt-6 border-t flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs sm:text-sm ${
              isDark
                ? 'border-white/15 text-slate-200'
                : 'border-slate-300/80 text-[#182334]'
            }`}
          >
            <span className="inline-flex items-center gap-2 font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#2864D8] shrink-0" />
              <span>Source-verified institutional links</span>
            </span>
            <span className="inline-flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-[#2864D8] shrink-0" />
              <span>Transparent rule-based eligibility</span>
            </span>
            <span className="inline-flex items-center gap-2 font-semibold">
              <Calendar className="w-4 h-4 text-[#2864D8] shrink-0" />
              <span>Proactive deadline tracking</span>
            </span>
          </motion.div>
        </div>

        {/* 2. Centered Product-Preview Composition Below Hero Copy */}
        <motion.div
          custom={5}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-4xl mx-auto mt-14 sm:mt-16"
        >
          <div className="card-interactive w-full bg-white rounded-2xl border border-slate-200/90 shadow-xl overflow-hidden text-[#182334] text-left">
            {/* Product Preview Window Header */}
            <div className="px-6 py-4 bg-[#142B4F] text-white flex flex-wrap items-center justify-between gap-4 border-b border-white/10">
              <div className="flex items-center gap-3 min-w-0">
                <span className="font-display text-xs sm:text-sm font-bold tracking-tight text-white truncate">
                  ScholarBridge Student Navigator Preview
                </span>
                <span aria-hidden="true" className="text-slate-400">·</span>
                <span className="text-xs text-[#93C5FD] truncate">
                  Aarav Mehta (B.Tech CS ·{' '}
                  <AnimatedCounter value={3.78} decimals={2} /> GPA)
                </span>
              </div>
              <span className="text-xs font-medium text-[#EAF3FF] whitespace-nowrap shrink-0">
                Live Eligibility Preview
              </span>
            </div>

            {/* Product Preview Content Grid */}
            <div className="p-6 sm:p-8 bg-[#F8FAFD] space-y-6">
              {/* Top Row: Verified Opportunity Indicator + Upcoming Deadline Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="card-interactive bg-white p-5 rounded-xl border border-slate-200/90 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-[#68758A] mb-2">
                    <span>Verification Registry</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  </div>
                  <p className="font-display text-sm font-bold text-[#182334]">
                    Verified Opportunity Source
                  </p>
                  <p className="text-xs text-emerald-700 font-medium mt-1.5">
                    Audit #SB-904 · Official Institutional Circular
                  </p>
                </div>

                <div className="card-interactive bg-white p-5 rounded-xl border border-slate-200/90 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-[#68758A] mb-2">
                    <span>Upcoming Deadline Alert</span>
                    <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
                  </div>
                  <p className="font-display text-sm font-bold text-[#182334] truncate">
                    BridgeAccess Fee Relief Grant
                  </p>
                  <p className="font-mono text-xs text-amber-700 font-semibold mt-1.5 tabular-nums">
                    Closes Nov 12, 2026 ·{' '}
                    <AnimatedCounter value={13} suffix=" days left" />
                  </p>
                </div>
              </div>

              {/* Scholarship Match Card + Eligibility Status Badge */}
              <div className="card-interactive bg-white rounded-xl border border-slate-200/90 p-6">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2 text-xs text-[#68758A]">
                    <span className="font-semibold text-[#2864D8]">
                      Merit Scholarship
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>Illustrative Sample</span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Eligibility Status: Matched (All 5 Criteria Met)</span>
                  </span>
                </div>

                <h2 className="font-display text-lg font-bold text-[#142B4F] mb-1.5">
                  Horizon STEM Academic Excellence Fellowship
                </h2>
                <p className="text-xs sm:text-sm text-[#68758A] mb-5">
                  Horizon Education Foundation ·{' '}
                  <span className="font-mono font-semibold text-[#182334] tabular-nums">
                    <AnimatedCounter value={8500} prefix="$" suffix=" / yr" />
                  </span>{' '}
                  tuition & research grant
                </p>

                {/* Expandable Rule Check inside Preview */}
                <div className="border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={() =>
                      setPreviewExpandedCriteria(!previewExpandedCriteria)
                    }
                    className="w-full flex items-center justify-between text-xs font-semibold text-[#142B4F] hover:text-[#2864D8] transition-colors"
                  >
                    <span>Why this result? (Rule-by-rule eligibility check)</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${
                        previewExpandedCriteria ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {previewExpandedCriteria && (
                    <div className="mt-3.5 space-y-2.5 text-xs">
                      <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                        <span className="text-[#68758A]">
                          Education Level:{' '}
                          <strong className="text-[#182334] font-medium">
                            Undergraduate
                          </strong>
                        </span>
                        <CriterionStatusIndicator status="Satisfied" />
                      </div>
                      <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                        <span className="text-[#68758A]">
                          Cumulative GPA:{' '}
                          <strong className="font-mono text-[#182334] font-medium tabular-nums">
                            <AnimatedCounter value={3.78} decimals={2} /> ≥ 3.50
                          </strong>
                        </span>
                        <CriterionStatusIndicator status="Satisfied" />
                      </div>
                      <div className="flex items-center justify-between py-1.5">
                        <span className="text-[#68758A]">
                          Household Income:{' '}
                          <strong className="font-mono text-[#182334] font-medium tabular-nums">
                            <AnimatedCounter value={34000} prefix="$" /> ≤{' '}
                            <AnimatedCounter value={75000} prefix="$" />
                          </strong>
                        </span>
                        <CriterionStatusIndicator status="Satisfied" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                  <span className="font-mono text-xs text-[#68758A] tabular-nums">
                    Application Deadline: 2026-11-18
                  </span>
                  <button
                    type="button"
                    onClick={() => onInspectSample?.('opp-101')}
                    className="group inline-flex items-center gap-1 text-xs font-semibold text-[#2864D8] hover:text-[#142B4F] transition-colors"
                  >
                    <span>View Opportunity Details</span>
                    <span className="icon-shift-right">→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AetherFlowHero;
