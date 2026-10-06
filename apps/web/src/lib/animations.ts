import gsap from 'gsap';

/**
 * Checks if the user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Panoramic horizontal entrance for Projects Overview cards
 */
export function animatePanoramicEntrance(container: HTMLElement | null) {
  if (!container || prefersReducedMotion()) return;

  const cards = container.querySelectorAll('.card-hover-effect');
  if (!cards || cards.length === 0) return;

  gsap.fromTo(
    cards,
    {
      opacity: 0,
      y: 40,
      scale: 0.95,
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.65,
      stagger: 0.08,
      ease: 'power3.out',
      clearProps: 'transform',
    }
  );
}

/**
 * Smooth transition between project views (Kanban, Gantt, Calendar)
 */
export function animateViewTransition(container: HTMLElement | null) {
  if (!container || prefersReducedMotion()) return;

  gsap.fromTo(
    container,
    {
      opacity: 0,
      y: 12,
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.35,
      ease: 'power2.out',
    }
  );
}

/**
 * Drawer slide-in animation
 */
export function animateDrawerSlideIn(drawerElement: HTMLElement | null) {
  if (!drawerElement || prefersReducedMotion()) return;

  gsap.fromTo(
    drawerElement,
    {
      x: '100%',
      opacity: 0.7,
    },
    {
      x: '0%',
      opacity: 1,
      duration: 0.4,
      ease: 'power3.out',
    }
  );
}

/**
 * Micro-bounce animation for checkbox/completed action
 */
export function animateCheckmarkPop(element: HTMLElement | null) {
  if (!element || prefersReducedMotion()) return;

  gsap.fromTo(
    element,
    {
      scale: 0.7,
    },
    {
      scale: 1.25,
      duration: 0.15,
      yoyo: true,
      repeat: 1,
      ease: 'back.out(2)',
    }
  );
}

/**
 * Micro pulse when item is dragged over a column
 */
export function animateDropTargetPulse(element: HTMLElement | null) {
  if (!element || prefersReducedMotion()) return;

  gsap.to(element, {
    scale: 1.015,
    duration: 0.15,
    ease: 'power1.out',
  });
}

export function animateDropTargetReset(element: HTMLElement | null) {
  if (!element || prefersReducedMotion()) return;

  gsap.to(element, {
    scale: 1,
    duration: 0.15,
    ease: 'power1.in',
  });
}
