import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { NavLink, useNavigate, useParams } from "react-router-dom"
import {fetchEvent} from '../../store/events.js'
import { fetchGroup } from "../../store/groups.js"
import './EventDetails.css'
import {formatTimestamp} from '../HelperFunctions/HelperFunctions.jsx'
import DeleteEventModal from "./DeleteEventModal/DeleteEventModal.jsx"
import OpenModalButton from "../OpenModalButton/OpenModalButton.jsx"




function EventDetails() {
    const navigate = useNavigate()
    const {eventId} = useParams()
    const dispatch = useDispatch()

    const event = useSelector(state => state.events)
    const sessionUser = useSelector((state) => state.session.user);

    const [group, setGroup] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            await dispatch(fetchEvent(eventId));
            let groupDetails = await dispatch(fetchGroup(event.groupId))
            setGroup(groupDetails)
            
        };

        fetchData();
    }, [dispatch, eventId, event.groupId]);

    const isOrganizer = sessionUser && group && sessionUser.id === group.organizerId;

    const handleDeleteEvnt = () => {
        navigate (`/groups/${group.id}`)
    }

    const handleUpdateEvent = () => {
        window.alert('Not Implemented')
    }

    return (
        <>
        {event &&
        <div id="event-container">
            <div id="event-header">
            <NavLink to='/events'><i className="fa-solid fa-angle-left"></i>Events</NavLink>
            <h1>{event.name}</h1>
            {<p>{`Hosted by ${group && group.Organizer.firstName} ${group && group.Organizer.lastName}`}</p>}
            {isOrganizer && <OpenModalButton buttonText="Delete Event" modalComponent={<DeleteEventModal event={event} handleDeleteEvnt={handleDeleteEvnt}/>}/>}
            {isOrganizer && <button id="event-update" onClick={handleUpdateEvent}>Edit Event</button>}
            </div>
            <div id="group-info">
                <p id="group-name">{ group && group.name}</p>
                <p id="group-private">{group && group.private == true ? 'Private' : "Public"}</p>
                <img id="group-image" src={group && `"https://media.istockphoto.com/id/1369814693/photo/los-angeles.jpg?s=2048x2048&w=is&k=20&c=6NP3lu8yXQoYTT4v8ot9pgl81pMNc2gZvYD4xD1Y5o8="`}></img>
            </div>
            <div id="event-details-imageDwn">
                <img id='event-image' src="https://media.istockphoto.com/id/1369814693/photo/los-angeles.jpg?s=2048x2048&w=is&k=20&c=6NP3lu8yXQoYTT4v8ot9pgl81pMNc2gZvYD4xD1Y5o8="></img>
                <h3>Details</h3>
                <p>{event.description}</p>
                <div id="time-price-type">
                    <div id="time">
                        <div id="clock-icon">
                            <i className="fa-regular fa-clock"></i>
                        </div>
                        <div id="event-start-end">
                            <p id="event-startTime"> START: {formatTimestamp(`${event.startDate}`)}</p>
                            <p id="event-endTime">END: {formatTimestamp(`${event.endDate}`)}</p>
                        </div>
                    </div>
                    <p id="event-detail-price"><i className="fa-solid fa-dollar-sign"></i>‎‎ {event.price}</p>
                    <p id="event-detail-location"><i className="fa-solid fa-location-dot"></i> ‎‎ {event.type}</p>
                </div>
            </div>
        </div>
        }
        </>
    )
}

export default EventDetails