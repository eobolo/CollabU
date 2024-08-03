import { useParams } from 'react-router-dom';
import GeneralHomeHeader from './GeneralHomeHeader';
import { useState, useEffect } from 'react';
import './styles/FileSharing.css';
import PlayOnce from './PlayOnce';
import userAxios from './apis/userApi';

export default function FileSharing({ users, appDropDown, handleAppDropDown, showDropDown, handleShowDropDown }) {
    const { id, year, month, group, members, project_name } = useParams();

    const [userGroupFiles, setUserGroupFiles] = useState([]);
    const [filesExist, setFilesExist] = useState(false);
    const [showAddFile, setShowAddFile] = useState(false);
    const [fileName, setFileName] = useState("");
    const [fileLink, setFileLink] = useState("");
    const title = "File Sharing";

    const sliceLength = 10;

    useEffect(() => {
        if (!group) {
            return;
        }
        const intervalId = setInterval(() => {
            const fetchFiles = async () => {
                try {
                    const groupFiles = await userAxios.get(`/files?year=${year}&month=${month}&group=${group}`);
                    const fileDatas = groupFiles.data;
                    if (fileDatas.length > 0) {
                        setUserGroupFiles(fileDatas);
                        setFilesExist(true);
                    } else {
                        setUserGroupFiles([]);
                        setFilesExist(false);
                    }
                } catch (error) {
                    console.error("Fetch Unsuccessful!!!", {
                        message: error.message,
                        response: error.response ? error.response.data : null,
                        config: error.config
                    });
                }
            }
            fetchFiles();
        }, 1000);

        // Cleanup function to clear the interval
        return () => {
            clearInterval(intervalId);
        };
    }, [group, year, month]);


    const handleShowAddFile = () => {
        if (showAddFile) {
            setShowAddFile(false);
        } else {
            setShowAddFile(true);
        }
    }

    const handleFileSharing = (e) => {
        e.preventDefault();

        let newId = userGroupFiles.length ? userGroupFiles.reduce((accumulator, currentValue) => typeof accumulator === "number" ? parseInt(accumulator) > parseInt(currentValue.id) ? parseInt(accumulator) : parseInt(currentValue.id) : parseInt(accumulator.id) > parseInt(currentValue.id) ? parseInt(accumulator.id) : parseInt(currentValue.id), 0) : 0;
        newId = parseInt(newId) + 1;
        const new_file = {
            id: `${newId}`,
            userId: id,
            filename: fileName,
            url: fileLink,
            intakeYear: year,
            intakeMonth: month,
            group,
        }

        const allNewSharedFiles = [...userGroupFiles, new_file];

        const postNewsharedFile = async (file_data) => {
            try {
                const data = await userAxios.post(`/files/`, file_data);
            } catch (error) {
                console.error("post unsuccessful 🥲");
            }
        }

        postNewsharedFile(new_file);
        setUserGroupFiles(allNewSharedFiles);
        setFileLink("");
        setFileName("");
        setFilesExist(true);
        setShowAddFile(false);
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
                    <div className={`filesharing-container ${data ? "" : null}`} onClick={handleAppDropDown}>
                        <div className="files-dropdown">
                            <div className="select" onClick={handleShowAddFile}>
                                <span type="button" className="selected">Click to Add File</span>
                                <div className={`file-caret ${showAddFile ? 'file-caret-rotate' : null}`}></div>
                            </div>
                            {showAddFile ? (
                                <div className='files-menu'>
                                    <div className='files-forms-div'>
                                        <form onSubmit={handleFileSharing}>
                                            <div className='files-form-group'>
                                                <label htmlFor="file-name">File Name:</label>
                                                <input
                                                    type="text"
                                                    id="file-name"
                                                    value={fileName}
                                                    onChange={(e) => { setFileName(e.currentTarget.value) }}
                                                    required
                                                />
                                            </div>
                                            <div className='files-form-group'>
                                                <label htmlFor="file-link">File Link:</label>
                                                <input
                                                    type="url"
                                                    id="file-link"
                                                    value={fileLink}
                                                    onChange={(e) => { setFileLink(e.currentTarget.value) }}
                                                    placeholder="https://example.com"
                                                    pattern="https://.*"
                                                    required
                                                />
                                            </div>
                                            <div className='files-btn'>
                                                <button
                                                    className='files-submit-btn'
                                                    type='submit'
                                                >
                                                    Add File
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            ) : null}
                        </div>

                        {filesExist ? (
                            <div className='fileshared-section'>
                                {userGroupFiles.map((fileshared) => (
                                    <div key={fileshared.id}>
                                        <div className='comment-top-names'>
                                            <span>{(users.find(((user) => user.id === fileshared.userId)).first_name).toLowerCase()}</span>
                                            <span>{((users.find((user) => user.id === fileshared.userId)).last_name).toLowerCase()}</span>
                                        </div>
                                        <div className='fileshared-icon'>
                                            <a href={fileshared.url} target='_blank' rel="noreferrer"><PlayOnce /></a>
                                        </div>
                                        <div className='fileshared-name'>
                                            <p>{(fileshared.filename).length > sliceLength ? `${(fileshared.filename).slice(0, sliceLength)}...` : fileshared.filename}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className='no-fileshared-section'>
                                No files shared yet. Share file 📂
                            </div>
                        )}
                    </div>
                ) : (
                    <div className='discussion-no-comment-section' onClick={handleAppDropDown}>
                        User doesn't belong to any group. No files available.
                    </div>
                )}
            </section>
        </main>
    )
}
