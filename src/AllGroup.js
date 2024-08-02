import { useState, useEffect } from 'react';
import userAxios from './apis/userApi';
import './styles/AllGroup.css'

export default function AllGroup({ groups, setGroups, month, year, yearId, id, users, setUsers }) {
    const [allGroups, setAllGroups] = useState([]);
    const [loggedUser, setUser] = useState({});
    const [isAllGroupGotten, setIsAllGroupGotten] = useState(false);
    const [isLoggedUserGotten, setIsLoggedUserGotten] = useState(false);
    const [showEachGroupDetail, setShowEachGroupDetail] = useState(false);
    const [divToDisplay, setDivToDisplay] = useState("");
    const [prevDivToDisplay, setPrevDivToDisplay] = useState("");

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
            if (groupId === prevDivToDisplay) {
                setShowEachGroupDetail(false);
                setDivToDisplay("");
                setPrevDivToDisplay(groupId);
            } else {
                setShowEachGroupDetail(true);
                setDivToDisplay(groupId);
                setPrevDivToDisplay(groupId);
            }
        } else {
            setShowEachGroupDetail(true);
            setDivToDisplay(groupId);
            setPrevDivToDisplay(groupId);
        }
    }

    const handleJoinClickedGroup = (group_id) => {
        const groupId = parseInt(group_id);
        let groupIndex;
        const arrayToCheck = groups[year][monthObj[month] - 1][month];
        groupIndex = arrayToCheck.findIndex((element) => parseInt(element.id) === groupId) + 1;
        console.log(groupIndex);              
        allGroups[groupIndex - 1][`group${groupId}`]["usersId"].push(parseInt(id));
        allGroups[groupIndex - 1][`group${groupId}`]["length"] = (allGroups[groupIndex - 1][`group${groupId}`]["usersId"]).length
        const newgroups = { ...groups };
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
        <>
            <div className='allgroup-main-title'>
                <p>All Groups</p>
            </div>
            {isAllGroupGotten && isLoggedUserGotten ? (
                <div className='allgroup-container'>
                    {allGroups.map((eachGroup) => (
                        <div key={eachGroup.id} className='allgroup-items-fixed'>
                            <div className='allgroup-button-details'>
                                <div
                                    style={showEachGroupDetail && eachGroup.id ===  divToDisplay?
                                        {
                                            background: '#609257',
                                            color: '#fff'
                                        } : {}}
                                    className='allgroup-button'
                                    type='button'
                                    id={eachGroup.id}
                                    onClick={(e) => handleShowEachGroupDetail(e.currentTarget.id)}
                                >
                                    {`Group ${eachGroup.id}`}
                                </div>
                            </div>
                            {showEachGroupDetail && (divToDisplay === eachGroup.id) ? (
                                <div className='group-project-details'>
                                    <div className='group-project-name'>
                                        <p>Project Name:</p>
                                        <div className='group-project-title'>{eachGroup[`group${eachGroup.id}`]["Project Name"]}</div>
                                    </div>
                                    <div className='group-project-description'>
                                        <p>Project Description:</p>
                                        <div className='group-project-description-text'>{eachGroup[`group${eachGroup.id}`]["Project Description"]}</div>
                                    </div>
                                    <div className='group-members-number'>
                                        <div>{eachGroup[`group${eachGroup.id}`]["length"]}</div>
                                        <p>{eachGroup[`group${eachGroup.id}`]["length"] === 1 ? 'Member' : 'Members'}</p>
                                    </div>
                                    <div className='group-members-names'>
                                        {(users.filter((user) => user.group === `${eachGroup.id}` && user.month === month && user.year === year)).map((user) => (
                                            <div key={user.id} className='group-members-names-div'>
                                                <p className='group-members-fullname'>{(user.first_name).toLowerCase()} {(user.last_name).toLowerCase()}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className='allgroup-btn'>
                                        {!((loggedUser.group !== eachGroup.id) && (loggedUser.group !== "")) ? !(loggedUser.group === eachGroup.id) ? (
                                            <button
                                                className='allgroup-submit-btn'
                                                type='button'
                                                name={eachGroup.id}
                                                onClick={(e) => handleJoinClickedGroup(e.currentTarget.name)}
                                            >
                                                {`Join Group ${eachGroup.id}`}
                                            </button>
                                        ) : (
                                            <div className='group-notification'>
                                                <p>This is your Group 😁</p>
                                            </div>
                                        ) : (
                                            <div className='group-notification'>
                                                <p>This not your Group 😿</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    ))}
                </div >
            ) : null
            }
        </>
    );
}
