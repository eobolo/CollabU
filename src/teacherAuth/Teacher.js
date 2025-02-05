import '../styles/AuthSignUp.css';
import '../styles/FileSharing.css';

const Teacher = ({ first_name, last_name, email, password, setFirstName, setLastName, setEmail, setPassword, signupError, handleSignUp, verifyPassword, setVerifyPassword, isAdmin }) => {
    return (
        <div>
            {isAdmin ? <>
                <section className='auth-section'>
                    <div className='forms-div'>
                        {signupError ? (
                            <div className='error-form-msg error-msg'>
                                <p>
                                    {signupError}
                                </p>
                            </div>
                        ) : null}
                        <div className='title' style={{textAlign: "center"}}>
                            <h1 style={{ fontSize: "20px"}}>Sign Up as Faciliator</h1>
                        </div>

                        <form method="post" encType="multipart/form-data" onSubmit={(e) => {
                            handleSignUp(e, true);
                        }}>
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
            </> : <>
                <div className='discussion-no-comment-section'>
                    ERR 404: Page Not found
                </div>
            </>}
        </div>
    );
}

export default Teacher;