import PTOEngine from './pto-engine';

describe(PTOEngine, () => {
  describe('#history', () => {
    it('delegates to Events', () => {
      const options = {
        from: new Date(2019, 0, 1),
        to: new Date(2020, 0, 1),
        amount: 1,
        period: 'monthly',
        accrualDate: 31,
      };
      const FakeEvents = { create: jest.fn() };
      const engine = new PTOEngine(options, FakeEvents);

      engine.history();

      expect(FakeEvents.create).toHaveBeenCalledWith(options);
    });
  });

  describe('#balance with validations', () => {
    it('ensures that to date is after from date', () => {
      const options = {
        from: new Date(2019, 0, 2),
        to: new Date(2019, 0, 1),
        amount: 1,
        period: 'monthly',
        accrualDate: 31,
      };

      expect(() => {
        new PTOEngine(options).balance();
      }).toThrow(/date/);
    });
  });

  describe('#balance', () => {
    let options;
    let expected;

    beforeEach(() => {
      options = {
        from: new Date(2019, 0, 1),
        to: new Date(2020, 0, 1),
        amount: 1,
        period: 'monthly',
        accrualDate: 31,
      };
    });

    afterEach(() => {
      expect(new PTOEngine(options).balance()).toEqual(expected);
    });

    describe('requests', () => {
      it('subtracts used amount', () => {
        options = {
          ...options,
          requests: [
            { from: new Date(2019, 1, 1), to: new Date(2019, 1, 1), used: 1 },
          ],
        };

        expected = 11;
      });

      it('accrues again after taking time off', () => {
        options = {
          ...options,
          requests: [
            { from: new Date(2019, 10, 1), to: new Date(2019, 10, 1), used: 5 },
          ],
          cap: 5,
        };

        expected = 2;
      });

      it('accrues again only after the end of a time off request', () => {
        options = {
          ...options,
          requests: [
            { from: new Date(2019, 10, 1), to: new Date(2019, 11, 30), used: 5 },
          ],
          cap: 5,
        };

        expected = 1;
      });

      it('accrues again when time off ends on the same day as accrual day', () => {
        options = {
          ...options,
          requests: [
            { from: new Date(2019, 10, 1), to: new Date(2019, 11, 31), used: 5 },
          ],
          cap: 5,
        };

        expected = 1;
      });
    });

    describe('cap', () => {
      it('does not accrue more than the specified cap amount', () => {
        options = {
          ...options,
          cap: 10,
        };

        expected = 10;
      });
    });

    describe('resets', () => {
      it('resets balance on the first day of the year', () => {
        options = {
          ...options,
          resetDate: 1,
          resetPeriod: 'annually',
        };

        expected = 0;
      });
    });

    describe('annually', () => {
      it('accrues on the first day of the year', () => {
        options = {
          ...options,
          period: 'annually',
          accrualDate: 1,
        };

        expected = 2;
      });

      it('accrues on the last day of a leap year', () => {
        options = {
          ...options,
          from: new Date(2020, 0, 1),
          to: new Date(2020, 11, 30),
          amount: 1,
          period: 'annually',
          accrualDate: 365,
        };

        expected = 0;
      });
    });

    describe('weekly', () => {
      it('accrues on the first day of the week', () => {
        options = {
          ...options,
          from: new Date(2019, 0, 1),
          to: new Date(2019, 1, 1),
          amount: 1,
          period: 'weekly',
          accrualDate: 1,
        };

        expected = 4;
      });
    });

    describe('biweekly', () => {
      it('accrues 53 Tuesdays', () => {
        options = {
          ...options,
          from: new Date(2019, 0, 1),
          to: new Date(2019, 11, 31),
          period: 'biweekly',
          accrualDate: 2,
        };

        expected = 27;
      });

      it('accrues 52 sundays', () => {
        options = {
          ...options,
          from: new Date(2019, 0, 1),
          to: new Date(2019, 11, 31),
          period: 'biweekly',
          accrualDate: 13,
        };

        expected = 26;
      });
    });

    describe('semimonthly', () => {
      it('accrues on the first and 15th of each month for a year', () => {
        options = {
          ...options,
          to: new Date(2019, 11, 31),
          period: 'semimonthly',
          accrualDate: 1,
        };

        expected = 24;
      });

      it('accrues on the 15th and last day of each month for a year', () => {
        options = {
          ...options,
          to: new Date(2019, 11, 31),
          amount: 1,
          period: 'semimonthly',
          accrualDate: 15,
        };

        expected = 24;
      });
    });

    describe('monthly', () => {
      it('accrues on the first day of the month', () => {
        options = {
          ...options,
          to: new Date(2019, 1, 1),
          accrualDate: 1,
        };

        expected = 2;
      });

      it('accrues on the second day of the month', () => {
        options = {
          ...options,
          to: new Date(2019, 1, 1),
          accrualDate: 2,
        };

        expected = 1;
      });

      it('accrues on the last day of the month', () => {
        options = {
          ...options,
          to: new Date(2019, 1, 28),
        };

        expected = 2;
      });

      it('multiplies difference in months with given amount', () => {
        options = {
          ...options,
          to: new Date(2019, 10, 1),
          amount: 8,
          period: 'monthly',
          accrualDate: 1,
        };

        expected = 88;
      });

      it('includes starting balance', () => {
        options = {
          ...options,
          to: new Date(2019, 10, 1),
          amount: 8,
          accrualDate: 1,
          start: 12,
        };

        expected = 100;
      });
    });
  });
});
