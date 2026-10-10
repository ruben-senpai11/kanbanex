import {
  prefersReducedMotion,
  animatePanoramicEntrance,
  animateViewTransition,
  animateDrawerSlideIn,
  animateCheckmarkPop,
  animateDropTargetPulse,
  animateDropTargetReset,
} from './animations';

describe('Web Animations Helper', () => {
  it('prefersReducedMotion should return false in server / node environment', () => {
    expect(prefersReducedMotion()).toBe(false);
  });

  it('animation functions should gracefully handle null/empty elements without crashing', () => {
    expect(() => animatePanoramicEntrance(null)).not.toThrow();
    expect(() => animateViewTransition(null)).not.toThrow();
    expect(() => animateDrawerSlideIn(null)).not.toThrow();
    expect(() => animateCheckmarkPop(null)).not.toThrow();
    expect(() => animateDropTargetPulse(null)).not.toThrow();
    expect(() => animateDropTargetReset(null)).not.toThrow();
  });
});
