import BaseEvent from './base-event';

class ResetEvent extends BaseEvent {
  constructor(options) {
    super(options);

    this.amount = 0;
    this.type = 'reset';
    this.date = new Date(options.date);
  }

  update(balance) {
    if (!this.options.carryover) {
      return 0;
    }
    this.balance = Math.min(balance, this.options.carryover);
    return this.balance;
  }
}

export default ResetEvent;
