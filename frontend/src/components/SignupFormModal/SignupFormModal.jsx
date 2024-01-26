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

    const isDisabled = () => {
        if (
            username.length < 4 ||
            password.length < 6 ||
            firstName.length === 0 ||
            lastName.length === 0 ||
            email.length === 0 ||
            checkPassLengths()
        ) return true
    };

    const checkPassLengths = () => {
        if (
            password.length >= 6 && 
            confirmPassword.length >= 6 &&
            password.length !== confirmPassword.length
        ) {
            return 'Password has a different length than the confirmed password.'
        }
    };
    const determineId = () => {
        if (isDisabled()){
            return 'login-disabled'
        } else {
            return 'login-enabled'
        }
    };

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
                    id="signup-fields"
                    onChange={(e) => setUsername(e.target.value)} 
                    required/>
                </label>
            </div>
            {errors.username && <p style={{color: 'red'}}>{errors.usernameme}</p>}
            <div>
                <label>
                    <input 
                    id="signup-fields"
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
                    id="signup-fields"
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
                    id="signup-fields"
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
                id="signup-fields"
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
                id="final-field"
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required/>
                </label>
                {checkPassLengths() && <p id="errors" style={{color: 'red'}}>{`${checkPassLengths()}`}</p>}
            </div>
            <button id={`${determineId()}`} type="submit" disabled={isDisabled()}>
                Sign Up
            </button>
        </form>
        </>
    )
}

export default SignupFormModal