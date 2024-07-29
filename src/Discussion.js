import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import GeneralHomeHeader from './GeneralHomeHeader';
import userAxios from './apis/userApi';

export default function Discussion({ users }) {
    const [userGroupComments, setUserGroupComments] = useState([]);
    const [commentExist, setCommentExist] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    // this group is the group number and the members is the members count
    const { id, year, month, group, members, project_name } = useParams();
    console.log(project_name);

    useEffect(() => {
        if (!group) {
            return;
        }

        const intervalId = setInterval(() => {
            const fetchComments = async () => {
                try {
                    let groupComments = await userAxios.get(`/comments?year=${year}&month=${month}&group=${group}`);
                    groupComments = groupComments.data;
                    if (groupComments.length > 0) {
                        // sort the groupComments inplace
                        groupComments.sort((a, b) => {
                            // do the a parameter
                            const [a_date, a_time] = a.dateObject.split(",")
                            const [a_day, a_month, a_year] = a_date.split("/");
                            const [a_hour, a_min, a_sec] = a_time.trim().split(":");
                            const a_date_obj = new Date(
                                parseInt(a_year),
                                parseInt(a_month) - 1,
                                parseInt(a_day),
                                parseInt(a_hour),
                                parseInt(a_min),
                                parseInt(a_sec),
                            )
                            const [b_date, b_time] = b.dateObject.split(",")
                            const [b_day, b_month, b_year] = b_date.split("/");
                            const [b_hour, b_min, b_sec] = b_time.trim().split(":");
                            const b_date_obj = new Date(
                                parseInt(b_year),
                                parseInt(b_month) - 1,
                                parseInt(b_day),
                                parseInt(b_hour),
                                parseInt(b_min),
                                parseInt(b_sec),
                            )
                            // do the b paramter

                            if (a_date_obj > b_date_obj) {
                                return 1;
                            }
                            else if (a_date_obj < b_date_obj) {
                                return -1;
                            }
                            else {
                                return 0;
                            }
                        })
                        setUserGroupComments(groupComments);
                        setCommentExist(true);
                    } else {
                        setUserGroupComments([]);
                        setCommentExist(false);
                    }
                } catch (error) {
                    console.error("Fetch Unsuccessful!!!", {
                        message: error.message,
                        response: error.response ? error.response.data : null,
                        config: error.config
                    });
                }
            }
            fetchComments();
        }, 1000)

        return () => {
            clearInterval(intervalId);
        }

    }, [group, year, month]);

    const handleSendMessage = (e) => {
        e.preventDefault();

        let newId = userGroupComments.length ? userGroupComments.reduce((accumulator, currentValue) => typeof accumulator === "number" ? parseInt(accumulator) > parseInt(currentValue.id) ? parseInt(accumulator) : parseInt(currentValue.id) : parseInt(accumulator.id) > parseInt(currentValue.id) ? parseInt(accumulator.id) : parseInt(currentValue.id), 0) : 0;
        newId = parseInt(newId) + 1;
        console.log(newId);

        const date_created = new Date();
        const formatDate = (date) => {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
            const year = date.getFullYear();
            const hours = String(date.getHours()).padStart(2, '0'); // 24-hour format
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
        
            return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
        };
        
        const dateObject = formatDate(date_created);
        const new_message = {
            id: `${newId}`,
            userId: id,
            text: newMessage,
            dateObject,
            intakeYear: year,
            intakeMonth: month,
            group: group,
        }

        // create all new comment and then sort it again
        let allNewComments = [...userGroupComments, new_message];
        allNewComments.sort((a, b) => {
            // do the a parameter
            const [a_date, a_time] = a.dateObject.split(",")
            const [a_day, a_month, a_year] = a_date.split("/");
            const [a_hour, a_min, a_sec] = a_time.trim().split(":");
            const a_date_obj = new Date(
                parseInt(a_year),
                parseInt(a_month) - 1,
                parseInt(a_day),
                parseInt(a_hour),
                parseInt(a_min),
                parseInt(a_sec),
            )
            const [b_date, b_time] = b.dateObject.split(",")
            const [b_day, b_month, b_year] = b_date.split("/");
            const [b_hour, b_min, b_sec] = b_time.trim().split(":");
            const b_date_obj = new Date(
                parseInt(b_year),
                parseInt(b_month) - 1,
                parseInt(b_day),
                parseInt(b_hour),
                parseInt(b_min),
                parseInt(b_sec),
            )
            // do the b paramter

            if (a_date_obj > b_date_obj) {
                return 1;
            }
            else if (a_date_obj < b_date_obj) {
                return -1;
            }
            else {
                return 0;
            }
        })

        const postNewComment = async (comment_data) => {
            try {
                const data = await userAxios.post(`/comments/`, comment_data);
                console.log(data);
            } catch (error) {
                console.error("post unsuccessful 🥲");
            }
        }

        postNewComment(new_message);
        setUserGroupComments(allNewComments);
        setCommentExist(true);
        setNewMessage("");
    }

    return (
        <div>
            <GeneralHomeHeader
                id={id}
                year={year}
                month={month}
                users={users}
                members={members ? members : ""}
                project_name={project_name ? project_name : ""}
            />
            {group ? (
                <div>
                    {commentExist ? (
                        <div>
                            <div>
                                <div>{month} {year}</div>
                                <div>Group {group}</div>
                                <div>{project_name}</div>
                                <div>members {members}</div>
                            </div>
                            <div>
                                {userGroupComments.map((comment, index, arr) => (
                                    <div key={comment.id}>
                                        {id === comment.userId ? arr.length - 1 === index ? (
                                            <div className='right' aria-live='assertive'>
                                                <div>
                                                    <div>
                                                        <span>{(users.find((user) => user.id === comment.userId)).first_name}</span>
                                                        <span>{(users.find((user) => user.id === comment.userId)).last_name}</span>
                                                    </div>
                                                    <div>
                                                        <span>{comment.dateObject}{parseInt(comment.dateObject.split(",")[1].trim().split(":")[0]) > 0 ? parseInt(comment.dateObject.split(",")[1].trim().split(":")[0]) < 12 ? "AM" : "PM" : "AM"}</span>
                                                        <span>📤</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    {comment.text}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className='right'>
                                                <div>
                                                    <div>
                                                        <span>{(users.find((user) => user.id === comment.userId)).first_name}</span>
                                                        <span>{(users.find((user) => user.id === comment.userId)).last_name}</span>
                                                    </div>
                                                    <div>
                                                        <span>{comment.dateObject}{parseInt(comment.dateObject.split(",")[1].trim().split(":")[0]) > 0 ? parseInt(comment.dateObject.split(",")[1].trim().split(":")[0]) < 12 ? "AM" : "PM" : "AM"}</span>
                                                        <span>📤</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    {comment.text}
                                                </div>
                                            </div>
                                        ) : arr.length - 1 === index ? (
                                            <div className='left' aria-live='assertive'>
                                                <div>
                                                    <div>
                                                        <span>{(users.find((user) => user.id === comment.userId)).first_name}</span>
                                                        <span>{(users.find((user) => user.id === comment.userId)).last_name}</span>
                                                    </div>
                                                    <div>
                                                        <span>{comment.dateObject}{parseInt(comment.dateObject.split(",")[1].trim().split(":")[0]) > 0 ? parseInt(comment.dateObject.split(",")[1].trim().split(":")[0]) < 12 ? "AM" : "PM" : "AM"}</span>
                                                        <span>📥</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    {comment.text}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className='left'>
                                                <div>
                                                    <div>
                                                        <span>{(users.find((user) => user.id === comment.userId)).first_name}</span>
                                                        <span>{(users.find((user) => user.id === comment.userId)).last_name}</span>
                                                    </div>
                                                    <div>
                                                        <span>{comment.dateObject}{parseInt(comment.dateObject.split(",")[1].trim().split(":")[0]) > 0 ? parseInt(comment.dateObject.split(",")[1].trim().split(":")[0]) < 12 ? "AM" : "PM" : "AM"}</span>
                                                        <span>📥</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    {comment.text}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div>
                            No comment yet, start new discussion 📤
                        </div>
                    )}
                    <div>
                        <form onSubmit={handleSendMessage}>
                            <label htmlFor="comments"></label>
                            <textarea
                                id="comments"
                                value={newMessage}
                                onChange={(e) => { setNewMessage(e.currentTarget.value) }}
                                required
                            >
                            </textarea>
                            <button
                                type='submit'
                            >
                                make message
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                <div>
                    User doesn't belong to any group, no comments
                </div>
            )}
        </div>
    )
}
