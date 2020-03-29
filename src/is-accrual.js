const isQualified = require('./is-qualified');

module.exports = (options) => (date) => {
  const {
    accrualDate,
    period,
  } = options;

  return isQualified(Number(accrualDate), period)(date);
};
