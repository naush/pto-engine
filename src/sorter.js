import compareAsc from 'date-fns/compareAsc';

const order = ['request', 'reset', 'accrual'];

export default (a, b) => {
  const asc = compareAsc(a.date, b.date);

  if (asc === 0) {
    if (order.indexOf(a.type) < order.indexOf(b.type)) {
      return -1;
    }
    if (order.indexOf(a.type) > order.indexOf(b.type)) {
      return 1;
    }
    return 0;
  }

  return asc;
};
