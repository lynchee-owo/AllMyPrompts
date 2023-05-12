/* global chrome */
import React, { useEffect, useState } from 'react';

function App() {
  const [prompts, setPrompts] = useState([]);

  useEffect(() => {
    chrome.storage.sync.get(null, function(items) {
      setPrompts(Object.values(items));
    });
  }, []);

  return (
    <div className="App">
      {prompts.map((prompt, index) => (
        <p key={index}>{prompt}</p>
      ))}
    </div>
  );
}

export default App;
