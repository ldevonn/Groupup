import { useState } from "react"
import {useDispatch} from 'react-redux'
import {useModal} from '../../context/Modal'
import { signup } from "../../store/session"

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
            {errors.username && <p style={{color: 'red'}}>{errors.usernameme}</p>}
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
            {errors.firstName && <p style={{color: 'red'}}>{errors.firstName}</p>}
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
            {errors.lastName && <p style={{color: 'red'}}>{errors.lastName}</p>}
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
            {errors.email && <p style={{color: 'red'}}>{errors.email}</p>}
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
            {errors.password && <p style={{color: 'red'}}>{errors.password}</p>}
            <div>
                <label>
                    Confirm Password
                <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required/>
                </label>
                {errors.confirmPassword && <p style={{color: 'red'}}>{errors.confirmPassword}</p>}
            </div>
            <button type="submit">Submit</button>
        </form>
        </>
    )
}

export default SignupFormModal