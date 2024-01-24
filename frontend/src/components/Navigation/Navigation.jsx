import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton/OpenModalButton'
import LoginFormModal from '../LoginFormModal/LoginFormModal';
import SignupFormModal from '../SignupFormModal/SignupFormModal'
import '../Navigation/Navigation.css'

function Navigation({ isLoaded }) {
  const navigate = useNavigate()
  const sessionUser = useSelector((state) => state.session.user);
  function handleClick() {
    navigate('/')
  }

  const sessionLinks = sessionUser ? (
    <>
      {/* <img src={'src/images/Groupup.png'} alt="Groupup Logo" className='logo' onClick={handleClick} /> */}
      <li>
        <ProfileButton user={sessionUser} />
      </li>
      <NavLink to='/groups/new'>Start a New Group</NavLink>
    </>
  ) : (
    <>
        <OpenModalButton
          buttonText="Log In"
          modalComponent={<LoginFormModal/>}/>
        <OpenModalButton
          buttonText="Sign Up"
          modalComponent={<SignupFormModal />}
          />

    </>
  );

  return (
    <div className='menuNavigation'>
      <img src={'src/images/Groupup.png'} alt="Groupup Logo" className='logo' onClick={handleClick} />
      <div id='modal-buttons'>
      {isLoaded && sessionLinks}
      </div>
    </div>
  );
}

export default Navigation;