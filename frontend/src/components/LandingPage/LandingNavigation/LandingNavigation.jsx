import { NavLink } from "react-router-dom"
import './LandingNavigation.css'
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
function LandingNavigation() {
    const navigate = useNavigate()
    const sessionUser = useSelector((state) => state.session.user);

    const handleClick = () => {
        const clicked = event.target
        if (clicked.id === 'see-all-groups'){
            navigate('/groups')
        }
        if (clicked.id === 'find-event'){
            navigate('/events')
        }
        if (clicked.id === 'start-group'){
            navigate('/groups/new')
        }
    }
    return (
        <>
        <div className="landing-nav-links">
            <NavLink id='see-all-groups' onClick={handleClick}>See all groups</NavLink>
            <NavLink id='find-event' onClick={handleClick}>Find an event</NavLink>
            {sessionUser ? (
                <NavLink id='start-group' onClick={() => handleClick()}>Start a new group</NavLink>
            ) : (
                <NavLink id='start-group-disabled' disabled>Start a new group</NavLink>
            )}
        </div>
        </>
    )
}

export default LandingNavigation