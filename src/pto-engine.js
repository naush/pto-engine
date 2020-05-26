import isBefore from 'date-fns/isBefore';
import isSameDay from 'date-fns/isSameDay';
import eachDayOfInterval from 'date-fns/eachDayOfInterval';

import isAccrual from './is-accrual';
import isReset from './is-reset';

const DEFAULT_STARTING_BALANCE = 0;
const DEFAULT_CAP = Number.MAX_VALUE;

class PTOEngine {
  static calculate(options) {
    let fromDate = new Date(options.from);
    const toDate = new Date(options.to);
    const start = Number(options.start) || DEFAULT_STARTING_BALANCE;
    const amount = Number(options.amount);
    const cap = Number(options.cap) || DEFAULT_CAP;
    let requests = options.requests || [];

    if (isBefore(toDate, fromDate)) {
      throw new Error('To date must be after From date');
    }

    const resets = eachDayOfInterval({
      start: fromDate,
      end: toDate,
    }).filter(isReset(options));

    const lastResetDate = resets[resets.length - 1];
    if (lastResetDate && isBefore(fromDate, lastResetDate)) {
      fromDate = lastResetDate;
    }

    const accruals = eachDayOfInterval({
      start: fromDate,
      end: toDate,
    }).filter(isAccrual(options));

    let total = start;
    const transactions = [];
    transactions.push({ type: 'start', amount: start });

    accruals.forEach((accrual) => {
      const isBeforeAccrual = (date) => isBefore(date, accrual) || isSameDay(date, accrual);
      const usedRequests = requests.filter((request) => isBeforeAccrual(request.to));
      const used = usedRequests.reduce((_total, request) => _total + request.used, 0);

      if (used !== 0) {
        total -= used;
        transactions.push({ type: 'request', amount: -1 * used });
      }

      requests = requests.filter((request) => !(isBeforeAccrual(request.to)));

      if (total + amount <= cap) {
        total += amount;
        transactions.push({ type: 'accrual', amount });
      } else {
        transactions.push({ type: 'accrual', amount: 0 });
      }
    });

    return transactions.reduce((_total, transaction) => _total + transaction.amount, 0);
  }
}

export default PTOEngine;
