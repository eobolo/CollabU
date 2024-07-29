import './styles/AuthSignUp.css';

const AuthSignUp = ({ first_name, last_name, email, setIntakeMonth, password, setFirstName, setLastName, setEmail, setIntakeYear, setPassword, signupError, handleSignUp, verifyPassword, setVerifyPassword }) => {
    return (
        <section className='auth-section'>
            <div className='forms-div'>
                {signupError ? (
                    <div className='error-form-msg error-msg'>
                        <p>
                            {signupError}
                        </p>
                    </div>
                ) : null}
                <div className='title'>
                    <h1>Sign Up</h1>
                </div>

                <form method="post" encType="multipart/form-data" onSubmit={handleSignUp}>
                    <div>
                        <div className='form-group'>
                            <label htmlFor="first_name">Firstname</label>
                            <input
                                id="first_name"
                                type="text"
                                required
                                value={first_name}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>
                        <div className='form-group'>
                            <label htmlFor="last_name">Lastname</label>
                            <input
                                id="last_name"
                                type="text"
                                required
                                value={last_name}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>
                        <div className='form-group'>
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className='form-group'>
                            <label htmlFor="intake-year">Select Intake (Year)</label>
                            <select name="intake-year" id="intake-year" required onChange={(e) => { setIntakeYear(e.currentTarget.value) }}>
                                <option value="">--Please choose an option--</option>
                                <option value="2022">2022</option>
                                <option value="2023">2023</option>
                                <option value="2024">2024</option>
                            </select>
                        </div>
                        <div className='form-group'>
                            <label htmlFor="intake-month">Select Intake (Month)</label>
                            <select name="intake-month" id="intake-month" required onChange={(e) => { setIntakeMonth(e.currentTarget.value) }}>
                                <option value="">--Please choose an option--</option>
                                <option value="January">January</option>
                                <option value="May">May</option>
                                <option value="September">September</option>
                            </select>
                        </div>
                        <div className='form-group'>
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className='form-group'>
                            <label htmlFor="verify_password">Verify password</label>
                            <input
                                id="verify_password"
                                type="password"
                                required
                                value={verifyPassword}
                                onChange={(e) => setVerifyPassword(e.target.value)}
                            />
                        </div>
                        <div className='btn'>
                            <button
                                type="submit"
                                className='submit-btn'
                            >
                                Sign Up
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
}

export default AuthSignUp