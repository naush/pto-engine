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
}

export default RequestEvent;
