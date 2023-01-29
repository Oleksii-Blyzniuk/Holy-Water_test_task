import React, { useState } from "react";
import "./Header.scss";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DatePicker from 'react-datepicker';

export const Header = ({
  today,
  prevButton,
  // noteButton,
  nextButton,
  // datapickButton
}) => {
  const [initialDate, setInitialDate] = useState(new Date());
  const [dataPicker, setDataPicker] = useState(false);
  console.log(!dataPicker)
  
  const handleChange = (date) => {
    setInitialDate(date);
  };

  const openDatePicker = () => {
    setDataPicker(!dataPicker)
  }
  
  return (
  <div className="header__container">
    <button
      className="header__button"
      // onClick={noteButton}
    >
        +
    </button>

    <div className="header__container-date">
      <button
        className="header__leftbtn"
        onClick={prevButton}
      >
        &lt;
      </button>
      <span className="header__date">{today.format('MMMM')} {today.format('YYYY')}</span>
      <button
        onClick={nextButton}
        className="header__rightbtn"
      >
        &gt;
      </button>
      <button className="header__calendar-button" onClick={openDatePicker}>
        <CalendarTodayIcon sx={{
          height:"15px",
          width:"15px",
          paddingTop:"3px"
        }} />
        <DatePicker
          className="header__datepicker"
          selected={initialDate}
          onChange={handleChange}
          onClickOutside={openDatePicker}
          open={dataPicker}
        />
      </button>
    </div>
  </div>
)}