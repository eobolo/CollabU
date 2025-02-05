import { useParams, useNavigate } from 'react-router-dom';
import GeneralHomeHeader from '../home/GeneralHomeHeader';
import '../styles/FileSharing.css';
import PlayOnce from '../imports/PlayOnce';
import { useEffect } from 'react';
import userAxios from '../apis/userApi';


export default function FileSharing({ users, appDropDown, handleAppDropDown, showDropDown, handleShowDropDown, versionFiles, saveFileVersion }) {
    const { id, year, month, group, members, project_name } = useParams();
    const title = "File Sharing";
    const sliceLength = 10;
    const navigate = useNavigate();

    const handleDoubleClick = (file) => {
        navigate(`/versioncontrol/${file.year}/${file.month}/${file.groupId}/${members || ''}/${file.projectName}/${file.id}`);
    };

    useEffect(() => {
        // Fetch shared files from the server
        userAxios.get(`/files`, {
            params: {
                group: group,
                projectName: project_name,
                year: year,
                month: month,
            }
        }).then(response => {
            saveFileVersion(response.data);
        }).catch(error => {
            console.error('Error fetching shared file:', error);
        });

    }, [group, project_name, year, month, saveFileVersion]);

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
                        members={members || ""}
                        project_name={project_name || ""}
                        appDropDown={appDropDown}
                        showDropDown={showDropDown}
                        handleShowDropDown={handleShowDropDown}
                    />
                </div>

                {group ? (
                    <div className='filesharing-container' onClick={handleAppDropDown}>
                        {versionFiles && versionFiles.length > 0 ? (
                            <div className='fileshared-section'>
                                {versionFiles.map((file) => {
                                    const user = users.find((u) => u.id === file.userId);
                                    return (
                                        <div key={file.id} onDoubleClick={() => handleDoubleClick(file)} className='file-item'>
                                            <div className='comment-top-names'>
                                                <span>{user.first_name.toLowerCase()}</span>
                                                <span>{user.last_name.toLowerCase()}</span>
                                            </div>
                                            <div className='fileshared-icon'>
                                                <PlayOnce />
                                            </div>
                                            <div className='fileshared-name'>
                                                <p>{file.projectName.length > sliceLength ? `${file.projectName.slice(0, sliceLength)}...` : file.projectName}</p>
                                            </div>
                                            <div className='fileshared-meta'>
                                                <small>Shared on: {new Date(file.timeStamp).toLocaleString()}</small>
                                            </div>
                                        </div>
                                    );
                                })}
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
    );
}
