import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { NavLink, useNavigate, useParams } from "react-router-dom"
import {fetchEvent, removeEvent} from '../../store/events.js'
import { fetchGroup } from "../../store/groups.js"
import './EventDetails.css'
import {formatTimestamp} from '../HelperFunctions/HelperFunctions.jsx'




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

    const handleDeleteEvent = () => {
        dispatch(removeEvent(event))
        navigate (`/groups/${group.id}`)
    }

    const handleUpdateEvent = () => {
        window.alert('Not Implemented')
        // navigate(`/groups/${group.id}/edit`)
    }
    
    // let privacyImg
    
    // function isPrivate() {
    //     if (group?.private){
    //         return 'private'
    //     }  else {
    //         return 'public'
    //     }
    // }
    // if (isPrivate() === 'private'){
    //     privacyImg = "fa-solid fa-lock"
    // } else {
    //     privacyImg = "fa-solid fa-lock-open"
    // }

    return (
        <>
        {event &&
        <div id="event-container">
            <div id="event-header">
            <NavLink to='/events'><i className="fa-solid fa-angle-left"></i>Events</NavLink>
            <h1>{event.name}</h1>
            {isOrganizer && <p>{`Hosted by ${sessionUser.firstName} ${sessionUser.lastName}`}</p>}
            {/* <p><i className="fa-solid fa-location-dot"></i> - {group.city}, {group.state}</p> */}
            {/* <p><i className={privacyImg}></i> - {isPrivate()}</p> */}
            {isOrganizer && <button id="event-delete" onClick={handleDeleteEvent}>Delete Event</button>}
            {isOrganizer && <button id="event-update" onClick={handleUpdateEvent}>Edit Event</button>}
            </div>
            <div id="group-info">
                <p id="group-name">{ group && group.name}</p>
                <p id="group-private">{group && group.private == true ? 'Private' : "Public"}</p>
                <img id="group-image" src={group && `"https://media.istockphoto.com/id/1369814693/photo/los-angeles.jpg?s=2048x2048&w=is&k=20&c=6NP3lu8yXQoYTT4v8ot9pgl81pMNc2gZvYD4xD1Y5o8="`}></img>
            </div>
            <div>
                <img id='event-image' src="https://media.istockphoto.com/id/1369814693/photo/los-angeles.jpg?s=2048x2048&w=is&k=20&c=6NP3lu8yXQoYTT4v8ot9pgl81pMNc2gZvYD4xD1Y5o8="></img>
                <h3>Details</h3>
                <p>{event.description}</p>
                <p>{event.price}</p>
                <p>START: {formatTimestamp(`${event.startDate}`)}</p>
                <p>END: {formatTimestamp(`${event.endDate}`)}</p>
                <p>{event.type}</p>
            </div>
        </div>
        }
        </>
    )
}

export default EventDetails