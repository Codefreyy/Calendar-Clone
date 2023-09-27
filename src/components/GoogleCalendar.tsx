import { useState } from "react"
import {
  addMonths,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  format,
  isSameMonth,
  isToday,
} from "date-fns"
import EventList from "./EventList"
import AddEventModal from "./AddEventModal"

interface DateProps {
  value: Date
}

function GoogleCalendar({ value }: DateProps) {
  const [visibleMonth, setVisibleMonth] = useState(value || new Date())
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false)
  const [clickDate, setClickDate] = useState<Date>(new Date())

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
          {visibleDates.map((day) => (
            // old-month-day non-month-day
            <div
              key={JSON.stringify(day)}
              className={`day ${
                !isSameMonth(day, visibleMonth) && "non-month-day"
              }`}
            >
              <div className="day-header">
                <div className="week-name">{format(day, "E")}</div>
                <div className={`day-number ${isToday(day) && "today"}`}>
                  {format(day, "d")}
                </div>
                <button
                  className="add-event-btn"
                  onClick={() => {
                    setClickDate(day)
                    console.log(format(day, "MM/dd/yyyy"))
                    setIsAddEventModalOpen(!isAddEventModalOpen)
                  }}
                >
                  +
                </button>
              </div>
              {/* <EventList /> */}
            </div>
          ))}
        </div>

        {isAddEventModalOpen && (
          <AddEventModal
            onModalCancel={() => setIsAddEventModalOpen(false)}
            clickDate={clickDate}
          />
        )}
      </div>
    </>
  )
}

export default GoogleCalendar
