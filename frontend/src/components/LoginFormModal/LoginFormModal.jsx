import { useState } from "react"
import {useDispatch} from 'react-redux'
import {login} from '../../store/session.js'
import {useModal} from '../../context/Modal.jsx'
import './LoginFormModal.css'

function LoginFormModal() {
    const dispatch = useDispatch()
    const [credential, setCredential] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState({})
    const {closeModal} = useModal()

    function handleSubmit(e) {
        e.preventDefault()
        setErrors({})

        return dispatch(login({credential, password}))
        .then(closeModal)
        .catch(async (res) => {
            const data = await res.json();
            if (data?.message) setErrors(data)
            },
        )
    }

    const isDisabled = () => {
        return credential.length < 4 || password.length < 6;
    };
    const determineId = () => {
        if (isDisabled()){
            return 'login-disabled'
        } else {
            return 'login-enabled'
        }
    };

    function handleDemoUser() {
        return dispatch(login({credential: 'JohnSmith', password: 'secret password'}))
        .then(closeModal)
        .catch(async (res) => {
            const data = await res.json();
            if (data?.message) setErrors(data)
            },
        )

    }

    return (
        <>
        <form className="form" onSubmit={handleSubmit}>
            <div id="errors" style={{color: "red"}}>
                    {errors.message && errors.message}
            </div>
            <div>
                <label>
                    <i className="fa-solid fa-user" id="login-user-icon"></i>
                    <input 
                    type='text' 
                    value={credential} 
                    onChange={(e) => setCredential(e.target.value)}
                    id="credentials"
                    required
                    placeholder="Username or Email"
                    />
                </label>
            </div>
            <div>
                <label> 
                    <i className="fa-solid fa-lock" id="login-lock-icon"></i>
                    <input 
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    id="password"
                    required
                    placeholder="Password"
                    />
                </label>
            </div>
            <button id={'demo-user'} onClick={handleDemoUser}>Demo User</button>
            <button id={`${determineId()}`} type="submit" disabled={isDisabled()}>
                Log In
            </button>
        </form>
        </>
    )
}

export default LoginFormModal