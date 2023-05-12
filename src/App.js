/* global chrome */
import React, { useEffect, useState } from 'react';
import './App.css';
import { Box, Typography, List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';


function App() {
  const [prompts, setPrompts] = useState([]);

  useEffect(() => {
    chrome.storage.sync.get(null, function(items) {
      console.log('Stored items:', items); // Check what is retrieved from storage
      const promptsArray = Object.entries(items).map(([key, value]) => ({ key, ...value }));
      console.log('Prompts array:', promptsArray); // Check the transformed prompts array
      setPrompts(promptsArray);
    });
  }, []);

  const toggleEdit = (key) => {
    chrome.storage.sync.get(key, function(result) {
      let newPrompt = result[key];
      newPrompt.editing = !newPrompt.editing;
      chrome.storage.sync.set({ [key]: newPrompt }, function() {
        setPrompts(prevPrompts => prevPrompts.map(prompt => prompt.key === key ? { key, ...newPrompt } : prompt));
      });
    });
  }
  
  const handlePromptChange = (key, newText) => {
    chrome.storage.sync.get(key, function(result) {
      let newPrompt = result[key];
      newPrompt.text = newText;
      chrome.storage.sync.set({ [key]: newPrompt }, function() {
        setPrompts(prevPrompts => prevPrompts.map(prompt => prompt.key === key ? { key, ...newPrompt } : prompt));
      });
    });
  }
  

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        console.log(`Copied: ${text}`);
        // Increase the count and update the storage
        chrome.storage.sync.get(key, function(result) {
          let newPrompt = result[key];
          newPrompt.count++;
          newPrompt.copied = true; // Set copied to true
          chrome.storage.sync.set({ [key]: newPrompt }, function() {
            // Update the local state
            setPrompts(prevPrompts => prevPrompts.map(prompt => prompt.key === key ? { key, ...newPrompt } : prompt));
            // Set copied back to false after 1 second
            setTimeout(() => {
              newPrompt.copied = false;
              chrome.storage.sync.set({ [key]: newPrompt }, function() {
                setPrompts(prevPrompts => prevPrompts.map(prompt => prompt.key === key ? { key, ...newPrompt } : prompt));
              });
            }, 500);
          });
        });
      })
      .catch(err => {
        console.error('Could not copy text: ', err);
      });
  }

  const deletePrompt = (key) => {
    chrome.storage.sync.remove(key, function() {
      console.log(`Deleted: ${key}`);
      // Update the local state
      setPrompts(prevPrompts => prevPrompts.filter(prompt => prompt.key !== key));
    });
  }

  // Sort the prompts by usage count
  prompts.sort((a, b) => b.count - a.count);

  return (
    <div className="App">
      <Box p={2}>
        <Typography variant="h6" component="div">My Prompts</Typography>
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={(event) => {}}
        >
          <DeleteIcon />
        </IconButton>
        <List>
          {prompts.map(({ text, key, copied, editing }) => (
            <ListItem key={key} disableGutters>
              <Box
                className="prompt-container"
                // onClick={() => copyToClipboard(text, key)}
              >
                {copied && (
                  <Box className="copied-notification">
                    Copied!
                  </Box>
                )}
                {editing ? (
                  <input 
                    value={text} 
                    onChange={(event) => handlePromptChange(key, event.target.value)} 
                    onBlur={() => toggleEdit(key)}
                    className="edit-prompt"
                  />
                ) : (
                  <ListItemText
                    primary={text}
                    onClick={() => copyToClipboard(text, key)}
                  />
                )}
                <IconButton
                  edge="end"
                  aria-label="edit"
                  className="edit-button"
                  onClick={(event) => {
                    event.stopPropagation();
                    toggleEdit(key);
                  }}
                >
                  <EditIcon />
                </IconButton>
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>
    </div>
  );  
}

export default App;
