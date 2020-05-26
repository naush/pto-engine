import isBefore from 'date-fns/isBefore';
import isSameDay from 'date-fns/isSameDay';
import eachDayOfInterval from 'date-fns/eachDayOfInterval';
import compareAsc from 'date-fns/compareAsc';

import isAccrual from './is-accrual';
import isReset from './is-reset';

const DEFAULT_STARTING_BALANCE = 0;
const DEFAULT_CAP = Number.MAX_VALUE;

class Events {
  static create(options) {
    const fromDate = new Date(options.from);
    const toDate = new Date(options.to);
    const start = Number(options.start) || DEFAULT_STARTING_BALANCE;
    const amount = Number(options.amount);
    const cap = Number(options.cap) || DEFAULT_CAP;
    let requests = options.requests || [];

    if (isBefore(toDate, fromDate)) {
      throw new Error('To date must be after From date');
    }

    let balance = start;
    const events = [];
    events.push({
      type: 'start',
      date: fromDate,
      amount: start,
      balance: start,
    });

    const dates = [];

    eachDayOfInterval({
      start: fromDate,
      end: toDate,
    }).filter(isReset(options))
      .forEach((date) => (dates.push({ type: 'reset', date })));

    eachDayOfInterval({
      start: fromDate,
      end: toDate,
    }).filter(isAccrual(options))
      .forEach((date) => (dates.push({ type: 'accrual', date })));

    const compare = (a, b) => {
      const asc = compareAsc(a.date, b.date);
      if (asc === 0) {
        if (a.type === 'reset' && b.type === 'accrual') {
          return -1;
        }
        if (a.type === 'accrual' && b.type === 'reset') {
          return 1;
        }
        return 0;
      }
      return asc;
    };

    dates.sort(compare).forEach((date) => {
      if (date.type === 'accrual') {
        const accrual = date.date;
        const isBeforeAccrual = (_date) => isBefore(_date, accrual) || isSameDay(_date, accrual);
        const usedRequests = requests.filter((request) => isBeforeAccrual(request.to));

        usedRequests.forEach((request) => {
          balance -= request.used;
          events.push({
            type: 'request',
            date: request.to,
            amount: request.used,
            balance,
          });
        });

        requests = requests.filter((request) => !(isBeforeAccrual(request.to)));

        const diff = balance + amount <= cap ? amount : 0;
        balance += diff;

        events.push({
          type: 'accrual',
          amount: diff,
          date: accrual,
          balance,
        });
      } else if (date.type === 'reset') {
        events.push({
          type: 'reset',
          date: date.date,
          amount: 0,
          balance: 0,
        });

        balance = 0;
      }
    });

    return events;
  }
}

export default Events;
