const ShowEventModal = () => {
  return (
    <div className="modal">
      <div className="overlay"></div>
      <div className="modal-body">
        <div className="modal-title">
          6/8/23
          <button className="close-btn">&times;</button>
        </div>
        <div className="events">
          <button className="all-day-event green event">
            <div className="event-name">Short</div>
          </button>
          <button className="event">
            <div className="color-dot blue"></div>
            <div className="event-time">7am</div>
            <div className="event-name">Event Name</div>
          </button>
          <button className="event">
            <div className="color-dot green"></div>
            <div className="event-time">8am</div>
            <div className="event-name">Event Name</div>
          </button>
          <button className="event">
            <div className="color-dot blue"></div>
            <div className="event-time">9am</div>
            <div className="event-name">Event Name</div>
          </button>
          <button className="event">
            <div className="color-dot blue"></div>
            <div className="event-time">10am</div>
            <div className="event-name">Event Name</div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ShowEventModal
