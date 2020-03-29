const isQualified = require('./is-qualified');

module.exports = (options) => (date) => {
  const {
    resetDate,
    period,
  } = options;

  return isQualified(Number(resetDate), period)(date);
};
