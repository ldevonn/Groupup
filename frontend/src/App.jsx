import { useEffect, useState } from 'react';
import {useDispatch } from 'react-redux';
import {createBrowserRouter, RouterProvider, Outlet} from 'react-router-dom'
import LoginFormPage from './components/LoginFormPage/LoginFormPage';
import SignupFormPage from './components/SignupFormPage/SignupFormPage.jsx';
import Navigation from './components/Navigation/Navigation.jsx';
import { restoreUser } from './store/session.js';

function Layout() {
  const dispatch = useDispatch()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    dispatch(restoreUser()).then(() => {
      setIsLoaded(true)
    })
  }, [dispatch])
  return (
    <>
    <Navigation isLoaded={isLoaded}/>
    {isLoaded && <Outlet />}
    </>
  )
}


function App() {
  const router = createBrowserRouter([
    {
      element: <Layout/>,
      children: [
        {
          path: '/',
          element: <h1>Welcome!</h1>
        },
        {
          path: '/login',
          element: <LoginFormPage/>
        },
        {
          path: '/signup',
          element: <SignupFormPage/>
        },
        {
          path: '*',
          element: <h2>Page Not Found! Oops!</h2>
        }
      ]
    }
  ]
  );
  return (
    <>
    <RouterProvider router={router} />
    </>
  )
}

export default App;
