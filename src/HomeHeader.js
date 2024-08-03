import { useNavigate, Link } from 'react-router-dom';
import userAxios from './apis/userApi';
import './styles/HomeHeader.css';
import Logo from './images/collabu-main-logo.png';
import SmLogo from './images/collabu-s-logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { faPersonWalkingDashedLineArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faClipboardUser } from '@fortawesome/free-solid-svg-icons';
import { faRankingStar } from '@fortawesome/free-solid-svg-icons';

const HomeHeader = ({ authUser, users, setUsers }) => {
    const navigate = useNavigate();

    const handleLogOut = () => {
        // get the users that are not this logged user
        if (!authUser.length) {
            navigate("/");
            return;
        }
        let allUsers = users.filter((user) => user.id !== authUser[0].id);
        // now change the login status of the logged user to false
        authUser[0].isLoggedin = false;
        // now create a new array to store the logged in user and all other users
        allUsers = [...allUsers, authUser[0]];
        // create a function to patch this isloggedin status to the data base
        const logOutUser = async (id) => {
            try {
                await userAxios.patch(`/users/${id}/`, { isLoggedin: false });
                navigate("/");
            } catch (error) {
                console.error(`An Error with status ${error.response.status} and headers of ${error.response.headers} with data ${error.response.data} occured :(`);
            }
        }
        logOutUser(authUser[0].id);
        setUsers(allUsers);
    }
    return (
        <header>
            <nav>
                <Link to="/" className='logo'>
                    <img
                        src={Logo}
                        alt="collabU-logo"
                        className='logo-img'
                    />
                    <img
                        src={SmLogo}
                        alt="collabU-sm-logo"
                        className='logo-sm-icon'
                    />
                </Link>
                <ul className="nav-list">
                    <li className="nav-links1"><Link to="/">
                        <FontAwesomeIcon icon={faRightToBracket} className='fa-icon' />
                        <p>Login</p>
                    </Link></li>
                    <li className="nav-links"><Link to="/signup">
                        <FontAwesomeIcon icon={faUserPlus} className='fa-icon' />
                        <p>Sign Up</p>
                    </Link></li>
                    <li className='nav-links3'><Link to="/teacher"><FontAwesomeIcon icon={faClipboardUser} className='fa-icon' />
                        <p>Teacher</p>
                    </Link></li>
                    <li className='nav-links'><Link to="/insights"><FontAwesomeIcon icon={faRankingStar} className='fa-icon' />
                        <p>Insights</p>
                    </Link></li>
                    <li>
                        <div className='logout-div' onClick={handleLogOut}>
                            <FontAwesomeIcon icon={faPersonWalkingDashedLineArrowRight} flip="horizontal" className='fa-logout-icon' />
                            <p>Log Out</p>
                        </div>
                    </li>
                    <div className='active'></div>
                </ul>
            </nav>
        </header>
    );
}

export default HomeHeader