import { useEffect } from "react"
import { NavLink, useNavigate, useParams } from "react-router-dom"
import './GroupDetails.css'
import { useDispatch, useSelector } from "react-redux"
import { fetchGroup } from "../../../store/groups"
import { removeGroup } from "../../../store/groups"

function GroupById() {
    const navigate = useNavigate()
    const {groupId} = useParams()
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(fetchGroup(groupId))

    }, [dispatch, groupId])
    const group = useSelector(state => state.groups.group)
    const sessionUser = useSelector((state) => state.session.user);
    const isOrganizer = sessionUser && group && (sessionUser.id === group.organizerId);

    const handleDeleteGroup = () => {
        dispatch(removeGroup(group))
        navigate ('/groups')
    }

    const handleUpdateGroup = () => {
        navigate(`/groups/${group.id}/edit`)
    }
    
    let privacyImg
    
    function isPrivate() {
        if (group?.private){
            return 'private'
        }  else {
            return 'public'
        }
    }
    if (isPrivate() === 'private'){
        privacyImg = "fa-solid fa-lock"
    } else {
        privacyImg = "fa-solid fa-lock-open"
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
            <p><i className={privacyImg}></i> - {isPrivate()}</p>
            {isOrganizer && <button onClick={handleDeleteGroup}>Delete Group</button>}
            {isOrganizer && <button onClick={handleUpdateGroup}>Edit Group</button>}
        </div>
        <div className="about">
            <h3>Organizer</h3>
            <p>Bob Bobby</p>
            
            <h3 >What we&apos;re about</h3>
            <p>{group.about}</p>
        </div>
        <div className="events">
            <h3>Upcoming Events</h3>
        </div>
        </div>
        }
        </>
    )
}

export default GroupById