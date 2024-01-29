import { useEffect, useState } from "react"
import { NavLink, useNavigate, useParams } from "react-router-dom"
import './GroupDetails.css'
import { useDispatch, useSelector } from "react-redux"
import { fetchGroup } from "../../../store/groups"
import { removeGroup } from "../../../store/groups"
import JoinGroupButton from "./JoinGroupButton/JoinGroupButton.jsx"
import { fetchEvents } from "../../../store/events.js"
import { formatTimestamp } from "../../HelperFunctions/HelperFunctions.jsx"

function GroupById() {
    const navigate = useNavigate()
    const {groupId} = useParams()
    const dispatch = useDispatch()
    const [events, setEvents] = useState(null)
    
    useEffect(() => {
        const fetchData = async () => {
            await dispatch(fetchGroup(groupId))
            let eventsList = await dispatch(fetchEvents())
            setEvents(eventsList.Events)
        }
        fetchData()
    }, [dispatch, groupId])

    const group = useSelector(state => state.groups.group)
    const sessionUser = useSelector((state) => state.session.user);
    const isOrganizer = sessionUser && group && (sessionUser.id === group.organizerId);

    const groupEvents = events ? events.filter((event) => event.groupId === group.id) : [];
    const currentDate = new Date();
    const futureEvents = groupEvents.filter((event) => new Date(event.startDate) > currentDate);
    const pastEvents = groupEvents.filter((event) => new Date(event.startDate) <= currentDate);

    const handleDeleteGroup = () => {
        dispatch(removeGroup(group))
        navigate ('/groups')
    }

    const handleUpdateGroup = () => {
        navigate(`/groups/${group.id}/edit`)
    }

    const handleNewEvent = () => {
        navigate(`/groups/${group.id}/events/new`)
    }
    
    function isPrivate() {
        if (group?.private){
            return 'Private'
        }  else {
            return 'Public'
        }
    }

    return (
        <>
        {group &&
        <div>
            <div className="group-title-card">
            <NavLink to='/groups'><i className="fa-solid fa-angle-left"></i> Groups</NavLink>
            <h1>{group.name}</h1>
            <img className="groupImage" src="https://media.istockphoto.com/id/1369814693/photo/los-angeles.jpg?s=2048x2048&w=is&k=20&c=6NP3lu8yXQoYTT4v8ot9pgl81pMNc2gZvYD4xD1Y5o8="></img>
            <p><i className="fa-solid fa-location-dot"></i> - {group.city}, {group.state}</p>
            <p>{groupEvents.length} events · {isPrivate()}</p>
            {isOrganizer && <button onClick={handleNewEvent}>Create Event</button>}
            {isOrganizer && <button onClick={handleDeleteGroup}>Delete Group</button>}
            {isOrganizer && <button onClick={handleUpdateGroup}>Edit Group</button>}
            {isOrganizer && <JoinGroupButton/>}
        </div>
        <div id="about-down">
            <div id="group-about">
                <h3>Organizer</h3>
                <p>{group.Organizer.firstName} {group.Organizer.lastName}</p>
                <h3 >What we&apos;re about</h3>
                <p>{group.about}</p>
            </div>
            <div className="events">
                {futureEvents.length ? 
                    <div>
                        <h3>Upcoming Events {`(${futureEvents.length})`}</h3>
                        {futureEvents.map((event) => (
                        <div key={event.id} onClick={() => navigate(`/events/${event.id}`)}>
                            <img id='image' src="https://media.istockphoto.com/id/1369814693/photo/los-angeles.jpg?s=2048x2048&w=is&k=20&c=6NP3lu8yXQoYTT4v8ot9pgl81pMNc2gZvYD4xD1Y5o8=" alt="Group Image" />
                            <p>{event.name}</p>
                            <p>{formatTimestamp(event.startDate)}</p>
                            <p>{event.Group.city}, {event.Group.state}</p>
                            <p>{event.description}</p>
                        </div>
                        ))}
                    </div> : 
                    <div>
                        <h3>Upcoming Events {`(${futureEvents.length})`}</h3>
                        <p>There aren&apos;t any upcoming events. Check back later!</p>
                    </div>
                }
            </div>

            <div className="events">
            {pastEvents.length ? 
                <div>
                    <h3>Past Events {`(${pastEvents.length})`}</h3>
                    {pastEvents.map((event) => (
                    <div key={event.id} onClick={() => navigate(`/events/${event.id}`)} className="event-card">
                        <div id="image-date-name-location">
                            <img id='group-events-image' src="https://media.istockphoto.com/id/1369814693/photo/los-angeles.jpg?s=2048x2048&w=is&k=20&c=6NP3lu8yXQoYTT4v8ot9pgl81pMNc2gZvYD4xD1Y5o8=" alt="Group Image" />
                            <div id="date-name-location">
                                <p id="group-event-time">{formatTimestamp(event.startDate)}</p>
                                <p id="group-event-name">{event.name}</p>
                                <p id="group-event-location">{event.Group.city}, {event.Group.state}</p>
                            </div>
                        </div>
                        <p id="group-event-about">{event.description}</p>
                    </div>
                    ))}
                </div> :
                    null
            }
            </div>

        </div>
        </div>
        }
        </>
    )
}

export default GroupById