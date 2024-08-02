import { useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import GeneralHomeHeader from './GeneralHomeHeader';
import './styles/Disscussion.css';
import userAxios from './apis/userApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

export default function Discussion({ users, appDropDown, handleAppDropDown, showDropDown, handleShowDropDown }) {
    const [userGroupComments, setUserGroupComments] = useState([]);
    const [commentExist, setCommentExist] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [prevLength, setPrevLength] = useState(0);
    const [animation, setAnimation] = useState(false);
    const [animationToUse, setAnimationToUse] = useState("fixed");
    const [lastScroll, setLastScroll] = useState(null);
    const textareaRef = useRef(null);
    const lastDiv = useRef(null);

    // this group is the group number and the members is the members count
    const { id, year, month, group, members, project_name } = useParams();
    const title = "Discussions";

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
                        setCommentExist(true)
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
    }, [group, year, month, prevLength]);

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

    const handleInputChange = (event) => {
        setNewMessage(event.currentTarget.value);
        autoResizeTextarea();
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            if (newMessage === "") {
                return
            }
            handleSendMessage(event);
            // Handle send message
            setNewMessage('');
        }
    };

    const autoResizeTextarea = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    };

    useEffect(() => {
        if (lastDiv.current) {
            if (userGroupComments.length > prevLength) {
                lastDiv.current.scrollIntoView({ behavior: "smooth" });
                setPrevLength(userGroupComments.length);
            } else {
                //do nothing
            }
        }
    }, [userGroupComments,prevLength]);

    const handleScrollAction = (e) => {
        const percentage = 90;
        const discussionSectionHeight = e.currentTarget.clientHeight;
        const discussionSectionScrollTop = e.currentTarget.scrollTop;
        const checkHeight = ((percentage / 100) * (parseInt(discussionSectionHeight)));
        console.log(discussionSectionHeight);
        console.log(checkHeight);
        console.log(animationToUse);
        if (checkHeight >= discussionSectionScrollTop) {
            setAnimation(true);
            setAnimationToUse("slidein");
            setLastScroll(discussionSectionScrollTop);
        } else {
            if (!lastScroll) {
                setAnimationToUse("fixed");
            } else {
                setAnimation(true);
                setAnimationToUse("slideout");
            }
        }
    }

    return (
        <main>
            <section>
                <div className='fixed-homepage-header'>
                    <GeneralHomeHeader
                        id={id}
                        title={title}
                        year={year}
                        month={month}
                        users={users}
                        members={members ? members : ""}
                        project_name={project_name ? project_name : ""}
                        appDropDown={appDropDown}
                        showDropDown={showDropDown}
                        handleShowDropDown={handleShowDropDown}
                    />
                </div>
                {group ? (
                    <div className='discussion-groups-container' onClick={handleAppDropDown}>
                        {commentExist ? (
                            <div className='discussion-section'>
                                <div className='discussion-group-title'>
                                    <div className='discussion-project-name'>{project_name}</div>
                                    <div className='discussion-project-details'>
                                        <div>{month} {year}</div>
                                        <FontAwesomeIcon icon={faCircle} className='fa-project-circle' />
                                        <div>Group {group}</div>
                                        <FontAwesomeIcon icon={faCircle} className='fa-project-circle' />
                                        <div>{members} members</div>
                                    </div>
                                    <div className='discussion-project-chat'>Chat</div>
                                </div>
                                <div className='discussion-comment-section' onScroll={handleScrollAction}>
                                    {userGroupComments?.map((comment, index, arr) => (
                                        <div key={comment.id} className='comment-main-box'>
                                            {id === comment.userId ? arr.length - 1 === index ? (
                                                <div className='comment-right'>
                                                    <div className='comment-flex-right'>
                                                        <div className='comment-right-top'>
                                                            <div className='comment-top-names'>
                                                                <span>{((users.find((user) => user.id === comment.userId)).first_name).toLowerCase()}</span>
                                                                <span>{((users.find((user) => user.id === comment.userId)).last_name).toLowerCase()}</span>
                                                            </div>
                                                            <div className='comment-top-date'>
                                                                <span>{comment.dateObject}{parseInt(comment.dateObject.split(",")[1].trim().split(":")[0]) > 0 ? parseInt(comment.dateObject.split(",")[1].trim().split(":")[0]) < 12 ? "AM" : "PM" : "AM"}</span>
                                                            </div>
                                                        </div>
                                                        <div className='comment-right-text' ref={lastDiv}>
                                                            {comment.text}
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className='comment-right'>
                                                    <div className='comment-flex-right'>
                                                        <div className='comment-right-top'>
                                                            <div className='comment-top-names'>
                                                                <span>{((users.find((user) => user.id === comment.userId)).first_name).toLowerCase()}</span>
                                                                <span>{((users.find((user) => user.id === comment.userId)).last_name).toLowerCase()}</span>
                                                            </div>
                                                            <div className='comment-top-date'>
                                                                <span>{comment.dateObject}{parseInt(comment.dateObject.split(",")[1].trim().split(":")[0]) > 0 ? parseInt(comment.dateObject.split(",")[1].trim().split(":")[0]) < 12 ? "AM" : "PM" : "AM"}</span>
                                                            </div>
                                                        </div>
                                                        <div className='comment-right-text'>
                                                            {comment.text}
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : arr.length - 1 === index ? (
                                                <div className='comment-left'>
                                                    <div className='comment-flex-left'>
                                                        <div className='comment-left-top'>
                                                            <div className='comment-top-names'>
                                                                <span>{((users.find((user) => user.id === comment.userId)).first_name).toLowerCase()}</span>
                                                                <span>{((users.find((user) => user.id === comment.userId)).last_name).toLowerCase()}</span>
                                                            </div>
                                                            <div className='comment-top-date'>
                                                                <span>{comment.dateObject}{parseInt(comment.dateObject.split(",")[1].trim().split(":")[0]) > 0 ? parseInt(comment.dateObject.split(",")[1].trim().split(":")[0]) < 12 ? "AM" : "PM" : "AM"}</span>
                                                            </div>
                                                        </div>
                                                        <div className='comment-left-text' ref={lastDiv}>
                                                            {comment.text}
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className='comment-left'>
                                                    <div className='comment-flex-left'>
                                                        <div className='comment-left-top'>
                                                            <div className='comment-top-names'>
                                                                <span>{((users.find((user) => user.id === comment.userId)).first_name).toLowerCase()}</span>
                                                                <span>{((users.find((user) => user.id === comment.userId)).last_name).toLowerCase()}</span>
                                                            </div>
                                                            <div className='comment-top-date'>
                                                                <span>{comment.dateObject}{parseInt(comment.dateObject.split(",")[1].trim().split(":")[0]) > 0 ? parseInt(comment.dateObject.split(",")[1].trim().split(":")[0]) < 12 ? "AM" : "PM" : "AM"}</span>
                                                            </div>
                                                        </div>
                                                        <div className='comment-left-text'>
                                                            {comment.text}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    <div className={animation ? animationToUse : animationToUse} onClick={() => {lastDiv.current.scrollIntoView({behavior: 'smooth'})}}>
                                        <p>Jump to bottom</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className='discussion-no-comment-section'>
                                No comment yet. Start new discussion 📤
                            </div>
                        )}
                        <div className='discussion-message-box chat-input-container'>
                            <form onSubmit={handleSendMessage} className='discussion-message-form'>
                                <label htmlFor="comments"></label>
                                <textarea
                                    id="comments"
                                    className="chat-textarea"
                                    value={newMessage}
                                    onChange={handleInputChange}
                                    ref={textareaRef}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Type your message..."
                                    rows="1"
                                    required
                                >
                                </textarea>
                                <button
                                    className='discussion-message-btn send-button'
                                    type='submit'
                                >
                                    <FontAwesomeIcon icon={faPaperPlane} className='send-button-icon' />
                                </button>
                            </form>
                        </div>
                    </div>
                ) : (
                    <div className='discussion-no-comment-section'>
                        User doesn't belong to any group. No comments found.
                    </div>
                )}
            </section>
        </main>
    )
}
