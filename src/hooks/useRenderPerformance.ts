/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Lightweight performance monitoring hook to measure and log component re-renders
 * and detect any animation or tab switching latency bottlenecks.
 */

import { useEffect, useRef } from 'react';

export function useRenderPerformance(componentName: string, enabled: boolean = true) {
  const renderStartTime = useRef<number>(performance.now());
  const renderCount = useRef<number>(0);

  renderStartTime.current = performance.now();
  renderCount.current += 1;

  useEffect(() => {
    if (!enabled) return;
    const renderEndTime = performance.now();
    const duration = renderEndTime - renderStartTime.current;

    // Log if slow or in dev inspection
    if (duration > 16) {
      console.warn(
        `[Perf Warning] ${componentName} (render #${renderCount.current}) took ${duration.toFixed(2)}ms (>1 frame at 60fps)`
      );
    } else if (process.env.NODE_ENV !== 'production') {
      console.debug(
        `[Perf Log] ${componentName} (render #${renderCount.current}): ${duration.toFixed(2)}ms`
      );
    }
  });
}
