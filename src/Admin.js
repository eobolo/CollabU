import './styles/AuthLogin.css'
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Admin({ setIsAdmin }) {
    const [signinError, setSigninError] = useState(null);
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        // prevent the default of submitting a form
        e.preventDefault();
        if (password !== "9xT!vL@72p#QmZr&8gWd") {
            setSigninError(`Admin password ${password} is wrong`)
        } else {
            setIsAdmin(true);
            navigate(`/teacher`);
        }
    }

    return (
        <section className='login-auth-section'>
            <div className='login-forms-div'>
                {signinError ? (
                    <div className='login-error-form-msg login-error-msg'>
                        <p>{signinError}</p>
                    </div>
                ) : null}
                <div className='login-title'>
                    <h1>Admin</h1>
                </div>
                <form onSubmit={handleLogin}>
                    <div>
                        <div className='login-form-group'>
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className='login-btn'>
                            <button
                                type="submit"
                                className='login-submit-btn'
                            >
                                Login as Admin
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
}
