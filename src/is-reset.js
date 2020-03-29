import isQualified from './is-qualified';

export default (options) => (date) => {
  const {
    resetDate,
    resetPeriod,
  } = options;

  return isQualified(Number(resetDate), resetPeriod)(date);
};
