import { useState, useEffect } from 'react';
import userAxios from './apis/userApi';
import './styles/MyGroup.css';

export default function MyGroup({ groups, setGroups, month, year, yearId, id, users, setUsers }) {
    const [showMyGroup, setShowMyGroup] = useState(false);
    const [isMyGroupGotten, setIsMyGroupGotten] = useState(false);
    const [myGroup, setMyGroup] = useState({});
    const [loggedUser, setUser] = useState({});
    const monthObj = {
        "January": 1,
        "May": 2,
        "September": 3,
    }

    useEffect(() => {
        const monthObj = {
            "January": 1,
            "May": 2,
            "September": 3,
        }
        const getUser = users.find((user) => user.id === id);
        const groupId = parseInt(getUser.group);
        if (!groupId) {
            setIsMyGroupGotten(false)
            setMyGroup({});
            setUser({});
        } else {
            let groupIndex;
            const arrayToCheck = groups[year][monthObj[month] - 1][month]
            groupIndex = arrayToCheck.findIndex((element) => parseInt(element.id) === groupId) + 1;         
            const userGroup = groups[year][monthObj[month] - 1][month][groupIndex - 1]
            setIsMyGroupGotten(true)
            setMyGroup(userGroup);
            setUser(getUser);
        }
    }, [users, id, groups, year, month])

    const handleShowMyGroup = () => {
        if (showMyGroup) {
            setShowMyGroup(false);
        } else {
            setShowMyGroup(true);
        }
    }

    const handleLeaveGroup = () => {
        const newgroups = { ...groups };
        const group = newgroups[year][monthObj[month] - 1][month];
        const userId = parseInt(id);
        (myGroup[`group${loggedUser.group}`]["usersId"]).splice((myGroup[`group${loggedUser.group}`]["usersId"]).indexOf(userId), 1);
        myGroup[`group${loggedUser.group}`]["length"] = (myGroup[`group${loggedUser.group}`]["usersId"]).length;
        const groupIndex = group.findIndex((group) => group.id === loggedUser.group)
        group.splice(groupIndex, 1, myGroup);
        newgroups[year][monthObj[month] - 1][month] = group;

        // changed user group to ""
        const updatedUsers = users.map((user) => {
            if (user.id !== id) return user;
            else return {
                ...user, group: "",
            };
        });

        // update the groups i.e that user intake year
        const updateGroupYear = async (newgroups) => {
            try {
                const sentGroupData = await userAxios.put(`/groups/${yearId}`, newgroups);
                if (sentGroupData) {
                    // Do nothing
                }
            } catch (error) {
                console.error("An error occured!");
            }
        }

        // update user roup in the db
        const updateUserGroup = async (id) => {
            try {
                const sentUserGroup = await userAxios.patch(`/users/${id}`, { group: "" });
                if (sentUserGroup) {
                    // Do nothing
                }
            } catch (error) {
                console.error(``);
            }
        }

        updateUserGroup(id);
        updateGroupYear(newgroups);
        setIsMyGroupGotten(false);
        setMyGroup({});
        setUsers(updatedUsers);
        setGroups(newgroups);
        setShowMyGroup(false);
    }

    return (
        <>
            <div className='mygroup-main-title'>
                <p>My Groups</p>
            </div>
            {isMyGroupGotten ? (
                <div className='mygroup-container'>

                    <div className='group-items-fixed'>
                        {myGroup.id ? (
                            <div className='group-button-details'>
                                <div
                                    style={showMyGroup ? 
                                        { 
                                            background: '#609257',
                                            color: '#fff' 
                                        } : {} }
                                    className='mygroup-button'
                                    type='button'
                                    onClick={handleShowMyGroup}
                                >
                                    {`Group ${myGroup.id}`}
                                </div>
                            </div>
                        ) : null}
                        {showMyGroup ? (
                            <div className='group-project-details'>
                                <div className='group-project-name'>
                                    <p>Project Name:</p>
                                    <div className='group-project-title'>{myGroup[`group${myGroup.id}`]["Project Name"]}</div>
                                </div>
                                <div className='group-project-description'>
                                    <p>Project Description:</p>
                                    <div className='group-project-description-text'>
                                        {myGroup[`group${myGroup.id}`]["Project Description"]}
                                    </div>
                                </div>
                                <div className='group-members-number'>
                                    <div>
                                        {myGroup[`group${myGroup.id}`]["length"]}
                                    </div>
                                    <p>{myGroup[`group${myGroup.id}`]["length"] <= 1 ? 'Member' : 'Members'}</p>
                                </div>
                                <div className='group-members-names'>
                                    {(users.filter((user) => user.group === `${myGroup.id}` && user.month === month && user.year === year)).map((user) => (
                                        <div key={user.id} className='group-members-names-div'>
                                            <p className='group-members-fullname'>{(user.first_name).toLowerCase()} {(user.last_name).toLowerCase()}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className='mygroup-btn'>
                                    <button
                                        className='mygroup-submit-btn'
                                        type='button'
                                        onClick={handleLeaveGroup}
                                    >
                                        Leave Group
                                    </button>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            ) : null}
        </>
    )
}
