import { useState } from "react"
import {useDispatch} from 'react-redux'
import {login} from '../../store/session.js'
import {useModal} from '../../context/Modal.jsx'

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

    return (
        <>
        <h1>Log In</h1>
        <form onSubmit={handleSubmit}>
            <div>
                <label>
                    Username or Email:
                    <input 
                    type='text' 
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

export default LoginFormModal