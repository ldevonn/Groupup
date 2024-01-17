import { NavLink } from 'react-router-dom'
import './Events.css'
function Events() {
    return (
        <>
        <div className='groups-header'>
            <div className="event-group-nav">
                <NavLink to='/events' className='events-link active'>Events</NavLink>
                <NavLink to={'/groups'}className='groups-link inactive'>Groups</NavLink>
            </div>
            <p>Events in Groupup</p>
        </div>
        </>
    )
}

export default Events