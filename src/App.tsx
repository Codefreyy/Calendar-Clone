import { useState } from "react"
import Calendar from "./components/Calendar"

function App() {
  const [value, setValue] = useState<Date>(new Date())
  return (
    <>
      <Calendar value={value} onChange={setValue} />
    </>
  )
}

export default App
