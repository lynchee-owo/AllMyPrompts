import React from 'react';
import Prompt from './Prompt';

const PromptList = ({ prompts, onUse }) => {
  return (
    <div>
      {prompts.sort((a, b) => b.usage - a.usage).map((prompt, index) => (
        <Prompt
          key={index}
          prompt={prompt}
          onUse={() => onUse(index)}
        //   onDelete={() => onDelete(index)}
        />
      ))}
    </div>
  );
};

export default PromptList;
