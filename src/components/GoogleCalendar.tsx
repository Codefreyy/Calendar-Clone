import { useState } from "react"
import {
  addMonths,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  format,
} from "date-fns"

interface DateProps {
  value: Date
}

function GoogleCalendar({ value }: DateProps) {
  const [visibleMonth, setVisibleMonth] = useState(value || new Date())

  const visibleDates = eachDayOfInterval({
    start: startOfWeek(startOfMonth(visibleMonth)),
    end: endOfWeek(endOfMonth(visibleMonth)),
  })

  function showPrevMonth() {
    setVisibleMonth((currentMonth: Date) => {
      return addMonths(currentMonth, -1)
    })
  }

  function showNextMonth() {
    setVisibleMonth((currentMonth: Date) => {
      return addMonths(currentMonth, 1)
    })
  }

  function jumpToCurrentMonth() {
    setVisibleMonth(value)
  }

  return (
    <>
      <div className="calendar">
        <div className="header">
          <button className="btn" onClick={jumpToCurrentMonth}>
            Today
          </button>
          <div>
            <button className="month-change-btn" onClick={showPrevMonth}>
              &lt;
            </button>
            <button className="month-change-btn" onClick={showNextMonth}>
              &gt;
            </button>
          </div>
          <span className="month-title">
            {visibleMonth && format(visibleMonth, "MMM yyyy")}
          </span>
        </div>
        <div className="days">
          <div className="day non-month-day old-month-day">
            <div className="day-header">
              <div className="week-name">Sun</div>
              <div className="day-number">28</div>
              <button className="add-event-btn">+</button>
            </div>
            <div className="events">
              <button className="all-day-event blue event">
                <div className="event-name">Short</div>
              </button>
              <button className="all-day-event green event">
                <div className="event-name">
                  Long Event Name That Just Keeps Going
                </div>
              </button>
              <button className="event">
                <div className="color-dot blue"></div>
                <div className="event-time">7am</div>
                <div className="event-name">Event Name</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default GoogleCalendar
