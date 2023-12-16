import { FormEvent, Fragment, useId, useMemo, useRef, useState } from "react"
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
  isSameDay,
  parse,
} from "date-fns"
import { formatDate } from "../utils/formatDate"
import { cc } from "../utils/cc"
import { Modal } from "./Modal"
import { UnionOmit } from "../utils/type"
import { ModalProps } from "./Modal"
import { Event } from "../context/Events"
import { EVENTS_COLORS, useEvents } from "../context/useEvents"
import { OverflowContainer } from "./OverflowContainer"

function Calendar() {
  const [selectedMonth, setSelectedMonth] = useState(new Date())
  const { events } = useEvents()

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
              events={events.filter((event: Event) =>
                isSameDay(event.date, day)
              )}
              key={day.getTime()}
              day={day}
              showWeekName={index < 7}
              selectedMonth={selectedMonth}
            />
          ))}
        </div>
      </div>
    </>
  )
}

type calendarDayType = {
  day: Date
  showWeekName: boolean
  selectedMonth: Date
  events: Event[]
}

function CalendarDay({
  day,
  showWeekName,
  selectedMonth,
  events,
}: calendarDayType) {
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [isViewMoreEventsModalOpen, setIsViewMoreEventsModalOpen] =
    useState(false)
  const { addEvents } = useEvents()
  const sortedEvents = useMemo(() => {
    const timeToNumber = (time: string) => parseFloat(time.replace(":", "."))

    return [...events].sort((a, b) => {
      if (a.allDay && b.allDay) {
        return 0
      } else if (a.allDay) {
        return -1
      } else if (b.allDay) {
        return 1
      } else {
        return timeToNumber(a.startTime) - timeToNumber(b.startTime)
      }
    })
  }, [events])
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
      <div className="events">
        <OverflowContainer
          className="events"
          items={sortedEvents}
          getKey={(event) => event.id}
          renderItem={(event) => <CalenderEvent event={event} />}
          renderOverflow={(amount) => (
            <>
              <button
                onClick={() => setIsViewMoreEventsModalOpen(true)}
                className="events-view-more-btn"
              >
                +{amount} More
              </button>
              <ViewMoreEventsModal
                events={events}
                isOpen={isViewMoreEventsModalOpen}
                onClose={() => {
                  setIsViewMoreEventsModalOpen(false)
                }}
              />
            </>
          )}
        />
      </div>
      <EventFormModal
        date={day}
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        onSubmit={(e) => {
          addEvents(e)
        }}
      />
    </div>
  )
}

type ViewMoreEventsModalProps = {
  events: Event[]
} & Omit<ModalProps, "children">

function ViewMoreEventsModal({
  events,
  ...ModalProps
}: ViewMoreEventsModalProps) {
  if (events.length == 0) return null
  return (
    <Modal {...ModalProps}>
      <div className="modal-title">
        <small>{formatDate(events[0]?.date, { dateStyle: "short" })}</small>
        <button className="close-btn" onClick={ModalProps.onClose}>
          &times;
        </button>
      </div>
      <div className="events">
        {events.map((event) => (
          <CalenderEvent event={event} key={event.id} />
        ))}
      </div>
    </Modal>
  )
}

function CalenderEvent({ event }: { event: Event }) {
  const [isEditModalOpen, setEditModalOpen] = useState(false)
  const { deleteEvent, updateEvent } = useEvents()

  return (
    <>
      <button
        className={`event ${event.allDay ? "all-day-event" : ""} ${
          event.color
        }`}
        onClick={() => setEditModalOpen(true)}
      >
        {event.allDay ? (
          <div className="event-name">{event.name}</div>
        ) : (
          <>
            <div className={`color-dot ${event.color}`}></div>
            <div className="event-time">
              {formatDate(parse(event.startTime, "HH:mm", event.date), {
                timeStyle: "short",
              })}
            </div>
            <div className="event-name">{event.name}</div>
          </>
        )}
      </button>
      <EventFormModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSubmit={(e) => {
          updateEvent(event.id, e)
        }}
        onDelete={() => deleteEvent(event.id)}
        event={event}
      />
    </>
  )
}

// addEvent or deleteEvent has different props
type EventFormModalProps = {
  onSubmit: (event: UnionOmit<Event, "id">) => void
} & (
  | { onDelete: () => void; event: Event; date?: never }
  // either "onDelete and event " or "date"
  | {
      onDelete?: never
      event?: never
      date: Date
    }
) &
  Omit<ModalProps, "children"> // isOpen, onClose

function EventFormModal({
  onSubmit,
  onDelete,
  event,
  date,
  ...modalProps
}: EventFormModalProps) {
  const [startTime, setStartTime] = useState<string>(
    (event && !event.allDay && event.startTime) || ""
  )
  const [isAlldayChecked, setIsAlldayChecked] = useState(event?.allDay || false)
  const [selectedColor, setSelectedColor] = useState(
    event?.color || EVENTS_COLORS[0]
  )
  const nameRef = useRef<HTMLInputElement>(null)
  const endTimeRef = useRef<HTMLInputElement>(null)
  const formId = useId()

  // useEffect(() => {
  //   nameRef.current?.value = event.value
  // }, [])

  function handleFormSubmit(e: FormEvent) {
    e.preventDefault()
    const name = nameRef.current?.value || ""
    const endTime = endTimeRef.current?.value || ""

    if (name == null || name == "") return

    const commonProps = {
      name,
      date: date || event?.date,
      color: selectedColor,
    }

    let newEvent: UnionOmit<Event, "id">

    if (isAlldayChecked) {
      newEvent = {
        ...commonProps,
        allDay: true,
      }
    } else if (
      (startTime == null && startTime == "") ||
      endTime == null ||
      endTime == ""
    ) {
      return
    } else {
      newEvent = {
        ...commonProps,
        allDay: false,
        startTime: startTime,
        endTime: endTime,
      }
    }

    modalProps.onClose()
    onSubmit(newEvent)
  }

  return (
    <Modal {...modalProps}>
      <div className="modal-title">
        <div>{date ? "Add Event" : "Edit Event"}</div>
        <small>{formatDate(date || event.date, { dateStyle: "short" })}</small>
        <button className="close-btn" onClick={modalProps.onClose}>
          &times;
        </button>
      </div>
      <form onSubmit={handleFormSubmit}>
        <div className="form-group">
          <label htmlFor={`${formId}-name`}>Name</label>
          <input
            type="text"
            ref={nameRef}
            id={`${formId}-name`}
            defaultValue={event?.name}
            required
          />
        </div>
        <div className="form-group checkbox">
          <input
            type="checkbox"
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
              ref={endTimeRef}
              id={`${formId}-end-time`}
              disabled={isAlldayChecked}
              required={!isAlldayChecked}
              defaultValue={event?.endTime}
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
          <button className="btn btn-delete" type="button" onClick={onDelete}>
            Delete
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default Calendar
