import { useState } from "react"
import {useNavigate} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import { signup } from "../../store/session"

function SignupFormPage() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [username, setUsername] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('') 
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errors, setErrors] = useState({})
    const sessionUser = useSelector((state) => state.session.user)

    if (sessionUser) navigate('/')

    function handleSubmit(e) {
        e.preventDefault()
        setErrors({})

        return dispatch(signup({username, firstName, lastName, email, password})).catch(async (res) => {
            const data = await res.json();
            if (data?.message) setErrors(data)
        },)
    }

    return (
        <>
        <h1>SignupFormPage</h1>
        <form onSubmit={handleSubmit}>
            <div>
                <label>
                    Username:
                    <input 
                    type="text" 
                    name="username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    required/>
                </label>
            </div>
            <div>
                <label>
                    First Name:
                    <input 
                    type="text"
                    name="firstName" 
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)} 
                    required/>
                </label>
            </div>
            <div>
                <label>
                    Last Name:
                    <input 
                    type="text" 
                    name="lastName" 
                    value={lastName} 
                    onChange={(e) => setLastName(e.target.value)} 
                    required/>
                </label>
            </div>
            <div>
                <label>
                    Email:
                    <input 
                    type="text" 
                    name="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required/>
                </label>
            </div>
            <div>
                <label>
                    Password
                <input 
                type="password" 
                name="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required/>
                </label>
            </div>
            <div>
                <label>
                    Confirm Password
                <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required/>
                </label>
            </div>
            <button type="submit">Submit</button>
        </form>
        </>
    )
}

export default SignupFormPage