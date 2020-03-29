import isQualified from './is-qualified';

export default (options) => (date) => {
  const {
    resetDate,
    period,
  } = options;

  return isQualified(Number(resetDate), period)(date);
};
