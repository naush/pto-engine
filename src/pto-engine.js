const isBefore = require('date-fns/isBefore');
const eachDayOfInterval = require('date-fns/eachDayOfInterval');
const isAccrual = require('./is-accrual');
const isReset = require('./is-reset');

const DEFAULT_STARTING_BALANCE = 0;
const DEFAULT_CAP = Number.MAX_VALUE;

class PTOEngine {
  static calculate(options) {
    let fromDate = new Date(options.from);
    const toDate = new Date(options.to);
    const start = Number(options.start) || DEFAULT_STARTING_BALANCE;
    const amount = Number(options.amount);
    const cap = Number(options.cap) || DEFAULT_CAP;

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
    const total = start + accruals.length * amount;

    return Math.min(total, cap);
  }
}

module.exports = PTOEngine;
