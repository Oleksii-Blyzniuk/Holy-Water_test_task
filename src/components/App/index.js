import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Header } from '../Header';
import { CalendarGrid } from '../CalendarGrid';
import "react-datepicker/dist/react-datepicker.css";
import './App.scss';

const url = 'http://localhost:5000';
const totalDays = 42;
const defaultEvent = {
  title: '',
  description: '',
  date: moment().format('X') //тут потрыбно буде реалізувати дату. Щоб була взаємодія між датою яку вибрали і створення
}

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
  const startDateQuery = startDay.clone().format('X');
  const endDateQuery = startDay.clone().add(totalDays, 'days').format('X');

  useEffect(() => {
    fetch(`${url}/events?date_gte=${startDateQuery}&date_lte=${endDateQuery}`)
      .then(res => res.json())
      .then(res => {
        console.log('Response', res);
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
        console.log(res);
        if (method === 'Update') {
          setEvents(prevState => prevState.map(eventEl => eventEl.id === res.id ? res : eventEl))
        } else {
          setEvents(prevState => [...prevState, res]);
        }
        cancelButtonHandler();
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
              >
              </input>
              <input
                className='app__input'
                type='text'
                value={event.description}
                onChange={(e) => changeEventHandler(e.target.value, 'description')}
              >
              </input>
              <div className='app__btncontainer'>
                <button onClick={cancelButtonHandler}>Cancel</button>
                <button onClick={eventFetchHandler}>{method}</button>
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
        // datapickButton={datapickButton}
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
