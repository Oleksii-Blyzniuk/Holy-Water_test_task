import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Header } from '../Header';
import { CalendarGrid } from '../CalendarGrid';
import "react-datepicker/dist/react-datepicker.css";

const url = 'http://localhost:5000';
const totalDays = 42;

function App() {
  // const today = moment();
  const [today, setToday] = useState(moment());
  const startDay = today.clone().startOf('month').startOf('week');

  const prevButton = () => {
    setToday(prev => prev.clone().subtract(1, 'month'));
  }
  
  // const noteButton = () => {
  //   //
  // }
  
  const nextButton = () => {
    setToday(prev => prev.clone().add(1, 'month'));
  }
  
  // const datapickButton = () => console.log('you clicked datapick button');

  const [events, setEvents] = useState([]);
  const startDateQuery = startDay.clone().format('X');
  const endDateQuery = startDay.clone().add(totalDays, 'days').format('X');

  useEffect(() => {
    fetch(`${url}/events?date_gte=${startDateQuery}&date_lte=${endDateQuery}`)
      .then(res => res.json())
      .then(res => {
        console.log('Response', res);
        setEvents(res);
      });
  }, [today])

  return (
    <div>
      <Header
        today={today}
        prevButton={prevButton}
        // noteButton={noteButton}
        nextButton={nextButton}
        // datapickButton={datapickButton}
      />
      <CalendarGrid startDay={startDay} totalDays={totalDays} events={events} />
    </div>
  );
}

export default App;
