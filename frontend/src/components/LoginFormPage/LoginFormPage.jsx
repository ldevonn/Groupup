import { useState } from "react"
import {login} from '../../store/session.js'
import {useDispatch, useSelector} from 'react-redux'
import {Navigate} from 'react-router-dom'

function LoginFormPage() {
    const sessionUser = useSelector((state) => state.session.user)
    const [credential, setCredential] = useState('')
    const [password, setPassword] = useState('')
    const dispatch = useDispatch()

    if (sessionUser) return <Navigate to="/" replace={true} />;

    function handleSubmit(e) {
        e.preventDefault()

        return dispatch(login({credential, password})).catch(
            window.alert('Login Failed')
        )
        
    }

    return (
        <>
        <h1>LoginFormPage</h1>
        <form onSubmit={handleSubmit} className="LoginForm">
            <div>
                <label>
                    Username:
                    <input 
                    type='text'
                    name="credential" 
                    value={credential} 
                    onChange={(e) => setCredential(e.target.value)}
                    required
                    />
                </label>
            </div>
            <div>
                <label>
                    Password:
                    <input 
                    type='text' 
                    name="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    />
                </label>
            </div>
            <button type="submit">
                Submit
            </button>
        </form>
        </>
    )
}

export default LoginFormPage