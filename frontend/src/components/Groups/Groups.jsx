import { NavLink } from 'react-router-dom'
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {fetchGroups} from '../../store/groups.js'
import './Groups.css'
import { useNavigate } from "react-router-dom";
import {fetchEvents} from '../../store/events.js'

function Groups() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const groups = useSelector((state) => state?.groups.Groups);
    const [events, setEvents] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            await dispatch(fetchGroups());
            let eventsList = await dispatch(fetchEvents())
            setEvents(eventsList.Events)
        }
        fetchData()
    }, [dispatch]);

    const handleClick = (e, group) => {
        e.preventDefault()
        navigate(`/groups/${group.id}`, {state: {group}})
    }

    function privateCheck(group) {
        if (group.private == true) {
            return 'Private'
        } else {
            return 'Public'
        }
    }
    return (
        <>
        <div>
            <div className='groups-header'>
                <div>
                    <NavLink to='/events' className='events-link inactive'>Events</NavLink>
                    <NavLink to='/groups' className='groups-link active'>Groups</NavLink>
                </div>
                <p>Groups in Groupup</p>
            </div>
            <div className="group-container">
                {groups && groups.map((group) => (
                    <div key={group.id} className="group" onClick={(e) => handleClick(e, group)}>
                        <img id='image' src="https://media.istockphoto.com/id/1369814693/photo/los-angeles.jpg?s=2048x2048&w=is&k=20&c=6NP3lu8yXQoYTT4v8ot9pgl81pMNc2gZvYD4xD1Y5o8=" alt="Group Image" />
                        <div className="group-details">
                            <h1 id="name">{group.name}</h1>
                            <p id='location'>{group.city}, {group.state}</p>
                            <p id='details'>{group.about}</p>
                            {events && <p id='events'>{events.filter((event) => event.groupId === group.id).length} Events · {privateCheck(group)}</p>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
        </>
    );
    }

export default Groups