import { createContext, ReactNode, useState } from "react"
import { UnionOmit } from "../utils/type"
import { EVENTS_COLORS } from "./useEvents"

export type Event = {
  id: string
  date: Date
  name: string
  color: (typeof EVENTS_COLORS)[number]
  startTime: ""
  endTime: ""
}

type EventsContext = {
  events: Event[]
  addEvents: (event: UnionOmit<Event, "id">) => void
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

  return (
    <Context.Provider value={{ events, addEvents }}>
      {children}
    </Context.Provider>
  )
}
