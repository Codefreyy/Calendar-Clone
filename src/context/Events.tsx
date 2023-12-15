import { createContext, ReactNode, useState } from "react"
import { UnionOmit } from "../utils/type"
import { EVENTS_COLORS } from "./useEvents"

export type Event = {
  id: string
  date: Date
  name: string
  color: (typeof EVENTS_COLORS)[number]
} & (
  | { allDay: true; starTime?: never; endTime?: never }
  | { allDay: false; startTime: string; endTime: string }
)

type EventsContext = {
  events: Event[]
  addEvents: (event: UnionOmit<Event, "id">) => void
  deleteEvent: (id: string) => void
  updateEvent: (eventId: string, event: UnionOmit<Event, "id">) => void
}

export const Context = createContext<EventsContext | null>(null)

type EventsContextProps = {
  children: ReactNode
}

export function EventsProvider({ children }: EventsContextProps) {
  const [events, setEvents] = useState<Event[]>([])

  function addEvents(newEvent: UnionOmit<Event, "id">) {
    setEvents((e) => {
      return [
        ...e,
        {
          ...newEvent,
          id: crypto.randomUUID(),
        },
      ]
    })
  }

  function deleteEvent(id: string) {
    setEvents((events) => {
      return events.filter((eve) => eve.id !== id)
    })
  }

  function updateEvent(eventId: string, event: UnionOmit<Event, "id">) {
    console.log(event, "updated")
    setEvents((e) => {
      return e.map((eve) => {
        if (eve.id == eventId) {
          eve = {
            id: eventId,
            ...event,
          }
        }
        return eve
      })
    })
  }

  return (
    <Context.Provider value={{ events, addEvents, deleteEvent, updateEvent }}>
      {children}
    </Context.Provider>
  )
}
