import BaseEvent from './base-event';

class AccrualEvent extends BaseEvent {
  constructor(options) {
    super(options);

    this.type = 'accrual';
    this.date = new Date(options.date);
  }

  update(balance) {
    const cap = Number(this.options.cap) || Number.MAX_VALUE;
    const amount = Number(this.options.amount);
    if (balance + amount > cap) {
      this.amount = cap - balance;
    } else {
      this.amount = amount;
    }
    this.balance = balance + this.amount;
    return this.balance;
  }
}

export default AccrualEvent;
