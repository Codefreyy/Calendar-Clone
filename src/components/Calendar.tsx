import { Fragment, useId, useMemo, useState } from "react"
import {
  addMonths,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isSameMonth,
  isToday,
  isBefore,
  endOfDay,
  subMonths,
} from "date-fns"
import { formatDate } from "../utils/formatDate"
import { cc } from "../utils/cc"
import { Modal } from "./Modal"
import { UnionOmit } from "../utils/type"
import { ModalProps } from "./Modal"
import { Event } from "../context/Events"
import { EVENTS_COLORS } from "../context/useEvents"

function Calendar() {
  const [selectedMonth, setSelectedMonth] = useState(new Date())

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
            />
          ))}
        </div>

        {/* <EventFormModal/> */}
      </div>
    </>
  )
}

type calendarDayType = {
  day: Date
  showWeekName: boolean
  selectedMonth: Date
}

function CalendarDay({ day, showWeekName, selectedMonth }: calendarDayType) {
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
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
            setIsEventModalOpen(true)
          }}
        >
          +
        </button>
      </div>
      <EventFormModal
        date={day}
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        onSubmit={() => null}
      />
    </div>
  )
}

// addEvent or deleteEvent has different props
type EventFormModalProps = {
  onSubmit: (event: UnionOmit<Event, "id">) => void
} & (
  | { onDelete: () => void; event: Event; date?: never }
  | {
      onDelete?: never
      event?: never
      date: Date
    }
) &
  Omit<ModalProps, "children">

function EventFormModal({
  onSubmit,
  onDelete,
  event,
  date,
  ...modalProps
}: EventFormModalProps) {
  const [isNew, setIsNew] = useState(true)
  const [isAlldayChecked, setIsAlldayChecked] = useState(false)
  const [selectedColor, setSelectedColor] = useState(
    event?.color || EVENTS_COLORS[0]
  )
  const [startTime, setStartTime] = useState(event?.startTime || "")
  const formId = useId()

  return (
    <Modal {...modalProps}>
      <div className="modal-title">
        <div>{isNew ? "Add Event" : "Edit Event"}</div>
        <small>{formatDate(date || event.date, { dateStyle: "short" })}</small>
        <button className="close-btn" onClick={modalProps.onClose}>
          &times;
        </button>
      </div>
      <form>
        <div className="form-group">
          <label htmlFor={`${formId}-name`}>Name</label>
          <input type="text" name="name" id={`${formId}-name`} required />
        </div>
        <div className="form-group checkbox">
          <input
            type="checkbox"
            name="all-day"
            id="all-day"
            checked={isAlldayChecked}
            onChange={(e) => setIsAlldayChecked(e.target.checked)}
          />
          <label htmlFor={`${formId}-all-day`}>All Day?</label>
        </div>
        <div className="row">
          <div className="form-group">
            <label htmlFor={`${formId}-start-time`}>Start Time</label>
            <input
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              type="time"
              name="start-time"
              id={`${formId}-start-time`}
              disabled={isAlldayChecked}
              required={!isAlldayChecked}
            />
          </div>
          <div className="form-group">
            <label htmlFor={`${formId}-end-time`}>End Time</label>
            <input
              min={startTime}
              type="time"
              name="end-time"
              id={`${formId}-end-time`}
              disabled={isAlldayChecked}
              required={!isAlldayChecked}
            />
          </div>
        </div>
        <div className="form-group">
          <label>Color</label>
          <div className="row left">
            {EVENTS_COLORS.map((color) => (
              <Fragment key={color}>
                <input
                  type="radio"
                  name="color"
                  value={color}
                  id={`${formId}-${color}`}
                  checked={selectedColor === color}
                  onChange={() => setSelectedColor(color)}
                  className="color-radio"
                />
                <label htmlFor={`${formId}-${color}`}>
                  <span className="sr-only">{color}</span>
                </label>
              </Fragment>
            ))}
          </div>
        </div>
        <div className="row">
          <button className="btn btn-success" type="submit">
            Add
          </button>
          <button className="btn btn-delete" type="button">
            Delete
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default Calendar
