import PTOEngine from './pto-engine';

describe('PTOEngine', () => {
  describe('.calculate', () => {
    describe('requests', () => {
      it('subtracts used amount', () => {
        const from = new Date(2019, 0, 1);
        const to = new Date(2020, 0, 1);
        const amount = 1;
        const period = 'monthly';
        const accrualDate = 31;
        const requests = [
          { from: new Date(2019, 1, 1), to: new Date(2019, 1, 1), used: 1 },
        ];

        expect(PTOEngine.calculate({
          from,
          to,
          amount,
          period,
          accrualDate,
          requests,
        })).toEqual(11);
      });

      it('accrues again after taking time off', () => {
        const from = new Date(2019, 0, 1);
        const to = new Date(2020, 0, 1);
        const amount = 1;
        const period = 'monthly';
        const accrualDate = 31;
        const requests = [
          { from: new Date(2019, 10, 1), to: new Date(2019, 10, 1), used: 5 },
        ];
        const cap = 5;

        expect(PTOEngine.calculate({
          from,
          to,
          amount,
          period,
          accrualDate,
          requests,
          cap,
        })).toEqual(2);
      });

      it('accrues again only after the end of a time off request', () => {
        const from = new Date(2019, 0, 1);
        const to = new Date(2020, 0, 1);
        const amount = 1;
        const period = 'monthly';
        const accrualDate = 31;
        const requests = [
          { from: new Date(2019, 10, 1), to: new Date(2019, 11, 30), used: 5 },
        ];
        const cap = 5;

        expect(PTOEngine.calculate({
          from,
          to,
          amount,
          period,
          accrualDate,
          requests,
          cap,
        })).toEqual(1);
      });

      it('accrues again when time off ends on the same day as accrual day', () => {
        const from = new Date(2019, 0, 1);
        const to = new Date(2020, 0, 1);
        const amount = 1;
        const period = 'monthly';
        const accrualDate = 31;
        const requests = [
          { from: new Date(2019, 10, 1), to: new Date(2019, 11, 31), used: 5 },
        ];
        const cap = 5;

        expect(PTOEngine.calculate({
          from,
          to,
          amount,
          period,
          accrualDate,
          requests,
          cap,
        })).toEqual(1);
      });
    });

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

    describe('biweekly', () => {
      it('accrues on the first day for a year', () => {
        const from = new Date(2019, 0, 1);
        const to = new Date(2019, 11, 31);
        const amount = 1;
        const period = 'biweekly';
        const accrualDate = 1;

        expect(PTOEngine.calculate({
          from,
          to,
          amount,
          period,
          accrualDate,
        })).toEqual(27);
      });

      it('accrues on the last day for a year', () => {
        const from = new Date(2019, 0, 1);
        const to = new Date(2019, 11, 31);
        const amount = 1;
        const period = 'biweekly';
        const accrualDate = 14;

        expect(PTOEngine.calculate({
          from,
          to,
          amount,
          period,
          accrualDate,
        })).toEqual(26);
      });
    });

    describe('semimonthly', () => {
      it('accrues on the first and 15th of each month for a year', () => {
        const from = new Date(2019, 0, 1);
        const to = new Date(2019, 11, 31);
        const amount = 1;
        const period = 'semimonthly';
        const accrualDate = 1;

        expect(PTOEngine.calculate({
          from,
          to,
          amount,
          period,
          accrualDate,
        })).toEqual(24);
      });

      it('accrues on the 15th and last day of each month for a year', () => {
        const from = new Date(2019, 0, 1);
        const to = new Date(2019, 11, 31);
        const amount = 1;
        const period = 'semimonthly';
        const accrualDate = 15;

        expect(PTOEngine.calculate({
          from,
          to,
          amount,
          period,
          accrualDate,
        })).toEqual(24);
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
