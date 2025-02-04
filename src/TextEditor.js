import React, { useState, useEffect } from 'react';
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { Button, Box, IconButton, Typography, Paper, TextField } from '@mui/material';
import { FormatBold, FormatItalic, FormatUnderlined, Undo, Redo, Save, History } from '@mui/icons-material';

const TextEditor = ({ onSave, comment, onCommentChange, content, handleClose, persona }) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [htmlPreview, setHtmlPreview] = useState('');

  useEffect(() => {
    if (content) {
      try {
        const contentState = (typeof content === 'string')
          ? ContentState.createFromText(content)  // For backward compatibility
          : convertFromRaw(content);
        setEditorState(EditorState.createWithContent(contentState));
      } catch (error) {
        console.error("Error converting content:", error);
      }
    }
  }, [content]);
  const handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  const toggleInlineStyle = (style) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };

  const handleUndo = () => setEditorState(EditorState.undo(editorState));
  const handleRedo = () => setEditorState(EditorState.redo(editorState));

  const handleSave = () => {
    // prevent facilitator from saving version
    if (persona.isTeacher) {
      return;
    }
    const rawContent = convertToRaw(editorState.getCurrentContent());
    const plainText = rawContent.blocks.map(block => block.text).join('\n');
    if (onSave) onSave(plainText, comment);
    setHtmlPreview(draftToHtml(rawContent));
  };

  return (
    <Box sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: "space-between", gap: 20, mb: 2 }}>
        <div>
          <IconButton onClick={() => toggleInlineStyle('BOLD')}><FormatBold /></IconButton>
          <IconButton onClick={() => toggleInlineStyle('ITALIC')}><FormatItalic /></IconButton>
          <IconButton onClick={() => toggleInlineStyle('UNDERLINE')}><FormatUnderlined /></IconButton>
          <IconButton onClick={handleUndo}><Undo /></IconButton>
          <IconButton onClick={handleRedo}><Redo /></IconButton>
        </div>
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={handleClose}
            startIcon={<History />}
            sx={{ marginLeft: 'auto', marginRight: "20px", backgroundColor: 'black', color: 'white', '&:hover': { backgroundColor: 'gray' } }}
          >
            View Version History
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            startIcon={<Save />}
            sx={{ marginLeft: 'auto', marginRight: "5px", backgroundColor: 'green', color: 'white', '&:hover': { backgroundColor: 'darkgreen' } }}
          >
            Save
          </Button>
        </div>
      </Box>

      <Paper
        variant="outlined"
        sx={{ p: 2, height: 300, overflow: 'auto' }}
        onClick={() => document.querySelector('.DraftEditor-root').focus()}
      >
        <Editor
          editorState={editorState}
          handleKeyCommand={handleKeyCommand}
          onChange={setEditorState}
          placeholder="Start typing here..."
        />
      </Paper>

      <TextField
        label="Add a comment"
        variant="outlined"
        fullWidth
        value={comment}
        onChange={(e) => onCommentChange(e.target.value)}
        sx={{ mt: 2 }}
      />

      {htmlPreview && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" fontWeight="bold">Live Preview:</Typography>
          <Paper variant="outlined" sx={{ p: 2, mt: 1 }} dangerouslySetInnerHTML={{ __html: htmlPreview }} />
        </Box>
      )}
    </Box>
  );
};

export default TextEditor;