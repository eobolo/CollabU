import { Route, Routes, useNavigate } from 'react-router-dom';
import HomeHeader from './HomeHeader';
import Homepage from './Homepage';
import AuthLogin from './AuthLogin';
import AuthSignUp from './AuthSignUp';
import Discussion from './Discussion';
import FileSharing from './FileSharing';
import { useState, useEffect } from 'react';
import userAxios from './apis/userApi';

function App() {
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [intakeMonth, setIntakeMonth] = useState('');
  const [intakeYear, setIntakeYear] = useState(null);
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [signupError, setSignupError] = useState(null);
  const [signupSuccess, setSignupSuccess] = useState(null);
  const [signinError, setSigninError] = useState(null);
  const [noUserAccount, setNoUserAccount] = useState(null);
  const [users, setUsers] = useState([]);
  const [isUsersGotten, setIsUserGotten] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await userAxios.get("/users");
        if (usersData.data.length === 0) {
          setNoUserAccount("No user account Found !!!")
        } else {
          setUsers(usersData.data);
          setIsUserGotten(true);
        }
      } catch (error) {
        console.error(`An Error with status ${error.response.status} and headers of ${error.response.headers} with data ${error.response.data} occured :(`);
      }
    }
    fetchUsers();
  }, []);


  const handleSignUp = (e) => {
    /*
      prevent the default action of a form
      which is to submit it to a server given
      by action attribute and the request method
      given by the method attribute.
    */
    e.preventDefault();
    // check passwords if they are correct
    if (password !== verifyPassword) {
      setSignupError("Your passwords are not identical check password again :(");
      setPassword('');
      setVerifyPassword('');
      return;
    }
    // check if the users data have not been successfully fetched
    if (users.length === 0) {
      if (noUserAccount) {
        //Do nothing
      } else {
        setSignupError("Data verification in progress. Please wait briefly before resubmitting. Thank you!");
        return;
      }
    }

    // check if the user exists
    const checkUserExist = function (user) {
      if (user.email === email) {
        return true;
      } else {
        return false;
      }
    }
    const userExists = users.filter(checkUserExist);

    if (userExists.length > 0) {
      setSignupError(`The User with email ${userExists[0].email} already exists`);
      setPassword('');
      setVerifyPassword('');
      return;
    }
    /*
      TODO.
      If the userExists length is 0 (zero), that user doesn't exist and can be added to the database of users, and also the state Users and also redirect to login and also give a success message, also
      change the state of form and signup error.
    */
    // new user id
    let id = users.length ? users.reduce((accumulator, currentValue) => typeof accumulator === "number" ? accumulator > currentValue.id ? accumulator : currentValue.id : accumulator.id > currentValue.id ? accumulator.id : currentValue.id, 0) : 0;
    id = parseInt(id) + 1;
    console.log(id);
    const isLoggedin = false;
    // note here the id's of endpoints must be in strings
    const newUser = { id: `${id}`, first_name: first_name.toUpperCase(), last_name: last_name.toUpperCase(), email, password, month: intakeMonth, year: intakeYear, group: '', isLoggedin };
    // first add the data to the state in case someone
    // else wants to create an account before our posted
    // new user works.
    const allUsers = [...users, newUser];
    // post the data to the server
    const addUser = async (user) => {
      try {
        const userData = await userAxios.post(`/users/`, user);
        console.log(userData.data);
      } catch (error) {
        console.error(`An Error with status ${error.response.status} and headers of ${error.response.headers} with data ${error.response.data} occured :(`)
      }
    }
    addUser(newUser);
    setUsers(allUsers);
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
    setVerifyPassword('');
    setIntakeMonth('');
    setIntakeYear('');
    setSigninError(null);
    setSignupSuccess('User successfully Created :)');
    navigate("/");
  }


  const handleLogin = (e) => {
    // prevent the default of submitting a form
    e.preventDefault();
    // a callback function used to filter if that account exists or not
    const checkUserIn = (user) => {
      if (user.email === email && password === user.password) {
        return true;
      } else {
        return false;
      }
    }
    // get the user if it exists or not
    const authenticateUser = users.filter(checkUserIn);
    // if user doesn't exist send an error to the form
    if (authenticateUser.length === 0) {
      setSigninError("This account doesn't exist, sign up to create one :(");
      setSignupSuccess('');
      return;
    }
    /*
      change the isloggedin of that authenticated user to true,
      create a new array of objects haveing the loggedin user
      isLoggedin property changed.

      we have to send patch request for the authenticateUser[0].id,
      to change the user isLoggedin attribute in the database and in the state
    */
    authenticateUser[0].isLoggedin = true;
    let newUserData = users.filter((user) => user.id !== authenticateUser[0].id);
    newUserData = [...newUserData, authenticateUser[0]];
    const changeUserIsLoggedin = async (id) => {
      try {
        const changeIsLoggedIn = await userAxios.patch(`/users/${id}/`, { isLoggedin: true });
        console.log(changeIsLoggedIn);
        const month = authenticateUser[0].month;
        const year = authenticateUser[0].year;

        navigate(`/home/${id}/${year}/${month}`);
      } catch (error) {
        console.error(`An Error with status ${error.response.status} and headers of ${error.response.headers} with data ${error.response.data} occured :(`);
      }
    }
    changeUserIsLoggedin(authenticateUser[0].id);
    // if the user exist navigate to the second app which is the user dashboard
    setUsers(newUserData);
    setPassword('');
    setEmail('');
  }

  return (
    <div className='App'>
      <HomeHeader />
      {isUsersGotten ? (
        <Routes>
          <Route path="/" element={<AuthLogin signupSuccess={signupSuccess} email={email} password={password} setEmail={setEmail} setPassword={setPassword} handleLogin={handleLogin} signinError={signinError} />} />
          <Route path="/signup" element={<AuthSignUp first_name={first_name} last_name={last_name} email={email} setIntakeMonth={setIntakeMonth} password={password} setFirstName={setFirstName} setLastName={setLastName} setEmail={setEmail} setIntakeYear={setIntakeYear} setPassword={setPassword} signupError={signupError} handleSignUp={handleSignUp} verifyPassword={verifyPassword} setVerifyPassword={setVerifyPassword} />} />
          <Route path="/home/:id/:year/:month" element={<Homepage
            users={users}
            setUsers={setUsers}
          />} />
          <Route path="/discussions/:id/:year/:month/:group?" element={<Discussion
            users={users}
          />} />
          <Route path="/filesharing/:id/:year/:month/:group?" element={<FileSharing
            users={users}
          />} />
        </Routes>
      ) : <div>
        <p>fetching data ...</p>
      </div>}
    </div>
  );
}

export default App;
