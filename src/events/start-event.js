import BaseEvent from './base-event';

class StartEvent extends BaseEvent {
  constructor(options) {
    super(options);

    this.balance = 0;
    this.type = 'start';
    this.date = new Date(options.from);
    this.amount = Number(options.start) || 0;
  }

  update(balance) {
    this.balance = balance + this.amount;
    return this.balance;
  }
}

export default StartEvent;
