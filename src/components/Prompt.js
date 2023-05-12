import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const Prompt = ({ prompt, onUse, onDelete }) => {
  return (
    <div>
      <h2>{prompt.text}</h2>
      <p>Tag: {prompt.tag}</p>
      <p>Usage: {prompt.usage}</p>
      <CopyToClipboard text={prompt.text} onCopy={onUse}>
        <button>Copy</button>
      </CopyToClipboard>
      <button onClick={onDelete}>Delete</button>
    </div>
  );
};

export default Prompt;
