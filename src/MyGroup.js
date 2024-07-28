import { useState, useEffect } from 'react';
import userAxios from './apis/userApi';

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
            const userGroup = groups[year][monthObj[month] - 1][month][groupId - 1]
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
        const newgroups = {...groups};
        const group = newgroups[year][monthObj[month] - 1][month];
        const userId = parseInt(id);
        (myGroup[`group${loggedUser.group}`]["usersId"]).splice((myGroup[`group${loggedUser.group}`]["usersId"]).indexOf(userId), 1);
        myGroup[`group${loggedUser.group}`]["length"] = (myGroup[`group${loggedUser.group}`]["usersId"]).length;
        group.splice(parseInt(loggedUser.group) - 1, 1, myGroup);
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
                    console.log(groups)
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
                    // do nothing
                    console.log(users);
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
        <div>
            {isMyGroupGotten ? (
                <>
                    {myGroup.id ? (<button
                        type='button'
                        onClick={handleShowMyGroup}
                    >
                        {`Group ${myGroup.id}`}
                    </button>) : null}
                    {showMyGroup ? (
                        <div>
                            <div>
                                <p>Project Name:</p>
                                <div>{myGroup[`group${myGroup.id}`]["Project Name"]}</div>
                            </div>
                            <div>
                                <p>Project Description:</p>
                                <div>
                                    {myGroup[`group${myGroup.id}`]["Project Description"]}
                                </div>
                            </div>
                            <div>
                                <p>People</p>
                                <div>
                                    {myGroup[`group${myGroup.id}`]["length"]}
                                </div>
                            </div>
                            <div>
                                <p>Members:</p>
                                {(users.filter((user) => user.group === `${myGroup.id}` && user.month === month && user.year === year)).map((user) => (
                                    <div key={user.id}>
                                        <p>{user.first_name} {user.last_name}</p>
                                    </div>
                                ))}
                            </div>
                            <div>
                                <button
                                    type='button'
                                    onClick={handleLeaveGroup}
                                >
                                    Leave Group
                                </button>
                            </div>
                        </div>
                    ) : null}
                </>
            ) : null}
        </div>
    )
}
