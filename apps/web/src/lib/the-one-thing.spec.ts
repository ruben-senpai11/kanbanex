import {
  evaluateOneThingProject,
  ENTREPRENEURIAL_TEMPLATES,
} from './the-one-thing';

describe('The One Thing & Essentialism Engine', () => {
  describe('evaluateOneThingProject', () => {
    it('should classify high domino + absolute yes as The One Thing (Domino #1, URGENT)', () => {
      const result = evaluateOneThingProject({
        dominoEffect: 'HIGH',
        essentialAlignment: 'ABSOLUTE_YES',
        gtdActionable: true,
      });

      expect(result.isTheOneThing).toBe(true);
      expect(result.priority).toBe('URGENT');
      expect(result.category).toBe('THE_ONE_THING');
      expect(result.priorityLabel).toContain('The One Thing');
      expect(result.recommendation).toContain('levier stratégique #1');
    });

    it('should classify high domino with maybe alignment as HIGH priority in ACTIVE_BACKLOG', () => {
      const result = evaluateOneThingProject({
        dominoEffect: 'HIGH',
        essentialAlignment: 'MAYBE',
        gtdActionable: true,
      });

      expect(result.isTheOneThing).toBe(false);
      expect(result.priority).toBe('HIGH');
      expect(result.category).toBe('ACTIVE_BACKLOG');
      expect(result.priorityLabel).toContain('Priorité Élevée');
    });

    it('should classify medium domino + maybe + actionable as MEDIUM priority in ACTIVE_BACKLOG', () => {
      const result = evaluateOneThingProject({
        dominoEffect: 'MEDIUM',
        essentialAlignment: 'MAYBE',
        gtdActionable: true,
      });

      expect(result.isTheOneThing).toBe(false);
      expect(result.priority).toBe('MEDIUM');
      expect(result.category).toBe('ACTIVE_BACKLOG');
      expect(result.priorityLabel).toContain('Priorité Moyenne');
    });

    it('should route non-essential ideas to SOMEDAY_MAYBE incubator with LOW priority', () => {
      const result = evaluateOneThingProject({
        dominoEffect: 'LOW',
        essentialAlignment: 'NICE_TO_HAVE',
        gtdActionable: false,
      });

      expect(result.isTheOneThing).toBe(false);
      expect(result.priority).toBe('LOW');
      expect(result.category).toBe('SOMEDAY_MAYBE');
      expect(result.priorityLabel).toContain('Un jour / Peut-être');
      expect(result.recommendation).toContain('incubateur');
    });
  });

  describe('ENTREPRENEURIAL_TEMPLATES', () => {
    it('should define structured entrepreneurial templates', () => {
      expect(ENTREPRENEURIAL_TEMPLATES.length).toBeGreaterThanOrEqual(4);
      ENTREPRENEURIAL_TEMPLATES.forEach((tpl) => {
        expect(tpl.title).toBeTruthy();
        expect(tpl.desc).toBeTruthy();
      });
    });
  });
});
