import { useState } from "react"
import {login} from '../../store/session.js'
import {useDispatch, useSelector} from 'react-redux'
import { useNavigate } from "react-router-dom"

function LoginFormPage() {
    const sessionUser = useSelector((state) => state.session.user)
    const [credential, setCredential] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState({})
    const dispatch = useDispatch()
    const navigate = useNavigate()

    if (sessionUser) navigate('/')

    function handleSubmit(e) {
        e.preventDefault()
        setErrors({})

        return dispatch(login({credential, password})).catch(
            async (res) => {
                const data = await res.json();
                if (data?.message) setErrors(data)
            },
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
                    type='password' 
                    name="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    />
                </label>
                <div style={{color: "red"}}>
                    {errors.message && errors.message}
                </div>
            </div>
            <button type="submit">
                Submit
            </button>
        </form>
        </>
    )
}

export default LoginFormPage