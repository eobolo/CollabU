import { useParams } from 'react-router-dom';
import GeneralHomeHeader from '../home/GeneralHomeHeader';
import React, { useState, useEffect } from 'react';
import TextEditor from './TextEditor';
import VersionHistory from './VersionHistory';
import userAxios from '../apis/userApi';
import '../styles/FileSharing.css';

function VersionControl({ users, appDropDown, showDropDown, handleShowDropDown, saveFileVersion, fileVersions, authUser, handleAppDropDown }) {
    const { year, month, group, members, project_name, file_id } = useParams();
    const [versions, setVersions] = useState([]);
    const [persona, setPersona] = useState({});
    const [comment, setComment] = useState('');
    const [editorContent, setEditorContent] = useState('');
    const [historyOpen, setHistoryOpen] = useState(false);
    const title = "Version Control";
    const id = authUser[0].id;


    useEffect(() => {
        // Fetch version history from the server
        userAxios.get(`/versions`, {
            params: {
                group: group,
                projectName: project_name,
                year: year,
                month: month,
            }
        }).then(response => {
            setVersions(response.data);
        }).catch(error => {
            console.error('Error fetching versions:', error);
        });

        const getUser = users.find((user) => user.id === id);
        setPersona(getUser || {});

    }, [group, project_name, users, id, year, month]);

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
            if (file_id) {
                const searchResult = response.data.find((version) => version.id === file_id);
                if (searchResult) {
                    setEditorContent(searchResult.content);
                    setComment(searchResult.comment);
                }
            }
            saveFileVersion(response.data);
        }).catch(error => {
            console.error('Error fetching shared file:', error);
        });

    }, [group, project_name, year, month, file_id, saveFileVersion]);


    const handleSave = (content, newComment) => {
        const timestamp = new Date().toISOString();
        // Save content with comment to the server
        userAxios.post(`/versions`, {
            "changesBy": `${persona.first_name} ${persona.last_name}`,
            "timeStamp": timestamp,
            "groupId": group,
            "projectName": project_name,
            "userId": id,
            "content": content,
            "comment": newComment,
            "year": year,
            "month": month,
        }).then((response) => {
            // Update local state with new version
            setVersions((prevVersions) => [...prevVersions, response.data]);
            setComment(''); // Clear the comment field
            setEditorContent(content); // Optionally set editor content for later use
        });
    };



    const handleRevert = (version) => {
        // prevent facilitator from reverting version
        if (persona.isTeacher) {
            return;
        }
        // Set editor to content of the selected version
        setEditorContent(version.content);
        setComment(version.comment);
        setHistoryOpen(false); // Close history modal after reverting
    };

    const toggleHistoryModal = () => {
        setHistoryOpen(prevState => !prevState);
    };

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
                {group ? (<div style={{ paddingLeft: '50px', marginTop: '100px' }} onClick={handleAppDropDown}>
                    <div style={{ fontSize: '24px', fontWeight: '500', marginBottom: '16px', textAlign: "center" }}>{`Group ${group}: ${project_name}`}</div>
                    <div style={{ maxWidth: '850px', margin: '0 auto', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', padding: '16px' }}>
                        <TextEditor
                            onSave={handleSave}
                            comment={comment}
                            onCommentChange={setComment}
                            content={editorContent}
                            handleClose={toggleHistoryModal}
                            persona={persona}
                        />
                    </div>
                    <VersionHistory
                        open={historyOpen}
                        handleClose={toggleHistoryModal}
                        versions={versions}
                        handleRevert={handleRevert}
                        saveFileVersion={saveFileVersion}
                        fileVersions={fileVersions}
                        persona={persona}
                    />
                </div>) : (
                    <div className='discussion-no-comment-section' onClick={handleAppDropDown}>
                        User doesn't belong to any group. Version control unavailable.
                    </div>
                )}
            </section>
        </main>
    );
};

export default VersionControl;
