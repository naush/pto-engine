import isQualified from './is-qualified';

describe(isQualified, () => {
  describe('annually', () => {
    it('handles non-leap year', () => {
      const date = new Date(2020, 11, 31);

      expect(isQualified(365, 'annually')(date)).toEqual(true);
    });

    it('handles leap year', () => {
      const date = new Date(2019, 11, 31);

      expect(isQualified(365, 'annually')(date)).toEqual(true);
    });
  });

  describe('biweekly', () => {
    it('qualifies the first monday', () => {
      const date = new Date(2020, 0, 6);

      expect(isQualified(1, 'biweekly')(date)).toEqual(true);
    });

    it('qualifies the second monday', () => {
      const firstMonday = new Date(2020, 0, 6);
      const secondMonday = new Date(2020, 0, 13);

      expect(isQualified(8, 'biweekly')(firstMonday)).toEqual(false);
      expect(isQualified(8, 'biweekly')(secondMonday)).toEqual(true);
    });

    it('qualifies the first tuesday', () => {
      const firstTuesday = new Date(2019, 0, 1);
      const secondTuesday = new Date(2019, 0, 8);

      expect(isQualified(2, 'biweekly')(firstTuesday)).toEqual(true);
      expect(isQualified(2, 'biweekly')(secondTuesday)).toEqual(false);
    });

    it('qualifies the first sunday', () => {
      const date = new Date(2020, 0, 5);

      expect(isQualified(0, 'biweekly')(date)).toEqual(true);
    });

    it('qualifies the second sunday', () => {
      const firstSunday = new Date(2020, 0, 5);
      const secondSunday = new Date(2020, 0, 12);

      expect(isQualified(7, 'biweekly')(firstSunday)).toEqual(false);
      expect(isQualified(7, 'biweekly')(secondSunday)).toEqual(true);
    });
  });
});
