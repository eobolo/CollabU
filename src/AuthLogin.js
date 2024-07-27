import React from 'react'

const AuthLogin = ( {signupSuccess, email, password, setEmail, setPassword, handleLogin, signinError} ) => {
    return (
        <section>
            {signupSuccess ? (<p>
                {signupSuccess}
            </p>) : null}
            {signinError ? (
                <p>{signinError}</p>
            ) : null}
            <h1>Login Here :)</h1>
            <form onSubmit={handleLogin}>
                <p>
                    <label htmlFor="email">email</label>
                    <input
                        id="email"
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
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
                <button
                    type="submit"
                >
                    Login
                </button>
            </form>
        </section>
    );
}

export default AuthLogin