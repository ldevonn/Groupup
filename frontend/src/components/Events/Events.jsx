import { NavLink, useNavigate } from 'react-router-dom'
import './Events.css'
import { useDispatch, useSelector } from 'react-redux'
import {fetchEvents} from '../../store/events.js'
import { useEffect } from 'react'
import { formatTimestamp } from '../HelperFunctions/HelperFunctions.jsx'

function Events() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const events = useSelector((state) => state?.events.Events);

    useEffect(() => {
        dispatch(fetchEvents())
    }, [dispatch]);

    const currentDate = new Date()

    const sortedEvents = events ? [...events].sort((a, b) => {
        const dateA = new Date(a.startDate);
        const dateB = new Date(b.startDate);

        if (dateA > currentDate && dateB > currentDate) {
            return dateA - dateB;
        } else if (dateA <= currentDate && dateB <= currentDate) {
            return dateA - dateB;
        } else {
            return dateA > currentDate ? -1 : 1;
        }
    }) : [];

    const handleClick = (e, event) => {
        e.preventDefault()
        navigate(`/events/${event.id}`, {state: {event}})
    }
    return (
        <>
        <div className='groups-header'>
            <div className="event-group-nav">
                <NavLink to='/events' className='events-link active'>Events</NavLink>
                <NavLink to='/groups'className='groups-link inactive'>Groups</NavLink>
            </div>
            <p>Events in Groupup</p>
        </div>

        <div className="group-container">
            {events && sortedEvents.map((event) => (
                <div key={event.id} className='group' onClick={(e) => handleClick(e, event)}>
                    <img id='image' src="https://media.istockphoto.com/id/1369814693/photo/los-angeles.jpg?s=2048x2048&w=is&k=20&c=6NP3lu8yXQoYTT4v8ot9pgl81pMNc2gZvYD4xD1Y5o8=" alt="Group Image" />
                    <div className="group-details">
                        <h1 id="name">{event.name}</h1>
                        <p id='details'>{formatTimestamp(event.startDate)}</p>
                        <p>{event.Group.city}, {event.Group.state}</p>
                        <p id='details'>{event.description}</p>
                    </div>
                </div>
            ))}
        </div>
        </>
    )
}

export default Events