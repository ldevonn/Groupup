import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { createEvent } from '../../store/events.js';
import {useNavigate, useParams} from 'react-router-dom'
import './CreateEvent.css'

function CreateEvent() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [errors, setErrors] = useState({})
    const { groupId } = useParams();
    const group = useSelector(state => state.groups.group)
    const sessionUser = useSelector((state) => state.session.user);

    useEffect(() => {
        if (!sessionUser || !group){
            navigate('/')
        }
        
    }, [sessionUser, group])
    



    async function handleSubmit(e) {
        e.preventDefault()
        setErrors({})

        function visibilityCheck() {
            if (e.target.elements.eventVisibility.value === 'Public'){
                return false
            } else {
                return true
            }
        }

        function typeCheck() {
            if (e.target.elements.eventType.value === 'InPerson'){
                return 'In person'
            } else {
                return "Online"
            }
        }

        const formData = {
            name: e.target.elements.name.value,
            type: typeCheck(),
            isPrivate: visibilityCheck(),
            price: parseInt(e.target.elements.price.value),
            startDate: e.target.elements.startDate.value,
            endDate: e.target.elements.endDate.value,
            imageUrl: e.target.elements.imageUrl.value,
            description: e.target.elements.description.value,
            capacity: parseInt(e.target.elements.capacity.value),

        };

        try {
            const createdEvent = await dispatch(createEvent(formData, groupId))
            const eventId = createdEvent.id;
            navigate(`/events/${eventId}`);
        } catch (res) {
            const data = await res.json();
            if (data?.errors) {
                setErrors({...data.errors})
                return errors
        }
    }
}

return (
    <>
    <form onSubmit={handleSubmit}>
            <h1>Create an event for {group && group.name}</h1>
        <label>
            <p>What is the name of your event?</p>
            <input 
                type="text"
                name="name"
                required
                placeholder="Event Name">
            </input>
            <div className="eventErrors">{errors && errors.name}</div>
        </label>
        <label>
            <p>Is this an in person or online group?</p>
            <select
            type="dropdown"
            name="eventType"
            required
            >
            <option value="InPerson">In Person</option>
            <option value="Online">Online</option>
            </select>
            <div className="eventErrors">{errors && errors.eventType}</div>
        </label>
        <label>
            <p>Is this event private or public?</p>
            <select
            type="dropdown"
            name='eventVisibility'
            required>
            <option value="Public">Public</option>
            <option value="Private">Private</option>
            </select>
            <div className="eventErrors">{errors && errors.eventVisibility}</div>
        </label>
        <label>
            <p>What is the price for your event?</p>
            <input
            type="text"
            name="price"
            required
            placeholder="0">
            </input>
            <div className="eventErrors">{errors && errors.price}</div>
        </label>
        <label>
            <p>When does your event start?</p>
            <input
            type="text"
            name="startDate"
            required
            placeholder="MM/DD/YYYY, HH:mm AM">
            </input>
            <div className="eventErrors">{errors && errors.startDate}</div>
        </label>
        <label>
            <p>When does your event end?</p>
            <input
            type="text"
            name="endDate"
            required
            placeholder="MM/DD/YYYY, HH:mm PM">
            </input>
            <div className="eventErrors">{errors && errors.endDate}</div>
        </label>
        <label>
            <p>What is the max capacity of the event?</p>
            <input
            type="text"
            name="capacity"
            required
            placeholder="Capacity">
            </input>
            <div className="eventErrors">{errors && errors.capacity}</div>
        </label>
        <label>
            <p>Please add an image url for your event below:</p>
            <input
            type="text"
            name="imageUrl"
            required
            placeholder="Image URL">
            </input>
            <div className="eventErrors">{errors && errors.imageUrl}</div>
        </label>
        <label>
            <p>Please describe your event:</p>
            <input
            type="text"
            name="description"
            required
            placeholder="Please include at least 30 characters">
            </input>
            <div className="eventErrors">{errors && errors.description}</div>
        </label>
        <button id="new-group-submit" type="submit">
            Create Event
        </button>
    </form>
    </>
    )
}

export default CreateEvent