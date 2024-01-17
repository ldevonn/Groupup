import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton/OpenModalButton'
import LoginFormModal from '../LoginFormModal/LoginFormModal';
import SignupFormModal from '../SignupFormModal/SignupFormModal'
import '../Navigation/Navigation.css'

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  const sessionLinks = sessionUser ? (
    <>
      <li>
        <ProfileButton user={sessionUser} />
      </li>
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
    <div>
      <NavLink to="/">Home</NavLink>
      {isLoaded && sessionLinks}
    </div>
  );
}

export default Navigation;