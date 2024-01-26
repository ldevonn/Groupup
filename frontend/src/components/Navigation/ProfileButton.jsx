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
        <ul className={ulClassName} ref={ulRef} >
            <li>Hello {user.firstName}!</li>
            <li>{user.email}</li>
            <li><button onClick={logout}>Log Out</button></li>
        </ul>
        </>
    )
}


export default ProfileButton