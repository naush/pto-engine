import isBefore from 'date-fns/isBefore';
import eachDayOfInterval from 'date-fns/eachDayOfInterval';

import isAccrual from './is-accrual';
import isReset from './is-reset';
import sorter from './sorter';

class Events {
  static range(start, end, options, filterFunc, type) {
    return eachDayOfInterval({ start, end })
      .filter(filterFunc(options))
      .map((date) => ({ type, date }));
  }

  static create(options) {
    const fromDate = new Date(options.from);
    const toDate = new Date(options.to);

    if (isBefore(toDate, fromDate)) {
      throw new Error('To date must be after From date');
    }

    let balance = Number(options.start) || 0;
    const amount = Number(options.amount);
    const cap = Number(options.cap) || Number.MAX_VALUE;
    const requests = options.requests || [];
    const events = [
      {
        type: 'start', date: fromDate, amount: balance, balance,
      },
      ...this.range(fromDate, toDate, options, isReset, 'reset'),
      ...this.range(fromDate, toDate, options, isAccrual, 'accrual'),
      ...requests.map((request) => ({
        type: 'request', date: request.to, amount: request.used,
      })),
    ];

    let diff = 0;

    return events.sort(sorter).map((event) => {
      switch (event.type) {
        case 'start':
          return {
            ...event,
            balance,
          };
        case 'request':
          balance -= event.amount;
          return {
            ...event,
            balance,
          };
        case 'accrual':
          diff = balance + amount <= cap ? amount : 0;
          balance += diff;
          return {
            ...event,
            amount: diff,
            balance,
          };
        default: // reset
          balance = 0;
          return {
            ...event,
            amount: 0,
            balance,
          };
      }
    });
  }
}

export default Events;
