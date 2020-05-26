import Events from './events';

describe(Events, () => {
  describe('.create', () => {
    it('lists accruals', () => {
      const from = new Date(2019, 0, 1);
      const to = new Date(2019, 1, 1);
      const amount = 1;
      const period = 'monthly';
      const accrualDate = 31;

      expect(Events.create({
        from,
        to,
        amount,
        period,
        accrualDate,
      })).toEqual([
        {
          type: 'start', date: new Date(2019, 0, 1), amount: 0, balance: 0,
        },
        {
          type: 'accrual', date: new Date(2019, 0, 31), amount: 1, balance: 1,
        },
      ]);
    });

    it('shows accrual as zero after cap is hit', () => {
      const from = new Date(2019, 0, 1);
      const to = new Date(2019, 2, 1);
      const amount = 1;
      const period = 'monthly';
      const accrualDate = 31;
      const cap = 1;

      expect(Events.create({
        from,
        to,
        amount,
        period,
        accrualDate,
        cap,
      })).toEqual([
        {
          type: 'start', date: new Date(2019, 0, 1), amount: 0, balance: 0,
        },
        {
          type: 'accrual', date: new Date(2019, 0, 31), amount: 1, balance: 1,
        },
        {
          type: 'accrual', date: new Date(2019, 1, 28), amount: 0, balance: 1,
        },
      ]);
    });

    it('includes requests', () => {
      const from = new Date(2019, 0, 1);
      const to = new Date(2019, 1, 1);
      const amount = 1;
      const period = 'monthly';
      const accrualDate = 31;
      const start = 1;
      const requests = [
        { from: new Date(2019, 0, 1), to: new Date(2019, 0, 15), used: 1 },
      ];

      expect(Events.create({
        from,
        to,
        amount,
        period,
        accrualDate,
        requests,
        start,
      })).toEqual([
        {
          type: 'start', date: new Date(2019, 0, 1), amount: 1, balance: 1,
        },
        {
          type: 'request', date: new Date(2019, 0, 15), amount: 1, balance: 0,
        },
        {
          type: 'accrual', date: new Date(2019, 0, 31), amount: 1, balance: 1,
        },
      ]);
    });

    it('includes resets', () => {
      const from = new Date(2019, 0, 1);
      const to = new Date(2019, 1, 1);
      const amount = 1;
      const period = 'monthly';
      const accrualDate = 31;
      const start = 1;
      const resetDate = 15;
      const resetPeriod = 'annually';

      expect(Events.create({
        from,
        to,
        amount,
        period,
        accrualDate,
        start,
        resetDate,
        resetPeriod,
      })).toEqual([
        {
          type: 'start', date: new Date(2019, 0, 1), amount: 1, balance: 1,
        },
        {
          type: 'reset', date: new Date(2019, 0, 15), amount: 0, balance: 0,
        },
        {
          type: 'accrual', date: new Date(2019, 0, 31), amount: 1, balance: 1,
        },
      ]);
    });
  });
});
