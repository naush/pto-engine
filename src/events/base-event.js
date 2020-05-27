class BaseEvent {
  constructor(options) {
    this.options = options;
    this.balance = 0;
  }

  update(balance) { // eslint-disable-line no-unused-vars, class-methods-use-this
    return this.balance;
  }

  create() {
    return {
      type: this.type,
      date: this.date,
      amount: this.amount,
      balance: this.balance,
    };
  }
}

export default BaseEvent;
