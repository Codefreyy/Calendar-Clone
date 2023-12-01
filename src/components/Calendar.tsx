import { useMemo, useState } from "react"
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
  isBefore,
  endOfDay,
  subMonths,
} from "date-fns"
import AddEventModal from "./AddEventModal"
import { formatDate } from "../utils/formatDate"
import { cc } from "../utils/cc"

interface DateProps {
  value: Date
  onChange: (date: Date) => void
}

function Calendar({ value }: DateProps) {
  const [selectedMonth, setSelectedMonth] = useState(value || new Date())
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false)
  const [clickDate, setClickDate] = useState<Date>(new Date())

  // calendar's one-page view data
  const visibleDates = useMemo(() => {
    return eachDayOfInterval({
      start: startOfWeek(startOfMonth(selectedMonth)),
      end: endOfWeek(endOfMonth(selectedMonth)),
    })
  }, [selectedMonth])

  return (
    <>
      <div className="calendar">
        <div className="header">
          <button className="btn" onClick={() => setSelectedMonth(new Date())}>
            Today
          </button>
          <div>
            <button
              className="month-change-btn"
              onClick={() => {
                setSelectedMonth((m) => subMonths(m, 1))
              }}
            >
              &lt;
            </button>
            <button
              className="month-change-btn"
              onClick={() => setSelectedMonth((m) => addMonths(m, 1))}
            >
              &gt;
            </button>
          </div>
          <span className="month-title">
            {selectedMonth &&
              formatDate(selectedMonth, { month: "long", year: "numeric" })}
          </span>
        </div>
        <div className="days">
          {visibleDates.map((day, index) => (
            // old-month-day non-month-day
            <CalendarDay
              key={day.getTime()}
              day={day}
              showWeekName={index < 7}
              selectedMonth={selectedMonth}
              setClickDate={setClickDate}
              setIsAddEventModalOpen={setIsAddEventModalOpen}
              isAddEventModalOpen={isAddEventModalOpen}
            />
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

type calendarDayType = {
  day: Date
  showWeekName: boolean
  selectedMonth: Date
  setClickDate: (day: Date) => void
  setIsAddEventModalOpen: (isAddEventModalOpen: boolean) => void
  isAddEventModalOpen: boolean
}

function CalendarDay({
  day,
  showWeekName,
  selectedMonth,
  setClickDate,
  setIsAddEventModalOpen,
  isAddEventModalOpen,
}: calendarDayType) {
  return (
    <div
      key={day.getTime()}
      className={cc(
        "day",
        !isSameMonth(day, selectedMonth) && "non-month-day",
        isBefore(endOfDay(day), new Date()) && "old-month-day"
      )}
    >
      <div className="day-header">
        {showWeekName && (
          <div className="week-name">
            {formatDate(day, { weekday: "short" })}
          </div>
        )}
        <div className={cc("day-number", isToday(day) && "today")}>
          {formatDate(day, { day: "numeric" })}
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
  )
}

export default Calendar
