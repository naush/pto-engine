import compareAsc from 'date-fns/compareAsc';

const order = ['request', 'reset', 'accrual'];

export default (a, b) => {
  const asc = compareAsc(a.date, b.date);

  if (asc === 0) {
    return order.indexOf(a.type) - order.indexOf(b.type);
  }

  return asc;
};
