import { NavLink } from "react-router-dom"
import './LandingNavigation.css'
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import groupTransparent from '../../../images/groupNT.jpeg'
import upcomingEvents from '../../../images/upcomingEvents.png'

function LandingNavigation() {
    const navigate = useNavigate()
    const sessionUser = useSelector((state) => state.session.user);

    const handleClick = () => {
        const clicked = event.target
        if (clicked.id === 'view-groups-link'){
            navigate('/groups')
        }
        if (clicked.id === 'find-event-link'){
            navigate('/events')
        }
        if (clicked.id === 'start-group-link'){
            navigate('/groups/new')
        }
    }
    return (
        <>
        <div className="landing-nav-links">
            <div id="view-groups-div">
                <img id='view-groups-img' src={groupTransparent}></img>
                <NavLink id="view-groups-link" onClick={handleClick}>See all groups</NavLink>
            </div>
            <div id="find-event-div">
                <img id='find-event-img' src={upcomingEvents}></img>
                <NavLink id='find-event-link' onClick={handleClick}>Find an event</NavLink>
            </div>
            {sessionUser ? (
                <div id="start-group-div">
                    <img id='start-group-img' src={groupTransparent}></img>
                    <NavLink id='start-group-link' onClick={() => handleClick()}>Start a new group</NavLink>
                </div>
            ) : (
                <div id="start-group-disabled"> 
                    <img id='start-group-img' src={groupTransparent}></img>
                    <NavLink id='start-group-disabled' disabled>Start a new group</NavLink>
                </div>
            )}
        </div>
        </>
    )
}

export default LandingNavigation