import getDate from 'date-fns/getDate';
import getDay from 'date-fns/getDay';
import getDayOfYear from 'date-fns/getDayOfYear';
import startOfYear from 'date-fns/startOfYear';
import isLastDayOfMonth from 'date-fns/isLastDayOfMonth';
import isAfter from 'date-fns/isAfter';
import isSameDay from 'date-fns/isSameDay';
import lastDayOfYear from 'date-fns/lastDayOfYear';
import eachWeekOfInterval from 'date-fns/eachWeekOfInterval';

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
    const start = startOfYear(date);
    const dayOfWeek = getDay(date);
    const weeks = eachWeekOfInterval(
      { start, end: date },
      { weekStartsOn: dayOfPeriod % 7 },
    ).filter((day) => (isSameDay(day, start) || isAfter(day, start)));

    if (weeks.length > 0 && weeks.length % 2 === 0) {
      return dayOfWeek + 7 === dayOfPeriod;
    }
    return dayOfWeek === dayOfPeriod;
  }

  if (period === 'annually' && onLastDayOfYear(dayOfPeriod)) {
    return isLastDayOfYear(date);
  }

  if (period === 'annually') {
    return getDayOfYear(date) === dayOfPeriod;
  }

  return false;
};
