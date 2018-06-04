import { Injectable } from '@angular/core';
import { VCALENDAR as VCALENDAR_INGESUP_B2 } from './../../../assets/json/ingesup-b2.json';
import { VCALENDAR as VCALENDAR_LIMART_B3 } from './../../../assets/json/limart-b3.json';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  constructor() { }


  private eventTToDateTransform = event => {
    event.startDate = moment(event.startDate);
    event.endDate = moment(event.endDate);
    return event;
  }

  private endDateIsBeforeFilter = (event, date) => {
    return !event.endDate.isSameOrBefore(date);
  }

  private eventStartDateIsBeforeFilter = (event, date) => {
    return !event.startDate.isSameOrBefore(date);
  }

  private sortByStartDate = (event1, event2) => {
    return event2.startDate.format('x') - event1.startDate.format('x');
  }

  private onlyNowEventsFilter = (event, date) => {
    return date.isBetween(event.startDate, event.endDate);
  }

  private onlyNextFilter = (event, date) => {
    return date.isBefore(event.startDate);
  }

  // console.log(getEventOfDate(JSON.parse(JSON.stringify(VCALENDAR_INGESUP_B2[0].VEVENT)), moment('20180116T131000Z')));

  public getCurrentEventOfFormation(formationId) {
    let events;
    switch (formationId) {
      case 'ingesup_b2':
        events = VCALENDAR_INGESUP_B2[0].VEVENT;
        break;
      case 'limart_b3':
        events = VCALENDAR_LIMART_B3[0].VEVENT;
        break;
      default:
        events = [];
    }
    const now = moment();
    return this.getEventOfDate(events, now);
  }

  private getEventOfDate(events, date) {

    const nowAndNextEvents = events
      .map(this.eventTToDateTransform)
      .filter(event => this.endDateIsBeforeFilter(event, date));


    // return {
    //   queryDate: date,
    //   now: nowAndNextEvents.filter(event => this.onlyNowEventsFilter(event, date)),
    //   next: this.onlyNextEventsFilterFn(nowAndNextEvents, date)
    // };

    return nowAndNextEvents.filter(event => this.onlyNowEventsFilter(event, date))
      .concat(this.onlyNextEventsFilterFn(nowAndNextEvents, date))
      .map(res => {
        res.courseName = res.summary.split('-')[0];
        return res;
      });
  }

  private onlyNextEventsFilterFn(events, date) {
    const eventsNextSorted = events.filter(event => this.onlyNextFilter(event, date)).sort(this.sortByStartDate);
    const firstNextEvent = eventsNextSorted.shift();
    const otherFirstNextEvent = eventsNextSorted.filter(event => this.eventStartDateIsBeforeFilter(event, firstNextEvent.startDate));
    return [firstNextEvent].concat(otherFirstNextEvent);
  }
}
