/* global chrome */
import React, { useEffect, useState } from 'react';
import './App.css';
import { Box, Typography, List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';


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

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        console.log(`Copied: ${text}`);
        // Increase the count and update the storage
        chrome.storage.sync.get(key, function(result) {
          let newPrompt = result[key];
          newPrompt.count++;
          chrome.storage.sync.set({ [key]: newPrompt }, function() {
            // Update the local state
            setPrompts(prevPrompts => prevPrompts.map(prompt => prompt.key === key ? { key, ...newPrompt } : prompt));
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
        <List>
          {prompts.map(({ text, key }) => (
            <ListItem key={key} disableGutters>
              <Box
                className="prompt" 
                onClick={() => copyToClipboard(text, key)}
              >
                <ListItemText primary={text} />
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={(event) => {
                    event.stopPropagation();
                    deletePrompt(key);
                  }}
                >
                  <DeleteIcon />
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
