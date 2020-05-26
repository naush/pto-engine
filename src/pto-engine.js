import Events from './events';

class PTOEngine {
  constructor(options, events = Events) {
    this.options = options;
    this.events = events;
  }

  history() {
    return this.events.create(this.options);
  }

  balance() {
    const events = this.history();
    if (events.length > 0) {
      return events[events.length - 1].balance;
    }
    return 0;
  }
}

export default PTOEngine;
