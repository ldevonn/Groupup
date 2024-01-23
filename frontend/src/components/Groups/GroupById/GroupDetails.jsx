import { useEffect } from "react"
import { NavLink, useLocation, useParams } from "react-router-dom"
import './GroupDetails.css'
import { useDispatch, useSelector } from "react-redux"
import { fetchGroup } from "../../../store/groups"

function GroupById() {
    const {groupId} = useParams()
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(fetchGroup(groupId))

    }, [dispatch, groupId])
    const group = useSelector(state => state.groups.group)
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
        </div>
        <div className="about">
            <h3>Organizer</h3>
            <p>Bob Bobby</p>
            
            <h3>What we're about</h3>
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