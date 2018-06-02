"use strict";
exports.__esModule = true;
var ingesup_b2_json_1 = require("./ingesup-b2.json");
var moment = require("moment");
// console.log(VCALENDAR_INGESUP_B2[0].VEVENT);
var eventTToDateTransform = function (event) {
    console.log('in eventTToDateTransform');
    event.startDate = moment(event.startDate);
    event.endDate = moment(event.endDate);
    return event;
};
var endDateIsBeforeFilter = function (event, date) {
    return !event.endDate.isSameOrBefore(date);
};
var eventStartDateIsBeforeFilter = function (event, date) {
    return !event.startDate.isSameOrBefore(date);
};
var sortByStartDate = function (event1, event2) {
    return event2.startDate.format('x') - event1.startDate.format('x');
};
var onlyNowEventsFilter = function (event, date) {
    return date.isBetween(event.startDate, event.endDate);
};
var onlyNextFilter = function (event, date) {
    return date.isBefore(event.startDate);
};
console.log(getEventOfDate(JSON.parse(JSON.stringify(ingesup_b2_json_1.VCALENDAR[0].VEVENT)), moment('20180116T131000Z')));
function getEventOfDate(events, date) {
    console.log('in getEventOfDate', events[0]);
    console.log(typeof events);
    console.log(typeof events.map);
    var nowAndNextEvents1 = events.map(eventTToDateTransform);
    console.log('in getEventOfDate 2 ', nowAndNextEvents1[0]);
    var nowAndNextEvents = nowAndNextEvents1
        .filter(function (event) { return endDateIsBeforeFilter(event, date); });
    console.log('in getEventOfDate 3 ', nowAndNextEvents[0]);
    return {
        queryDate: date,
        now: nowAndNextEvents.filter(function (event) { return onlyNowEventsFilter(event, date); }),
        next: onlyNextEventsFilterFn(nowAndNextEvents, date)
    };
}
function onlyNextEventsFilterFn(events, date) {
    var eventsNextSorted = events.filter(function (event) { return onlyNextFilter(event, date); }).sort(sortByStartDate);
    var firstNextEvent = eventsNextSorted.shift();
    var otherFirstNextEvent = eventsNextSorted.filter(function (event) { return eventStartDateIsBeforeFilter(event, firstNextEvent.startDate); });
    return [firstNextEvent].concat(otherFirstNextEvent);
}
