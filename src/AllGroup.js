import { useState, useEffect } from 'react';
import userAxios from './apis/userApi';

export default function AllGroup({ groups, setGroups, month, year, yearId, id, users, setUsers }) {
    const [allGroups, setAllGroups] = useState([]);
    const [loggedUser, setUser] = useState({});
    const [isAllGroupGotten, setIsAllGroupGotten] = useState(false);
    const [isLoggedUserGotten, setIsLoggedUserGotten] = useState(false);
    const [showEachGroupDetail, setShowEachGroupDetail] = useState(false);
    const [divToDisplay, setDivToDisplay] = useState("");

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
        const allGroupData = groups[year][monthObj[month] - 1][month];
        console.log(allGroupData);
        if (allGroupData.length > 0) {
            console.log(allGroupData);
            setAllGroups(allGroupData);
            setIsAllGroupGotten(true);
        } else {
            setAllGroups([]);
            setIsAllGroupGotten(false);
        }
    }, [groups, year, month]);

    useEffect(() => {
        const getUser = users.find((user) => user.id === id);
        if (!getUser) {
            setUser({});
            setIsLoggedUserGotten(false);
        } else {
            console.log(getUser);
            setUser(getUser);
            setIsLoggedUserGotten(true);
        }
    }, [users, id])

    const handleShowEachGroupDetail = (groupId) => {
        if (showEachGroupDetail) {
            setShowEachGroupDetail(false);
            setDivToDisplay("");
        } else {
            setShowEachGroupDetail(true);
            setDivToDisplay(groupId);
        }
    }

    const handleJoinClickedGroup = (groupId) => {
        allGroups[groupId - 1][`group${groupId}`]["usersId"].push(parseInt(id));
        allGroups[groupId - 1][`group${groupId}`]["length"] = (allGroups[groupId - 1][`group${groupId}`]["usersId"]).length
        const newgroups = {...groups};
        newgroups[year][monthObj[month] - 1][month] = allGroups;

        // changed user group to `${groupId}`
        const updatedUsers = users.map((user) => {
            if (user.id !== id) return user;
            else return {
                ...user, group: `${groupId}`,
            };
        });

        // update grops endpoint in the db
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

        // update user.group in the db
        const updateUserGroup = async (id) => {
            try {
                const sentUserGroup = await userAxios.patch(`/users/${id}`, { group: `${groupId}` });
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
        setGroups(newgroups);
        setUsers(updatedUsers);
        setShowEachGroupDetail(false);
        setDivToDisplay("");
    }

    return (
        <div>
            {isAllGroupGotten && isLoggedUserGotten ? (
                <div>
                    {allGroups.map((eachGroup) => (
                        <div key={eachGroup.id}>
                            <button
                                type='button'
                                id={eachGroup.id}
                                onClick={(e) => handleShowEachGroupDetail(e.currentTarget.id)}
                            >
                                {`Group ${eachGroup.id}`}
                            </button>
                            {showEachGroupDetail && (divToDisplay === eachGroup.id) ? (
                                <div>
                                    <div>
                                        <p>Project Name:</p>
                                        <div>{eachGroup[`group${eachGroup.id}`]["Project Name"]}</div>
                                    </div>
                                    <div>
                                        <p>Project Description:</p>
                                        <div>{eachGroup[`group${eachGroup.id}`]["Project Description"]}</div>
                                    </div>
                                    <div>
                                        <p>People:</p>
                                        <div>{eachGroup[`group${eachGroup.id}`]["length"]}</div>
                                    </div>
                                    <div>
                                        <p>Members:</p>
                                        {(users.filter((user) => user.group === `${eachGroup.id}` && user.month === month && user.year === year)).map((user) => (
                                            <div key={user.id}>
                                                <p>{user.first_name} {user.last_name}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div>
                                        {!((loggedUser.group !== eachGroup.id) && (loggedUser.group !== "")) ? !(loggedUser.group === eachGroup.id) ? (
                                            <button
                                                type='button'
                                                name={eachGroup.id}
                                                onClick={(e) => handleJoinClickedGroup(e.currentTarget.name)}
                                            >
                                                {`Join Group ${eachGroup.id}`}
                                            </button>
                                        ) : (
                                            <p>This is your Group 😁</p>
                                        ) : (
                                            <p>This not your Group 😿</p>
                                        )}
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    );
}
