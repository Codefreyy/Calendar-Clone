import { format } from "date-fns"
import { ChangeEvent, FormEvent, useState } from "react"

interface AddEventProps {
  onModalCancel: () => void
  clickDate: Date
}

type ColorType = "RED" | "BLUE" | "GREEN"

interface EventFormProps {
  name: string
  allDay: boolean
  startTime: Date
  endTime: Date
  color: ColorType
}

function AddEventModal({ onModalCancel, clickDate }: AddEventProps) {
  const [eventFormData, setEventFormData] = useState<EventFormProps>({
    name: "",
    allDay: false,
    startTime: new Date(),
    endTime: new Date(),
    color: "RED",
  })

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (eventFormData.startTime > eventFormData.endTime) {
      // todo: show alert/hint message
      return
    }
  }

  function handleTimeChange(e: ChangeEvent<HTMLInputElement>) {
    const [hours, minutes] = e.target.value.split(":")
    const newDate = new Date(clickDate)
    newDate.setHours(parseInt(hours, 10))
    newDate.setMinutes(parseInt(minutes, 10))
    console.log(e.target.id)
    if (e.target.id == "start-time") {
      setEventFormData((preState) => {
        return {
          ...preState,
          startTime: newDate,
        }
      })
    } else {
      setEventFormData((preState) => {
        return {
          ...preState,
          endTime: newDate,
        }
      })
    }
  }

  return (
    <div className="modal">
      <div className="overlay"></div>
      <div className="modal-body">
        <div className="modal-title">
          <div>Add Event</div>
          <small>{format(clickDate, "MM/dd/yyyy")}</small>
          <button className="close-btn" onClick={onModalCancel}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" name="name" id="name" required />
          </div>
          <div className="form-group checkbox">
            <input
              type="checkbox"
              name="all-day"
              id="all-day"
              checked={eventFormData?.allDay}
              onChange={(e) => {
                const isAllday = e.target.checked
                setEventFormData((preState) => {
                  return {
                    ...preState,
                    allDay: isAllday,
                  }
                })
              }}
            />
            <label htmlFor="all-day">All Day?</label>
          </div>
          <div className="row">
            <div className="form-group">
              <label htmlFor="start-time">Start Time</label>
              <input
                type="time"
                name="start-time"
                id="start-time"
                disabled={eventFormData.allDay}
                required={!eventFormData.allDay}
                onChange={handleTimeChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="end-time">End Time</label>
              <input
                type="time"
                name="end-time"
                id="end-time"
                disabled={eventFormData.allDay}
                required={!eventFormData.allDay}
                onChange={handleTimeChange}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Color</label>
            <div className="row left">
              <input
                type="radio"
                name="color"
                value="blue"
                id="blue"
                checked
                className="color-radio"
              />
              <label htmlFor="blue">
                <span className="sr-only">Blue</span>
              </label>
              <input
                type="radio"
                name="color"
                value="red"
                id="red"
                className="color-radio"
              />
              <label htmlFor="red">
                <span className="sr-only">Red</span>
              </label>
              <input
                type="radio"
                name="color"
                value="green"
                id="green"
                className="color-radio"
              />
              <label htmlFor="green">
                <span className="sr-only">Green</span>
              </label>
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
      </div>
    </div>
  )
}

export default AddEventModal
