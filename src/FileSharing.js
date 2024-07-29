import { useParams } from 'react-router-dom';
import GeneralHomeHeader from './GeneralHomeHeader';
import { useState, useEffect } from 'react';
import userAxios from './apis/userApi';

export default function FileSharing({ users }) {
    const { id, year, month, group, members, project_name } = useParams();

    const [userGroupFiles, setUserGroupFiles] = useState([]);
    const [filesExist, setFilesExist] = useState(false);
    const [showAddFile, setShowAddFile] = useState(false);
    const [fileName, setFileName] = useState("");
    const [fileLink, setFileLink] = useState("");

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
        console.log(newId);

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
                console.log(data);
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
        <div>
            <GeneralHomeHeader
                id={id}
                year={year}
                month={month}
                users={users}
                member={members ? members : ""}
                project_name={project_name ? project_name : ""}
            />
            {group ? (
                <div>
                    <div>
                        <div>
                            <button
                                type='button'
                                onClick={handleShowAddFile}
                            >
                                Click to Add File
                            </button>
                        </div>
                        {showAddFile ? (
                            <div>
                                <form onSubmit={handleFileSharing}>
                                    <div>
                                        <label htmlFor="file-name">File Name:</label>
                                        <input
                                            type="text"
                                            id="file-name"
                                            value={fileName}
                                            onChange={(e) => { setFileName(e.currentTarget.value) }}
                                            required
                                        />
                                    </div>
                                    <div>
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
                                    <div>
                                        <button
                                            type='submit'
                                        >
                                            Add File
                                        </button>
                                    </div>
                                </form>
                            </div>
                        ) : null}
                    </div>
                    {filesExist ? (
                        <div>
                            {userGroupFiles.map((fileshared) => (
                                <div key={fileshared.id}>
                                    <div>
                                        <span>{(users.find((user) => user.id === fileshared.userId)).first_name}</span>
                                        <span>{(users.find((user) => user.id === fileshared.userId)).last_name}</span>
                                    </div>
                                    <div>
                                        <a href={fileshared.url}>📂</a>
                                    </div>
                                    <div>
                                        <p>{(fileshared.filename).length > sliceLength ? `${(fileshared.filename).slice(0, sliceLength)}...`: fileshared.filename}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div>
                            No files shared yet, share file 📂
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    User doesn't belong to any group, no files available
                </div>
            )}
        </div>
    )
}
