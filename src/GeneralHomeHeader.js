import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';


export default function GeneralHomeHeader({ month, year, id, users, members, project_name }) {
    const [showDropDown, setShowDropDown] = useState(false);
    const [isUserGotten, setIsUserGotten] = useState(false);
    const [triedFetch, setTriedFetch] = useState(false);
    const [foundUser, setFoundUser] = useState({});

    useEffect(() => {
        const getUser = users.find((user) => user.id === id);
        if (getUser) {
            setIsUserGotten(true);
            setTriedFetch(true);
            setFoundUser(getUser);
        } else {
            setIsUserGotten(false);
            setTriedFetch(true);
            setFoundUser({});
        }
    }, [users, id])

    const handleShowDropDown = () => {
        if (showDropDown) {
            setShowDropDown(false);
        } else {
            setShowDropDown(true);
        }
    }

    return (
        <div>
            {triedFetch ? isUserGotten ? (
                <div>
                    <div>
                        home and logo
                    </div>
                    <div>
                        <button
                            type="button"
                            onClick={handleShowDropDown}
                        >
                            ...
                        </button>
                    </div>
                    {showDropDown ? (
                        <div>
                            <ul>
                                <li><Link to={`/discussions/${id}/${year}/${month}/${foundUser.group}/${members}/${project_name}`}>discussions</Link></li>
                                <li><Link to={`/filesharing/${id}/${year}/${month}/${foundUser.group}/${members}/${project_name}`}>filesharing</Link></li>
                                <li><Link to={`/home/${id}/${year}/${month}`}>Homepage</Link></li>
                            </ul>
                        </div>
                    ) : null}
                </div>
            ) : (
                <div>
                    user not found ...
                </div>
            ) : (
                <div>
                    Fetching data ...
                </div>
            )}
        </div>
    )
}
