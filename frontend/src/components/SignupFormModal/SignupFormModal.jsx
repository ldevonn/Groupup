import { useState } from "react"
import {useDispatch} from 'react-redux'
import {useModal} from '../../context/Modal'
import { signup } from "../../store/session"
import './SignupFormModal.css'

function SignupFormModal() {
    const dispatch = useDispatch()
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('') 
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errors, setErrors] = useState({})
    const {closeModal} = useModal()

    function handleSubmit(e) {
        e.preventDefault()
        if (password === confirmPassword) {
            setErrors({})
            return dispatch(signup({
                username, 
                firstName, 
                lastName, 
                email, 
                password
            })
            )
            .then(closeModal)
            .catch(async (res) => {
                const data = await res.json();
                if (data?.errors) {
                    setErrors(data.errors)
                }
            });
        }
        return setErrors({
            confirmPassword: "Confirm Password field must be the same as the Password field"
        })

    }

    return (
        <>
        <form className="form" onSubmit={handleSubmit}>
            <div>
                <label>
                    <input 
                    type="text"
                    name="username" 
                    placeholder="Username"
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    required/>
                </label>
            </div>
            {errors.username && <p style={{color: 'red'}}>{errors.usernameme}</p>}
            <div>
                <label>
                    <input 
                    type="text"
                    name="firstName" 
                    placeholder="First Name"
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)} 
                    required/>
                </label>
            </div>
            {errors.firstName && <p style={{color: 'red'}}>{errors.firstName}</p>}
            <div>
                <label>
                    <input 
                    type="text" 
                    name="lastName" 
                    placeholder="Last Name"
                    value={lastName} 
                    onChange={(e) => setLastName(e.target.value)} 
                    required/>
                </label>
            </div>
            {errors.lastName && <p style={{color: 'red'}}>{errors.lastName}</p>}
            <div>
                <label>
                    <input 
                    type="text" 
                    name="email" 
                    placeholder="Email"
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required/>
                </label>
            </div>
            {errors.email && <p style={{color: 'red'}}>{errors.email}</p>}
            <div>
                <label>
                <input 
                type="password" 
                name="password" 
                placeholder="Password"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required/>
                </label>
            </div>
            {errors.password && <p style={{color: 'red'}}>{errors.password}</p>}
            <div>
                <label>
                <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required/>
                </label>
                {errors.confirmPassword && <p style={{color: 'red'}}>{errors.confirmPassword}</p>}
            </div>
            <button id="signup-button" type="submit">Sign Up</button>
        </form>
        </>
    )
}

export default SignupFormModal