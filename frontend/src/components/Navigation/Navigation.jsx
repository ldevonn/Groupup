import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton/OpenModalButton'
import LoginFormModal from '../LoginFormModal/LoginFormModal';
import SignupFormModal from '../SignupFormModal/SignupFormModal'
import '../Navigation/Navigation.css'
import logoImage from '../../images/Groupup.png'

function Navigation({ isLoaded }) {
  const navigate = useNavigate()
  const sessionUser = useSelector((state) => state.session.user);

  function handleClick() {
    navigate('/')
  }

  const sessionLinks = sessionUser ? (
    <>
      <div>
        <NavLink id="start-new-group-link" to='/groups/new'>Start a New Group</NavLink>
        <ProfileButton id="profileButton" user={sessionUser} />
      </div>
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
      <img
        src={logoImage}
        alt="Groupup Logo"
        className='logo'
        onClick={handleClick}
      />
      <div id='modal-buttons'>
      {isLoaded && sessionLinks}
      </div>
    </div>
  );
}

export default Navigation;