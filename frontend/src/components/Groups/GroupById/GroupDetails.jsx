import { NavLink, useLocation } from "react-router-dom"
import './GroupDetails.css'

function GroupById() {
    const location = useLocation()
    const group = location.state.group
    let privacyImg
    
    function isPrivate() {
        if (group.private){
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
            
            <h3 >What we&apos;re about</h3>
            <p>{group.about}</p>
        </div>
        <div className="events">
            <h3>Upcoming Events</h3>
        </div>
        </>
    )
}

export default GroupById