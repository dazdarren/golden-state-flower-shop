'use client';

import { useEffect } from 'react';
import { logWebVitals } from '@/lib/webVitals';

/**
 * Component to enable Web Vitals monitoring
 * Add this to your root layout to start collecting metrics
 */
export default function WebVitals() {
  useEffect(() => {
    logWebVitals();
  }, []);

  return null;
}
