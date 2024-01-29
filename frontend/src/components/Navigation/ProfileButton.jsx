import { useEffect, useState, useRef } from "react"
import { useDispatch } from "react-redux"
import * as sessionActions from '../../store/session'
import {useNavigate} from 'react-router-dom'

function ProfileButton({user}) {
    const dispatch = useDispatch()
    const [showMenu, setShowMenu] = useState(false)
    const ulRef = useRef()
    const navigate = useNavigate()

    const toggleMenu = (e) => {
        e.stopPropagation()
        setShowMenu(!showMenu)
    }
    
    useEffect(() => {
        if (!showMenu) return;
        
        const closeMenu = (e) => {
            if (ulRef.current && !ulRef.current.contains(e.target)){
                setShowMenu(false)
            }
        };
        
        document.addEventListener('click', closeMenu);
        
        return () => document.removeEventListener('click', closeMenu);
    }, [showMenu]);

    const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");
    
    
    
    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout())
        .then(navigate('/'))
    }

    return (
        <>
        <button onClick={toggleMenu}>
            <i className="fa-solid fa-user"></i>
        </button>
        <div className={ulClassName} ref={ulRef}>
            <div>Hello {user.firstName}!</div>
            <div>{user.email}</div>
            <div><button onClick={() => navigate('/events')}>View Events</button></div>
            <div><button onClick={() => navigate('/groups')}>View Groups</button></div>
            <div><button onClick={logout}>Log Out</button></div>
        </div>
        </>
    )
}


export default ProfileButton