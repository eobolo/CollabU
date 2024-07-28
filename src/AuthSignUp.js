import React from 'react'

const AuthSignUp = ({ first_name, last_name, email, setIntakeMonth, password, setFirstName, setLastName, setEmail, setIntakeYear, setPassword, signupError, handleSignUp, verifyPassword, setVerifyPassword }) => {
    return (
        <form method="post" encType="multipart/form-data" onSubmit={handleSignUp}>
            {signupError ? (<p className="signupError">
                {signupError}
            </p>) : null}
            <p>
                <label htmlFor="first_name">firstname</label>
                <input
                    id="first_name"
                    type="text"
                    value={first_name}
                    onChange={(e) => setFirstName(e.target.value)}
                />
            </p>
            <p>
                <label htmlFor="last_name">lastname</label>
                <input
                    id="last_name"
                    type="text"
                    value={last_name}
                    onChange={(e) => setLastName(e.target.value)}
                />
            </p>
            <p>
                <label htmlFor="email">email</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </p>
            <p>
                <label htmlFor="intake-year">Select Intake (Year)</label>
                <select name="intake-year" id="intake-year" onChange={(e) => {setIntakeYear(e.currentTarget.value)}}>
                    <option value="">--Please choose an option--</option>
                    <option value="2022">2022</option>
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                </select>
            </p>
            <p>
                <label htmlFor="intake-month">Select Intake (Month)</label>
                <select name="intake-month" id="intake-month" onChange={(e) => {setIntakeMonth(e.currentTarget.value)}}>
                    <option value="">--Please choose an option--</option>
                    <option value="January">January</option>
                    <option value="May">May</option>
                    <option value="September">September</option>
                </select>
            </p>
            <p>
                <label htmlFor="password">password</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </p>
            <p>
                <label htmlFor="verify_password">Verify password</label>
                <input
                    id="verify_password"
                    type="password"
                    value={verifyPassword}
                    onChange={(e) => setVerifyPassword(e.target.value)}
                />
            </p>
            <button
                type="submit"
            >
                Sign up
            </button>
        </form>
    );
}

export default AuthSignUp