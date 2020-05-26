import Events from './events';

describe(Events, () => {
  describe('.create', () => {
    let options;
    let expected;

    beforeEach(() => {
      options = {
        from: new Date(2019, 0, 1),
        to: new Date(2019, 1, 1),
        amount: 1,
        period: 'monthly',
        accrualDate: 31,
      };
    });

    afterEach(() => {
      expect(Events.create(options)).toEqual(expected);
    });

    it('lists accruals', () => {
      expected = [
        {
          type: 'start', date: new Date(2019, 0, 1), amount: 0, balance: 0,
        },
        {
          type: 'accrual', date: new Date(2019, 0, 31), amount: 1, balance: 1,
        },
      ];
    });

    it('shows accrual as zero after cap is hit', () => {
      options = {
        ...options,
        to: new Date(2019, 2, 1),
        cap: 1,
      };

      expected = [
        {
          type: 'start', date: new Date(2019, 0, 1), amount: 0, balance: 0,
        },
        {
          type: 'accrual', date: new Date(2019, 0, 31), amount: 1, balance: 1,
        },
        {
          type: 'accrual', date: new Date(2019, 1, 28), amount: 0, balance: 1,
        },
      ];
    });

    it('includes requests', () => {
      options = {
        ...options,
        start: 1,
        requests: [
          { from: new Date(2019, 0, 1), to: new Date(2019, 0, 15), used: 1 },
        ],
      };

      expected = [
        {
          type: 'start', date: new Date(2019, 0, 1), amount: 1, balance: 1,
        },
        {
          type: 'request', date: new Date(2019, 0, 15), amount: 1, balance: 0,
        },
        {
          type: 'accrual', date: new Date(2019, 0, 31), amount: 1, balance: 1,
        },
      ];
    });

    it('includes resets', () => {
      options = {
        ...options,
        start: 1,
        resetDate: 15,
        resetPeriod: 'annually',
      };

      expected = [
        {
          type: 'start', date: new Date(2019, 0, 1), amount: 1, balance: 1,
        },
        {
          type: 'reset', date: new Date(2019, 0, 15), amount: 0, balance: 0,
        },
        {
          type: 'accrual', date: new Date(2019, 0, 31), amount: 1, balance: 1,
        },
      ];
    });
  });
});
