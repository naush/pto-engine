const getDate = require('date-fns/getDate');
const getDay = require('date-fns/getDay');
const getDayOfYear = require('date-fns/getDayOfYear');
const isLastDayOfMonth = require('date-fns/isLastDayOfMonth');
const lastDayOfYear = require('date-fns/lastDayOfYear');

const LAST_DAY_OF_MONTH = 31;
const LAST_DAY_OF_YEAR = 365;

const isLastDayOfYear = (date) => lastDayOfYear(date) === date;
const onLastDayOfMonth = (date) => date === LAST_DAY_OF_MONTH;
const onLastDayOfYear = (date) => date === LAST_DAY_OF_YEAR;

module.exports = (dayOfPeriod, period) => (date) => {
  if (period === 'monthly' && onLastDayOfMonth(dayOfPeriod)) {
    return isLastDayOfMonth(date);
  }

  if (period === 'monthly') {
    return getDate(date) === dayOfPeriod;
  }

  if (period === 'weekly') {
    return getDay(date) === dayOfPeriod;
  }

  if (period === 'yearly' && onLastDayOfYear(dayOfPeriod)) {
    return isLastDayOfYear(date);
  }

  if (period === 'yearly') {
    return getDayOfYear(date) === dayOfPeriod;
  }

  return false;
};
