import { useState, useEffect } from 'react';
import userAxios from './apis/userApi';
import './styles/CreateGroup.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';

const CreateGroup = ({ groups, setGroups, month, year, yearId, id, users, setUsers }) => {
    const [showCreateGroup, setShowCreateGroup] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [loggedUser, setUser] = useState({});
    const [isLoggedUserGotten, setIsLoggedUserGotten] = useState(false);

    const monthObj = {
        "January": 1,
        "May": 2,
        "September": 3,
    }

    useEffect(() => {
        const getUser = users.find((user) => user.id === id);
        setUser(getUser);
        setIsLoggedUserGotten(true);
    }, [id, users])

    const handleShowCreateGroup = () => {
        if (showCreateGroup) {
            setShowCreateGroup(false);
        } else {
            setShowCreateGroup(true);
        }
    }
    const handleShowCreateGroupSubmit = (e) => {
        e.preventDefault();
        // Getting the new group ID for that intake Year and Month
        const newgroups = { ...groups };
        const groupArray = newgroups[year][monthObj[month] - 1][month];
        let newId = groupArray.length ? groupArray.reduce((accumulator, currentValue) => typeof accumulator === "number" ? parseInt(accumulator) > parseInt(currentValue.id) ? parseInt(accumulator) : parseInt(currentValue.id) : parseInt(accumulator.id) > parseInt(currentValue.id) ? parseInt(accumulator.id) : parseInt(currentValue.id), 0) : 0;
        newId = parseInt(newId) + 1;
        const newGroup = `group${newId}`
        const newGroupObj = {
            id: `${newId}`,
            [newGroup]: {
                "Project Name": projectName,
                "Project Description": projectDescription,
                "usersId": [parseInt(id)],
                "length": 1,
            }
        }
        groupArray.push(newGroupObj);
        newgroups[year][monthObj[month] - 1][month] = groupArray;


        const updateGroupYear = async (newgroups) => {
            try {
                const sentGroupData = await userAxios.put(`/groups/${yearId}`, newgroups);
                if (sentGroupData) {
                    // Do nothing
                    console.log(newgroups);
                }
            } catch (error) {
                console.error("An error occured!");
            }
        }

        // now get that user, adjust the group key
        // and then update the user state, then patch
        // that user group
        const getUser = users.find((user) => user.id === id);
        const otherUsers = users.filter((user) => user.id !== id);
        getUser.group = `${newId}`;
        const updatedUser = [...otherUsers, getUser];

        const updateUserGroup = async (id) => {
            try {
                const sentUserGroup = await userAxios.patch(`/users/${id}`, { group: `${newId}` });
                if (sentUserGroup) {
                    // do nothing
                    console.log(users);
                }
            } catch (error) {
                console.error(``);
            }
        }

        updateUserGroup(id);
        updateGroupYear(newgroups);
        setUsers(updatedUser);
        setUser(getUser);
        setGroups(newgroups);
        setShowCreateGroup(false);
        setProjectName("");
        setProjectDescription("");
    }

    return (
        <>
            {isLoggedUserGotten ? loggedUser.group ? null : (
                <div className='mycreategroup-container'>
                    <div className='creategroup-items-fixed'>
                        <div className='creategroup-button-details'>
                            
                            <div
                                className='creategroup-button'
                                onClick={handleShowCreateGroup}
                            >Create Group<FontAwesomeIcon icon={faCirclePlus} className='fa-creategroup' />
                            </div>
                        </div>

                        {showCreateGroup ? (
                            <div className='forms-div'>
                                <form action="" onSubmit={handleShowCreateGroupSubmit}>
                                    <div className='form-group'>
                                        <label htmlFor="">Project Name</label>
                                        <input
                                            type="text"
                                            value={projectName}
                                            onChange={(e) => { setProjectName(e.currentTarget.value) }}
                                        />
                                    </div>

                                    <div className='form-group'>
                                        <label htmlFor="">Project Description</label>
                                        <textarea
                                            name=""
                                            id=""
                                            value={projectDescription}
                                            onChange={(e) => { setProjectDescription(e.currentTarget.value) }}
                                        >

                                        </textarea>
                                    </div>
                                    <div className='btn'>
                                        <button type='submit' className='submit-btn'>Submit</button>
                                    </div>
                                </form>
                            </div>
                        ) : null}

                    </div>
                </div>
            ) : (
                <div>
                    Fetching user...
                </div>
            )}
        </>
    )
}

export default CreateGroup