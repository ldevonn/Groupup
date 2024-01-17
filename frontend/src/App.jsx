import { useEffect, useState } from 'react';
import {useDispatch } from 'react-redux';
import {createBrowserRouter, RouterProvider, Outlet} from 'react-router-dom'
import Navigation from './components/Navigation/Navigation.jsx';
import * as sessionActions from './store/session';
import LandingPage from './components/LandingPage/LandingPage.jsx';
import Groups from './components/Groups/Groups.jsx';
import Events from './components/Events/Events.jsx'

function Layout() {
  const dispatch = useDispatch()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
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
          element: <LandingPage/>
        },
        {
          path: '/groups',
          element: <Groups/>
        },
        {
          path: '/events',
          element: <Events/>
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
