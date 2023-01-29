import moment from "moment";
import React from "react";
import './CalendarGrid.scss';

export const CalendarGrid = ({ startDay, totalDays, events }) => {
  const day = startDay.clone().subtract(1, 'week');
  const daysArray = [...Array(totalDays)].map(() => day.add(1, 'day').clone());
  const isCurrentDay = (day) => moment().isSame(day, 'day');

  return (
    <div className="calendar__container">
      {
        daysArray.map((dayItem) => isCurrentDay(dayItem) ? (
          <div
            className="calendar__cell-light"
            key={dayItem.format('DDMMYYYY')}
          >
            <div className="calendar__cell-row">
              {dayItem.format('D')}
              <span>
                {dayItem.format('dddd').slice(0, 2)}
              </span>
            </div>

            <ul className="calendar__event">
              {
                events
                .filter(event => event.date >= dayItem.format('X') && event.date <= dayItem.clone().endOf('day').format('X'))
                .map(event => (
                  <li key={event.id}>
                    <button className="calendar__event-button">
                      {event.title}
                    </button>
                  </li>
                ))
              }
            </ul>
          </div>
        ) : (
          <div
          className="calendar__cell"
          key={dayItem.format('DDMMYYYY')}
        >
          <div className="calendar__cell-row">
            {dayItem.format('D')}
            <span>
              {dayItem.format('dddd').slice(0, 2)}
            </span>
          </div>

          <ul className="calendar__event">
              {
                events
                .filter(event => event.date >= dayItem.format('X') && event.date <= dayItem.clone().endOf('day').format('X'))
                .map(event => (
                  <li key={event.id}>
                    <button className="calendar__event-button">
                      {event.title}
                    </button>
                  </li>
                ))
              }
          </ul>
        </div>
        ))
      }
    </div>
  )
}
