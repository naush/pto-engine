import BaseEvent from './base-event';

class ResetEvent extends BaseEvent {
  constructor(options) {
    super(options);

    this.balance = 0;
    this.amount = 0;
    this.type = 'reset';
    this.date = new Date(options.date);
  }
}

export default ResetEvent;
