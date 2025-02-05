import { useNavigate, Link } from 'react-router-dom';
import userAxios from '../apis/userApi';
import '../styles/HomeHeader.css';
import Logo from '../images/collabu-main-logo.png';
import SmLogo from '../images/collabu-s-logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { faPersonWalkingDashedLineArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faCogs } from '@fortawesome/free-solid-svg-icons';
import { faChalkboardTeacher } from '@fortawesome/free-solid-svg-icons';


const HomeHeader = ({ authUser, users, setUsers }) => {
    const navigate = useNavigate();
    const monthObj = {
        "January": 1,
        "May": 2,
        "September": 3,
    }

    const handleLogOut = async () => {
        // get the users that are not this logged user
        const userPersona = [users.find((user) => user.id === authUser[0].id)];
        if (!userPersona.length) {
            navigate("/");
            return;
        }

        const loggedUser = userPersona[0];
        const intakeYear = parseInt(loggedUser.year);
        const removeGroupYear = 2021;
        const yearId = intakeYear - removeGroupYear;
        const year = loggedUser.year;
        const month = loggedUser.month;
        const id = loggedUser.id;

        const handleTeacherLeaveGroup = async () => {
            try {
                const groupsData = await userAxios.get(`/groups/${yearId}`);
                const isDataGotten = Object.keys(groupsData.data).length > 0
                if (!isDataGotten) {
                    // do nothing
                } else {
                    const groupId = parseInt(loggedUser.group);
                    if (!groupId) {
                        // do nothing
                    } else {
                        //getting my group from groups(groupsData.data) - MyGroup
                        let groupPosition;
                        const arrayToCheck = groupsData.data[year][monthObj[month] - 1][month];
                        groupPosition = arrayToCheck.findIndex((element) => parseInt(element.id) === groupId) + 1;
                        const myGroup = groupsData.data[year][monthObj[month] - 1][month][groupPosition - 1];

                        // leaving a group - MyGroup
                        const newgroups = { ...groupsData.data };
                        const group = newgroups[year][monthObj[month] - 1][month];
                        const userId = parseInt(id);
                        (myGroup[`group${loggedUser.group}`]["usersId"]).splice((myGroup[`group${loggedUser.group}`]["usersId"]).indexOf(userId), 1);
                        myGroup[`group${loggedUser.group}`]["length"] = (myGroup[`group${loggedUser.group}`]["usersId"]).length;
                        const groupIndex = group.findIndex((group) => group.id === loggedUser.group)
                        group.splice(groupIndex, 1, myGroup);
                        newgroups[year][monthObj[month] - 1][month] = group;
                
                        // update the groups i.e that user intake year
                        const updateGroupYear = async (newgroups) => {
                            try {
                                const sentGroupData = await userAxios.put(`/groups/${yearId}`, newgroups);
                                if (sentGroupData) {
                                    // Do nothing
                                }
                            } catch (error) {
                                console.error(`An error occured: ${error}`);
                            }
                        }
                        await updateGroupYear(newgroups);
                    }
                }
            } catch (error) {
                console.error(`An error occured getting groups:${error}`);
            }
        }

        let allUsers = users.filter((user) => user.id !== authUser[0].id);
        // now change the login status of the logged user to false
        loggedUser.isLoggedin = false;
        // check if authenticated user is a facilitator and adjust month and default to default
        if (loggedUser.isTeacher) {
            const currentGroup = loggedUser.group;        
            if (currentGroup) {
                await handleTeacherLeaveGroup();
            }
            // Clear after leaving the group
            loggedUser.group = '';
            loggedUser.month = '';
            loggedUser.year = '';
        }
        // now create a new array to store the logged in user and all other users
        allUsers = [...allUsers, loggedUser];
        // create a function to patch this isloggedin status to the data base
        const logOutUser = async (id) => {
            try {
                await userAxios.patch(`/users/${id}/`, { isLoggedin: false, month: loggedUser.month, year: loggedUser.month, group: loggedUser.group });
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
                    <li className='nav-links3'><Link to="/admin"><FontAwesomeIcon icon={faCogs} className='fa-icon' />
                        <p>Admin</p>
                    </Link></li>
                    <li className='nav-links'><Link to="/login"><FontAwesomeIcon icon={faChalkboardTeacher} className='fa-icon' />
                        <p>Teachers</p>
                    </Link></li>
                    <li>
                        <div className='logout-div' onClick={() => handleLogOut()}>
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