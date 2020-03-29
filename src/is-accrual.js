import isQualified from './is-qualified';

export default (options) => (date) => {
  const {
    accrualDate,
    period,
  } = options;

  return isQualified(Number(accrualDate), period)(date);
};
