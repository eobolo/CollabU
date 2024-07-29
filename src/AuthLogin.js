import './styles/AuthLogin.css'

const AuthLogin = ({ signupSuccess, email, password, setEmail, setPassword, handleLogin, signinError }) => {
    return (
        <section className='login-auth-section'>
            <div className='login-forms-div'>
                {signupSuccess ? (
                    <div className='login-success-form-msg login-success-msg'>
                        <p>
                            {signupSuccess}
                        </p>
                    </div>
                ) : null}
                {signinError ? (
                    <div className='login-error-form-msg login-error-msg'>
                        <p>{signinError}</p>
                    </div>
                ) : null}
                <div className='login-title'>
                    <h1>Login Here</h1>
                </div>
                <form onSubmit={handleLogin}>
                    <div>
                        <div className='login-form-group'>
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
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
                                Login
                            </button>
                        </div>
                    </div>

                </form>
            </div>
        </section>
    );
}

export default AuthLogin