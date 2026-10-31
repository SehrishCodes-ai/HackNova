import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Sun, Moon } from 'lucide-react';

// ============================================================================
// 1. LIGHT / DARK THEME CONTEXT & TOGGLE
// ============================================================================
type ThemeMode = 'light' | 'dark';

interface ThemeContextValue {
  theme: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem('scholarbridge-theme');
      if (saved === 'dark' || saved === 'light') return saved;
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      window.localStorage.setItem('scholarbridge-theme', theme);
    } catch {
      // ignore storage errors
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const ThemeToggle: React.FC<{ variant?: 'default' | 'sidebar' }> = ({
  variant = 'default',
}) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`relative inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border transition-all duration-200 active:scale-95 shrink-0 ${
        variant === 'sidebar'
          ? 'border-white/15 bg-white/10 text-white hover:bg-white/20'
          : 'border-slate-200/90 bg-white text-[#142B4F] hover:border-[#2864D8]/60 hover:bg-[#EAF3FF]/50 dark:bg-slate-800/90 dark:border-slate-700 dark:text-slate-100 dark:hover:border-[#60A5FA]'
      }`}
    >
      <span className="relative w-4 h-4 flex items-center justify-center overflow-hidden">
        <Sun
          className={`w-4 h-4 text-amber-500 transition-all duration-300 ${
            isDark
              ? 'rotate-90 scale-0 opacity-0 absolute'
              : 'rotate-0 scale-100 opacity-100'
          }`}
        />
        <Moon
          className={`w-4 h-4 text-[#60A5FA] transition-all duration-300 ${
            isDark
              ? 'rotate-0 scale-100 opacity-100'
              : '-rotate-90 scale-0 opacity-0 absolute'
          }`}
        />
      </span>
      <span className="hidden sm:inline">
        {isDark ? 'Dark' : 'Light'}
      </span>
    </button>
  );
};

// ============================================================================
// 2. SCROLL-TRIGGERED REVEAL COMPONENT (INTERSECTION OBSERVER)
// ============================================================================
interface RevealOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
  direction?: 'up' | 'fade' | 'scale';
  threshold?: number;
}

export const RevealOnScroll: React.FC<RevealOnScrollProps> = ({
  children,
  className = '',
  delayMs = 0,
  direction = 'up',
  threshold = 0.12,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin: '0px 0px -30px 0px' }
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  const hiddenTransform =
    direction === 'up'
      ? 'translate-y-4 opacity-0'
      : direction === 'scale'
      ? 'scale-[0.98] opacity-0'
      : 'opacity-0';

  const visibleTransform = 'translate-y-0 scale-100 opacity-100';

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: `${delayMs}ms`,
        transitionDuration: '550ms',
        transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
      }}
      className={`transition-all will-change-[transform,opacity] ${
        isVisible ? visibleTransform : hiddenTransform
      } ${className}`}
    >
      {children}
    </div>
  );
};

// ============================================================================
// 3. ANIMATED NUMBER COUNTER (INTERSECTION OBSERVER, RUNS ONCE)
// ============================================================================
interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  durationMs?: number;
  className?: string;
  formatCommas?: boolean;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  durationMs = 1100,
  className = '',
  formatCommas = true,
}) => {
  const spanRef = useRef<HTMLSpanElement | null>(null);
  const [displayValue, setDisplayValue] = useState<number>(0);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setDisplayValue(value);
      return;
    }

    const node = spanRef.current;
    if (!node) return;

    let animationFrameId: number;

    const startAnimation = () => {
      const startTime = performance.now();
      const target = value;

      const step = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / durationMs);
        // Smooth ease-out quartic curve
        const eased = 1 - Math.pow(1 - progress, 4);
        const current = target * eased;
        setDisplayValue(current);

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(step);
        } else {
          setDisplayValue(target);
        }
      };

      animationFrameId = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!hasAnimatedRef.current) {
              hasAnimatedRef.current = true;
              startAnimation();
            } else {
              setDisplayValue(value);
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [value, durationMs]);

  const formattedNumber = (() => {
    const fixed = displayValue.toFixed(decimals);
    if (!formatCommas) return fixed;
    const parts = fixed.split('.');
    parts[0] = Number(parts[0]).toLocaleString('en-US');
    return parts.join('.');
  })();

  return (
    <span ref={spanRef} className={`tabular-nums ${className}`}>
      {prefix}
      {formattedNumber}
      {suffix}
    </span>
  );
};
