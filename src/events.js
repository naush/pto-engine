import isBefore from 'date-fns/isBefore';
import eachDayOfInterval from 'date-fns/eachDayOfInterval';

import isAccrual from './is-accrual';
import isReset from './is-reset';
import compareEvent from './compare-event';

import StartEvent from './events/start-event';
import RequestEvent from './events/request-event';
import ResetEvent from './events/reset-event';
import AccrualEvent from './events/accrual-event';

class Events {
  static range(start, end, options, filterFunc, EventClass) {
    return eachDayOfInterval({ start, end })
      .filter(filterFunc(options))
      .map((date) => new EventClass({ ...options, date }));
  }

  static create(options) {
    const fromDate = new Date(options.from);
    const toDate = new Date(options.to);

    if (isBefore(toDate, fromDate)) {
      throw new Error('To date must be after From date');
    }

    const requests = options.requests || [];
    const events = [
      new StartEvent(options),
      ...this.range(fromDate, toDate, options, isReset, ResetEvent),
      ...this.range(fromDate, toDate, options, isAccrual, AccrualEvent),
      ...requests.map((request) => new RequestEvent({ request })),
    ];

    let balance = 0;
    return events.sort(compareEvent).map((event) => {
      balance = event.update(balance);
      return event.create();
    });
  }
}

export default Events;
