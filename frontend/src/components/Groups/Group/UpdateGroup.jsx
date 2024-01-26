import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {useNavigate} from 'react-router-dom'
import { updateGroup } from "../../../store/groups";

function UpdateGroup() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [errors, setErrors] = useState({})
    const group = useSelector(state => state.groups.group);
    const sessionUser = useSelector((state) => state.session.user);
    
    useEffect(() => {
        if (!sessionUser || group && sessionUser.id !== group.organizerId){
            navigate('/groups')
        }
    }, [group, navigate, sessionUser])
    

    async function handleSubmit(e) {
        e.preventDefault()
        setErrors({})

        function visibilityCheck() {
            if (e.target.elements.groupVisibility.value === 'Public'){
                return false
            } else {
                return true
            }
        }

        function typeCheck() {
            if (e.target.elements.groupType.value === 'InPerson'){
                return 'In person'
            } else {
                return "Online"
            }
        }

        const formData = {
            id: group.id,
            city: e.target.elements.city.value,
            state: e.target.elements.state.value,
            name: e.target.elements.groupName.value,
            about: e.target.elements.groupDescription.value,
            type: typeCheck(),
            isPrivate: visibilityCheck(),
        };

        try {
            const updatedGroup = await dispatch(updateGroup(formData))
            const groupId = updatedGroup.id;
            navigate(`/groups/${groupId}`);
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
            <h1>Update Your Group&apos;s Information</h1>
            <h1>We&apos;ll walk you through a few steps to update your group&apos;s information</h1>
        <label>
            <h1>First, set your group&apos;s location.</h1>
            <p>Meetup groups meet locally, in person and online. We&apos;ll connect you with people in your area, and more can join you online.</p>
            <input 
                type="text"
                name="city"
                required
                placeholder="city">
            </input>
            <div>{errors && errors.city}</div>
            <input 
                type="text"
                name="state"
                required
                placeholder="state">
            </input>
            <div>{errors && errors.state}</div>
        </label>
        <label>
            <h1>What will your group&apos;s name be?</h1>
            <p>Choose a name that will give people a clear idea of what the group is about. Feel free to get creative! You can edit this later if you change your mind.</p>
            <input
            type="text"
            name="groupName"
            required
            placeholder="What is your group name?">
            </input>
            <div>{errors && errors.groupName}</div>
        </label>
        <label>
            <h1>Now describe what your group will be about</h1>
            <p>People will see this when we promote your group, but you&apos;ll be able to add to it later, too.
                1, What&apos;s the purpose of the group? 2. Who should join?
                3. What will you do at your events?</p>
            <input
            type="text"
            name="groupDescription"
            required
            placeholder="Please write at least 30 characters">
            </input>
            <div>{errors && errors.about}</div>
        </label>
        <label>
            <h1>Final Steps...</h1>
            <p>Is this an in person or online group?</p>
            <select
            type="dropdown"
            name="groupType"
            required
            >
            <option value="InPerson">In Person</option>
            <option value="Online">Online</option>
            </select>
            <div>{errors && errors.groupType}</div>
            <p>Is this an in person or online group?</p>
            <select
            type="dropdown"
            name='groupVisibility'
            required>
            <option value="Public">Public</option>
            <option value="Private">Private</option>
            </select>
            <div>{errors && errors.groupVisibility}</div>
        </label>
        <button id="new-group-submit" type="submit">
            Create group
        </button>
    </form>
    </>
  )
}

export default UpdateGroup