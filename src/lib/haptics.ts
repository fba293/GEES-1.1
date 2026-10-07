/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Mobile Tactile Haptic Vibration Helper
 */

export const triggerHaptic = (pattern: number | number[] = 12) => {
  if (typeof window !== 'undefined' && 'navigator' in window && typeof navigator.vibrate === 'function') {
    try {
      navigator.vibrate(pattern);
    } catch {
      // Ignore policy constraints
    }
  }
};

export default triggerHaptic;
