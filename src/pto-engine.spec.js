import PTOEngine from './pto-engine';

describe('PTOEngine', () => {
  describe('calculate', () => {
    describe('cap', () => {
      it('does not accrue more than the specified cap amount', () => {
        const from = new Date(2019, 0, 1);
        const to = new Date(2020, 0, 1);
        const amount = 1;
        const period = 'monthly';
        const accrualDate = 31;
        const cap = 10;

        expect(PTOEngine.calculate({
          from,
          to,
          amount,
          cap,
          period,
          accrualDate,
        })).toEqual(10);
      });
    });

    describe('resets', () => {
      it('resets balance on the first day of the year', () => {
        const from = new Date(2019, 0, 1);
        const to = new Date(2020, 0, 1);
        const amount = 1;
        const period = 'monthly';
        const accrualDate = 2;
        const resetDate = 1;
        const resetPeriod = 'annually';

        expect(PTOEngine.calculate({
          from,
          to,
          amount,
          period,
          accrualDate,
          resetDate,
          resetPeriod,
        })).toEqual(0);
      });
    });

    describe('annually', () => {
      it('accrues on the first day of the year', () => {
        const from = new Date(2019, 0, 1);
        const to = new Date(2020, 0, 1);
        const amount = 1;
        const period = 'annually';
        const accrualDate = 1;

        expect(PTOEngine.calculate({
          from,
          to,
          amount,
          period,
          accrualDate,
        })).toEqual(2);
      });

      it('accrues on the last day of a leap year', () => {
        const from = new Date(2020, 0, 1);
        const to = new Date(2020, 11, 30);
        const amount = 1;
        const period = 'annually';
        const accrualDate = 365;

        expect(PTOEngine.calculate({
          from,
          to,
          amount,
          period,
          accrualDate,
        })).toEqual(0);
      });
    });

    describe('weekly', () => {
      it('accrues on the first day of the week', () => {
        const from = new Date(2019, 0, 1);
        const to = new Date(2019, 1, 1);
        const amount = 1;
        const period = 'weekly';
        const accrualDate = 1;

        expect(PTOEngine.calculate({
          from,
          to,
          amount,
          period,
          accrualDate,
        })).toEqual(4);
      });
    });

    describe('fortnightly', () => {
      it('accrues on the first day', () => {
        const from = new Date(2019, 0, 1);
        const to = new Date(2019, 0, 31);
        const amount = 1;
        const period = 'fortnightly';
        const accrualDate = 1;

        expect(PTOEngine.calculate({
          from,
          to,
          amount,
          period,
          accrualDate,
        })).toEqual(2);
      });
    });

    describe('monthly', () => {
      it('accrues on the first day of the month', () => {
        const from = new Date(2019, 0, 1);
        const to = new Date(2019, 1, 1);
        const amount = 1;
        const period = 'monthly';
        const accrualDate = 1;

        expect(PTOEngine.calculate({
          from,
          to,
          amount,
          period,
          accrualDate,
        })).toEqual(2);
      });

      it('accrues on the second day of the month', () => {
        const from = new Date(2019, 0, 1);
        const to = new Date(2019, 1, 1);
        const amount = 1;
        const period = 'monthly';
        const accrualDate = 2;

        expect(PTOEngine.calculate({
          from,
          to,
          amount,
          period,
          accrualDate,
        })).toEqual(1);
      });

      it('accrues on the last day of the month', () => {
        const from = new Date(2019, 0, 1);
        const to = new Date(2019, 1, 28);
        const amount = 1;
        const period = 'monthly';
        const accrualDate = 31;

        expect(PTOEngine.calculate({
          from,
          to,
          amount,
          period,
          accrualDate,
        })).toEqual(2);
      });

      it('ensures that to date is after from date', () => {
        const from = new Date(2019, 9, 2);
        const to = new Date(2019, 9, 1);
        const amount = 8;
        const period = 'monthly';
        const accrualDate = 1;

        expect(() => {
          PTOEngine.calculate({
            from,
            to,
            amount,
            period,
            accrualDate,
          });
        }).toThrow(/date/);
      });

      it('multiplies difference in months with given amount', () => {
        const from = new Date(2019, 0, 1);
        const to = new Date(2019, 10, 1);
        const amount = 8;
        const period = 'monthly';
        const accrualDate = 1;

        expect(PTOEngine.calculate({
          from,
          to,
          amount,
          period,
          accrualDate,
        })).toEqual(88);
      });

      it('includes starting balance', () => {
        const from = new Date(2019, 0, 1);
        const to = new Date(2019, 10, 1);
        const amount = 8;
        const period = 'monthly';
        const start = 12;
        const accrualDate = 1;

        expect(PTOEngine.calculate({
          from,
          to,
          amount,
          period,
          start,
          accrualDate,
        })).toEqual(100);
      });
    });
  });
});
