import { useState } from "react"
import GoogleCalendar from "./components/GoogleCalendar"

function App() {
  const [value, setValue] = useState<Date>(new Date())
  return (
    <>
      <GoogleCalendar value={value} onChange={setValue} />
    </>
  )
}

export default App
