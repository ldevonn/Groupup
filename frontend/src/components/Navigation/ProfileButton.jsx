import { useEffect, useState, useRef } from "react"
import { useDispatch } from "react-redux"
import * as sessionActions from '../../store/session'

function ProfileButton({user}) {
    const dispatch = useDispatch()
    const [showMenu, setShowMenu] = useState(false)
    const ulRef = useRef()

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
    }

    return (
        <>
        <button onClick={toggleMenu}>
            <i className="fa-solid fa-user"></i>
        </button>
        <ul className={ulClassName} ref={ulRef}>
            <li>{user.username}</li>
            <li>{user.firstName} {user.lastName}</li>
            <li>{user.email}</li>
            <li><button onClick={logout}>Log Out</button></li>
        </ul>
        </>
    )
}


export default ProfileButton