import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FaRegCalendarAlt } from "react-icons/fa";
import "./CalendarRangePicker.css";

const CalendarRangePicker = ({ startDate, endDate, setStartDate, setEndDate, onFilter }) => {
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const [startViewDate, setStartViewDate] = useState(startDate);
  const [endViewDate, setEndViewDate] = useState(endDate);

  const isRangeSelected = startDate && endDate;

  return (
    <div className="calendar-row">
      {/* Start Date Picker */}
      <div className="calendar-picker">
        <label className="calendar-label">Start Date</label>
        <div className="calendar-input-wrapper">
          <input
            type="text"
            className="date-display"
            value={startDate.toLocaleDateString()}
            readOnly
            onClick={() => setShowStart(!showStart)}
          />
          <FaRegCalendarAlt className="calendar-icon" onClick={() => setShowStart(!showStart)} />
        </div>
        {showStart && (
          <div className="calendar-popup">
            <Calendar
              onChange={(date) => {
                setStartDate(date);
                setShowStart(false);
              }}
              value={startDate}
              minDetail="decade"
              maxDetail="month"
              activeStartDate={startViewDate}
              onActiveStartDateChange={({ activeStartDate }) =>
                setStartViewDate(activeStartDate)
              }
              tileClassName={({ date }) =>
                endDate && date > startDate && date < endDate ? "range-tile" : ""
              }
              className="react-calendar-custom"
            />
          </div>
        )}
      </div>

      {/* End Date Picker */}
      <div className="calendar-picker">
        <label className="calendar-label">End Date</label>
        <div className="calendar-input-wrapper">
          <input
            type="text"
            className="date-display"
            value={endDate.toLocaleDateString()}
            readOnly
            onClick={() => setShowEnd(!showEnd)}
          />
          <FaRegCalendarAlt className="calendar-icon" onClick={() => setShowEnd(!showEnd)} />
        </div>
        {showEnd && (
          <div className="calendar-popup">
            <Calendar
              onChange={(date) => {
                setEndDate(date);
                setShowEnd(false);
              }}
              value={endDate}
              minDetail="decade"
              maxDetail="month"
              activeStartDate={endViewDate}
              onActiveStartDateChange={({ activeStartDate }) =>
                setEndViewDate(activeStartDate)
              }
              tileClassName={({ date }) =>
                startDate && date > startDate && date < endDate ? "range-tile" : ""
              }
              className="react-calendar-custom"
            />
          </div>
        )}
      </div>

      {/* Search Button */}
      {startDate && endDate && (
        <div className="calendar-search-button">
          <button onClick={() => onFilter(startDate, endDate)}>Search</button>

        </div>
      )}
    </div>
  );
};

export default CalendarRangePicker;
