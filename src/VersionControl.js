import { useParams } from 'react-router-dom';
import GeneralHomeHeader from './GeneralHomeHeader';
import React, { useState, useEffect } from 'react';
import TextEditor from './TextEditor';
import VersionHistory from './VersionHistory';
import userAxios from './apis/userApi';

function VersionControl({ users, appDropDown, showDropDown, handleShowDropDown }) {
    const { id, year, month, group, members, project_name } = useParams();
    const [versions, setVersions] = useState([]);
    const [persona, setPersona] = useState({});
    const [comment, setComment] = useState('');
    const [editorContent, setEditorContent] = useState('');
    const [historyOpen, setHistoryOpen] = useState(false);
    const title = "Version Control";

    useEffect(() => {
        // Fetch version history from the server
        userAxios.get(`/versions`, {
            params: {
                groupId: group,
                projectName: project_name
            }
        }).then(response => {
            setVersions(response.data);
        }).catch(error => {
            console.error('Error fetching versions:', error);
        });

        const getUser = users.find((user) => user.id === id);
        setPersona(getUser || {});

    }, [group, project_name, users, id]);

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
            "comment": newComment
        }).then((response) => {
            // Update local state with new version
            setVersions((prevVersions) => [...prevVersions, response.data]);
            setComment(''); // Clear the comment field
            setEditorContent(content); // Optionally set editor content for later use
        });
    };

    const handleRevert = (version) => {
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
                <div style={{ paddingLeft: '50px', marginTop: '100px' }}>
                    <div style={{ fontSize: '24px', fontWeight: '500', marginBottom: '16px', textAlign: "center" }}>{`Group ${group}: ${project_name}`}</div>
                    <div style={{ maxWidth: '850px', margin: '0 auto', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', padding: '16px' }}>
                        <TextEditor
                            onSave={handleSave}
                            comment={comment}
                            onCommentChange={setComment}
                            content={editorContent}
                            handleClose={toggleHistoryModal}
                        />
                    </div>
                    <VersionHistory
                        open={historyOpen}
                        handleClose={toggleHistoryModal}
                        versions={versions}
                        handleRevert={handleRevert}
                    />
                </div>
            </section>
        </main>
    );
};

export default VersionControl;
