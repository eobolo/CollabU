import '../styles/AuthLogin.css'
import '../styles/AuthSignUp.css';
import { useEffect } from 'react';


const TeacherLogin = ({ signupSuccess, email, password, setEmail, setPassword, handleLogin, signinError, setIntakeMonth, setIntakeYear, setSigninError }) => {

    useEffect(() => {
        setTimeout(() => {
            setSigninError('');
        }, 5000)
    })

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
                    <h1>Login as Facilitator</h1>
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

export default TeacherLogin