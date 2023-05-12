/* global chrome */
import React, { useEffect, useState } from 'react';
import './App.css';
import { Box, Typography, List, ListItem, ListItemText, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import Header from './components/Header';
import Clear from '@mui/icons-material/Clear';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Tab, Tabs } from '@mui/material';
import samplePrompts from './components/samplePrompts';


function App() {
  const [prompts, setPrompts] = useState([]);
  const [deleteMode, setDeleteMode] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [currentTab, setCurrentTab] = useState(0);
  const [lastCopiedSamplePrompt, setLastCopiedSamplePrompt] = useState(null);


  useEffect(() => {
    chrome.storage.sync.get(null, function(items) {
      const promptsArray = Object.entries(items).map(([key, value]) => ({ key, ...value }));
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
  
  const handleClickFinish = (key, newText) => {
    chrome.storage.sync.get(key, function(result) {
      let newPrompt = result[key];
      newPrompt.text = newText;
      newPrompt.editing = false;
      chrome.storage.sync.set({ [key]: newPrompt }, function() {
        setPrompts(prevPrompts => prevPrompts.map(prompt => prompt.key === key ? { key, ...newPrompt } : prompt));
      });
    });
  }
  

  const copyToClipboard = (text, key) => {
   navigator.clipboard.writeText(text)
    .then(() => {
      console.log(`Copied: ${text}`);
      setLastCopiedSamplePrompt(text);
      setTimeout(() => {
        setLastCopiedSamplePrompt(null);
      }, 1000);
      // Increase the count and update the storage
      chrome.storage.sync.get(key, function(result) {
        let newPrompt = result[key];
        newPrompt.count++;
        newPrompt.copied = true; // Set copied to true
        chrome.storage.sync.set({ [key]: newPrompt }, function() {
          // Update the local state
          setPrompts(prevPrompts => prevPrompts.map(prompt => prompt.key === key ? { key, ...newPrompt } : prompt));
          // Set copied back to false after 0.5 second
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

  const copyToClipboardSample = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        console.log(`Copied sample: ${text}`);
        setLastCopiedSamplePrompt(text);
        setTimeout(() => {
          setLastCopiedSamplePrompt(null);
        }, 500);
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
      <Header setDeleteMode={setDeleteMode} /> 
      <Box sx={{ flexGrow: 1 }}>
        <Tabs
          value={currentTab}
          onChange={(event, newValue) => {
            setCurrentTab(newValue);
          }}
          centered
        >
          <Tab label="My Prompts" />
          <Tab label="Sample Prompts" />
        </Tabs>
      </Box>
      <Box p={2}>
        <List>
        {currentTab === 0 ? prompts.map(({ text, key, copied, editing }) => (
            <ListItem key={key} disableGutters>
              <Box className="prompt-container">
                {copied && (<Box className="copied-notification">Copied!</Box>)}
                {editing ? (
                  <input 
                    value={currentPrompt}
                    onChange={(event) => setCurrentPrompt(event.target.value)} 
                    className="edit-prompt"
                    onBlur={() => handleClickFinish(key, currentPrompt)}
                  />
                ) : (
                  <ListItemText
                    primary={text}
                    onClick={() => copyToClipboard(text, key)}
                  />
                )}
                <IconButton
                  edge="end"
                  aria-label={deleteMode ? "delete" : (editing ? "finish" : "edit")}
                  onClick={(event) => {
                    event.stopPropagation();
                    if (deleteMode) {
                      deletePrompt(key);
                    } else if (editing) {
                      handleClickFinish(key, currentPrompt);
                    } else {
                      setCurrentPrompt(text);
                      toggleEdit(key);
                    }
                  }}
                >
                  {deleteMode ? <Clear /> : (editing ? <CheckCircleIcon /> : <EditIcon />)}
                </IconButton>
              </Box>
            </ListItem>
        )) : (
          samplePrompts.map((text, index) => {
            console.log("text:", text);
            console.log("lastCopiedSamplePrompt:", lastCopiedSamplePrompt);
            return (
            <ListItem key={index} disableGutters>
              <Box
                className="prompt-container"
              >
                {text === lastCopiedSamplePrompt && (
                    <Box className="copied-notification">
                      Copied!
                    </Box>
                )}
                <ListItemText
                  primary={text}
                  onClick={() => copyToClipboardSample(text)}
                />
              </Box>
            </ListItem>
          )})
        )}
        </List>
      </Box>
    </div>
  );  
}

export default App;
