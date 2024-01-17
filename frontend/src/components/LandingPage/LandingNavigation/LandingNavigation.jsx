import { NavLink } from "react-router-dom"
import './LandingNavigation.css'
import { useNavigate } from "react-router-dom"

function LandingNavigation() {
    const navigate = useNavigate()

    const handleClick = () => {
        const clicked = event.target
        if (clicked.className === 'see-all-groups active'){
            navigate('/groups')
        }
        if (clicked.className === 'find-event active'){
            navigate('/events')
        }
    }
    return (
        <>
        <div className="landing-nav-links">
            <NavLink className='see-all-groups' onClick={handleClick}>See all groups</NavLink>
            <NavLink className='find-event' onClick={handleClick}>Find an event</NavLink>
            <NavLink className='start-group' disabled>Start a new group</NavLink>
        </div>
        </>
    )
}

export default LandingNavigation