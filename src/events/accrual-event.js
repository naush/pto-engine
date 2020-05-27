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
    this.amount = balance + amount <= cap ? amount : 0;
    this.balance = balance + this.amount;
    return this.balance;
  }
}

export default AccrualEvent;
