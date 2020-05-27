import BaseEvent from './base-event';

class RequestEvent extends BaseEvent {
  constructor(options) {
    super(options);

    this.amount = options.request.used;
    this.type = 'request';
    this.date = options.request.to;
  }

  update(balance) {
    this.balance = balance - this.amount;
    return this.balance;
  }

  create() {
    return {
      ...this.options.request,
      type: this.type,
      date: this.date,
      amount: this.amount,
      balance: this.balance,
    };
  }
}

export default RequestEvent;
