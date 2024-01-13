import {createBrowserRouter, RouterProvider, Outlet} from 'react-router-dom'
import LoginFormPage from './components/LoginFormPage/LoginFormPage';
import { restoreUser } from './store/session.js';
import {useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';

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
