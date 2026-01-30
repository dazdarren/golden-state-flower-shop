/**
 * Web Vitals monitoring and reporting
 * Tracks LCP, FID, CLS, FCP, and TTFB
 */

type MetricName = 'LCP' | 'FID' | 'CLS' | 'FCP' | 'TTFB' | 'INP';

interface Metric {
  name: MetricName;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
}

type ReportCallback = (metric: Metric) => void;

// Thresholds based on Google's Web Vitals guidelines
const THRESHOLDS: Record<MetricName, { good: number; poor: number }> = {
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 800, poor: 1800 },
  INP: { good: 200, poor: 500 },
};

function getRating(name: MetricName, value: number): Metric['rating'] {
  const threshold = THRESHOLDS[name];
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

function generateId(): string {
  return `v${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Report Web Vitals to analytics or logging service
 */
export function reportWebVitals(onReport: ReportCallback) {
  if (typeof window === 'undefined') return;

  // Largest Contentful Paint
  try {
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1] as PerformanceEntry & { startTime: number };

      if (lastEntry) {
        const value = lastEntry.startTime;
        onReport({
          name: 'LCP',
          value,
          rating: getRating('LCP', value),
          delta: value,
          id: generateId(),
        });
      }
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch {
    // LCP not supported
  }

  // First Input Delay
  try {
    const fidObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries() as Array<PerformanceEntry & { processingStart: number; startTime: number }>;

      entries.forEach((entry) => {
        const value = entry.processingStart - entry.startTime;
        onReport({
          name: 'FID',
          value,
          rating: getRating('FID', value),
          delta: value,
          id: generateId(),
        });
      });
    });
    fidObserver.observe({ type: 'first-input', buffered: true });
  } catch {
    // FID not supported
  }

  // Cumulative Layout Shift
  try {
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries() as Array<PerformanceEntry & { hadRecentInput: boolean; value: number }>;

      entries.forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
    });
    clsObserver.observe({ type: 'layout-shift', buffered: true });

    // Report CLS on page hide
    const reportCLS = () => {
      onReport({
        name: 'CLS',
        value: clsValue,
        rating: getRating('CLS', clsValue),
        delta: clsValue,
        id: generateId(),
      });
    };

    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        reportCLS();
      }
    });

    window.addEventListener('pagehide', reportCLS);
  } catch {
    // CLS not supported
  }

  // First Contentful Paint
  try {
    const fcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const fcpEntry = entries.find((entry) => entry.name === 'first-contentful-paint') as PerformanceEntry & { startTime: number };

      if (fcpEntry) {
        const value = fcpEntry.startTime;
        onReport({
          name: 'FCP',
          value,
          rating: getRating('FCP', value),
          delta: value,
          id: generateId(),
        });
      }
    });
    fcpObserver.observe({ type: 'paint', buffered: true });
  } catch {
    // FCP not supported
  }

  // Time to First Byte
  try {
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationEntry) {
      const value = navigationEntry.responseStart - navigationEntry.requestStart;
      onReport({
        name: 'TTFB',
        value,
        rating: getRating('TTFB', value),
        delta: value,
        id: generateId(),
      });
    }
  } catch {
    // TTFB not supported
  }

  // Interaction to Next Paint (INP)
  try {
    let inpValue = 0;
    const inpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries() as Array<PerformanceEntry & { duration: number }>;

      entries.forEach((entry) => {
        if (entry.duration > inpValue) {
          inpValue = entry.duration;
        }
      });
    });
    inpObserver.observe({ type: 'event', buffered: true });

    // Report INP on page hide
    const reportINP = () => {
      if (inpValue > 0) {
        onReport({
          name: 'INP',
          value: inpValue,
          rating: getRating('INP', inpValue),
          delta: inpValue,
          id: generateId(),
        });
      }
    };

    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        reportINP();
      }
    });

    window.addEventListener('pagehide', reportINP);
  } catch {
    // INP not supported
  }
}

/**
 * Log Web Vitals to console in development
 */
export function logWebVitals() {
  if (process.env.NODE_ENV !== 'development') return;

  reportWebVitals((metric) => {
    const color =
      metric.rating === 'good'
        ? 'color: green'
        : metric.rating === 'needs-improvement'
        ? 'color: orange'
        : 'color: red';

    console.log(
      `%c[Web Vitals] ${metric.name}: ${metric.value.toFixed(2)} (${metric.rating})`,
      color
    );
  });
}

/**
 * Send Web Vitals to an analytics endpoint
 */
export function sendToAnalytics(endpoint: string) {
  reportWebVitals((metric) => {
    const body = JSON.stringify({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      id: metric.id,
      page: window.location.pathname,
      timestamp: Date.now(),
    });

    // Use sendBeacon if available for reliability
    if (navigator.sendBeacon) {
      navigator.sendBeacon(endpoint, body);
    } else {
      fetch(endpoint, {
        method: 'POST',
        body,
        keepalive: true,
        headers: { 'Content-Type': 'application/json' },
      }).catch(() => {
        // Silently fail
      });
    }
  });
}
