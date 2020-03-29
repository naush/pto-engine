import getDate from 'date-fns/getDate';
import getDay from 'date-fns/getDay';
import getDayOfYear from 'date-fns/getDayOfYear';
import isLastDayOfMonth from 'date-fns/isLastDayOfMonth';
import lastDayOfYear from 'date-fns/lastDayOfYear';

const LAST_DAY_OF_MONTH = 31;
const LAST_DAY_OF_SEMIMONTH = 15;
const LAST_DAY_OF_YEAR = 365;

const isLastDayOfYear = (date) => lastDayOfYear(date) === date;
const onLastDayOfMonth = (date) => date === LAST_DAY_OF_MONTH;
const onLastDayOfSemiMonth = (date) => date === LAST_DAY_OF_SEMIMONTH;
const onLastDayOfYear = (date) => date === LAST_DAY_OF_YEAR;

export default (dayOfPeriod, period) => (date) => {
  if (period === 'monthly' && onLastDayOfMonth(dayOfPeriod)) {
    return isLastDayOfMonth(date);
  }

  if (period === 'monthly') {
    return getDate(date) === dayOfPeriod;
  }

  if (period === 'weekly') {
    return getDay(date) === dayOfPeriod;
  }

  if (period === 'semimonthly' && onLastDayOfSemiMonth(dayOfPeriod)) {
    return getDate(date) === dayOfPeriod
      || isLastDayOfMonth(date);
  }

  if (period === 'semimonthly') {
    return getDate(date) === dayOfPeriod
      || getDate(date) === dayOfPeriod + 14;
  }

  if (period === 'biweekly') {
    return getDayOfYear(date) % 14 === (dayOfPeriod === 14 ? 0 : dayOfPeriod);
  }

  if (period === 'annually' && onLastDayOfYear(dayOfPeriod)) {
    return isLastDayOfYear(date);
  }

  if (period === 'annually') {
    return getDayOfYear(date) === dayOfPeriod;
  }

  return false;
};
