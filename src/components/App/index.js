import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Header } from '../Header';
import { CalendarGrid } from '../CalendarGrid';
import "react-datepicker/dist/react-datepicker.css";
import './App.scss';

const url = 'http://localhost:5000';
const totalDays = 42;

function App() {
  // const today = moment();
  const [today, setToday] = useState(moment());
  const startDay = today.clone().startOf('month').startOf('week');

  const prevButton = () => {
    setToday(prev => prev.clone().subtract(1, 'month'));
  }
  
  const nextButton = () => {
    setToday(prev => prev.clone().add(1, 'month'));
  }
  
  const [isShowForm, setShowForm] = useState(false);
  const [method, setMethod] = useState(null)
  const [event, setEvent] = useState(null);


  const [events, setEvents] = useState([]);
  const [date, setDate] = useState(moment().format('X'));
  const startDateQuery = startDay.clone().format('X');
  const endDateQuery = startDay.clone().add(totalDays, 'days').format('X');

  const defaultEvent = {
    title: '',
    description: '',
    date: date
  }

  useEffect(() => {
    fetch(`${url}/events?date_gte=${startDateQuery}&date_lte=${endDateQuery}`)
      .then(res => res.json())
      .then(res => {
        // console.log('Response', res);
        setEvents(res);
      });
  }, [today]);

  const openFormHandler = (methodName, eventForUpdate) => {
    console.log('Click', methodName);
    setShowForm(!isShowForm);
    setEvent(eventForUpdate || defaultEvent);
    setMethod(methodName);
  }

  const cancelButtonHandler = () => {
    setShowForm(!isShowForm);
    setEvent(null);
  }

  const changeEventHandler = (text, field) => {
    setEvent(prevState => ({
      ...prevState,
      [field]: text
    }))
  }

  const changeDateHandler = (eventDate) => {
    // const dateTest = new Date(eventDate);
    
    setDate(moment(eventDate, 'YYYY.MM.DD').unix())
    // setDate(dateTest.getTime() / 1000);
    // console.log(date);
    // console.log(moment().format('X'))
  }

  const eventFetchHandler = () => {
    const fetchUrl = method === 'Update' ? `${url}/events/${event.id}` : `${url}/events`
    const httpMethod = method === 'Update' ? 'PATCH' : 'POST';

    fetch(fetchUrl, {
      method: httpMethod,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(event)
    })
      .then(res => res.json())
      .then(res => {
        // console.log(res);
        if (method === 'Update') {
          setEvents(prevState => prevState.map(eventEl => eventEl.id === res.id ? res : eventEl))
        } else {
          setEvents(prevState => [...prevState, res]);
        }
        cancelButtonHandler();
      })
  }

  const removeEventHandler = () => {
    const fetchUrl = `${url}/events/${event.id}`;
    const httpMethod = 'DELETE';

    fetch(fetchUrl, {
      method: httpMethod,
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(res => res.json())
      .then(res => {
        console.log(res);
        setEvents(prevState => prevState.filter(eventEl => eventEl.id !== event.id))
        cancelButtonHandler()
      })
  }

  return (
    <>
      {
        isShowForm ? (
          <div
            className='app__position'
            onClick={cancelButtonHandler}
          >
            <div
              className='app__form'
              onClick={(e) => e.stopPropagation()}
            >
              <input
                className='app__input'
                type='text'
                value={event.title}
                onChange={(e) => changeEventHandler(e.target.value, 'title')}
                required
              >
              </input>
              <input
                className='app__input'
                type='text'
                value={event.description}
                onChange={(e) => changeEventHandler(e.target.value, 'description')}
              >
              </input>
              <input
                className='app__input'
                type='date'
                // value={}
                onChange={(e) => changeDateHandler(e.target.value)}
              >
              </input>
              <div className='app__btncontainer'>
                <button onClick={cancelButtonHandler}>Cancel</button>
                <button onClick={eventFetchHandler}>{method}</button>
                {
                  method === 'Update' ? (
                    <button className='app__removebtn' onClick={removeEventHandler}>Remove</button>
                  ) : null
                }
              </div>
            </div>
          </div>
        ) : null
      }
      <div>
      <Header
        today={today}
        prevButton={prevButton}
        openFormHandler={openFormHandler}
        nextButton={nextButton}
      />
      <CalendarGrid
        startDay={startDay}
        totalDays={totalDays}
        events={events}
        openFormHandler={openFormHandler}
      />
    </div>
    </>
  );
}

export default App;
