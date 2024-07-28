import { useState, useEffect } from 'react';
import userAxios from './apis/userApi';

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
        const newgroups = {...groups};
        const groupArray = newgroups[year][monthObj[month] - 1][month];
        const newId = groupArray.length ? parseInt(groupArray[groupArray.length - 1].id) + 1 : 1;
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
        <div>
            {isLoggedUserGotten ? loggedUser.group ? null : (
                <button
                    onClick={handleShowCreateGroup}
                >Create Group
                </button>
            ) : (
                <div>
                    Fetching user...
                </div>
            )}
            {showCreateGroup ? (
                <div>
                    <form action="" onSubmit={handleShowCreateGroupSubmit}>
                        <div>
                            <label htmlFor="">Project Name</label>
                            <input
                                type="text"
                                value={projectName}
                                onChange={(e) => { setProjectName(e.currentTarget.value) }}
                            />
                        </div>

                        <div>
                            <label htmlFor="">Project Description</label>
                            <textarea
                                name=""
                                id=""
                                value={projectDescription}
                                onChange={(e) => { setProjectDescription(e.currentTarget.value) }}
                            >

                            </textarea>
                        </div>

                        <div>
                            <button type='submit'>Submit</button>
                        </div>
                    </form>
                </div>
            ) : null}

        </div>
    )
}

export default CreateGroup