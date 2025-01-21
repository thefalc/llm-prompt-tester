import React from 'react';

const ChatOptions = ({
  systemMessage,
  setSystemMessage,
  saveSystemMessage,
  isSaving,
  personality,
  setPersonality,
  personalities,
  promptTemplate,
  setPromptTemplate,
  prompts,
  handlePromptSelect,
  clearChat,
}) => {
  return (
    <div className="options-container p-3 border-end d-flex flex-column" style={{ width: '250px' }}>
      <textarea
        value={systemMessage}
        onChange={(e) => setSystemMessage(e.target.value)}
        className="form-control mb-3"
        rows="3"
        placeholder="Enter the system message here..."
      />
      <button
        className="btn btn-primary w-100 mb-3"
        onClick={saveSystemMessage}
        disabled={isSaving}
      >
        Save System Message
      </button>

      <div className="mb-3">
        <label className="form-label">Personality</label>
        <select
          className="form-select"
          value={personality}
          onChange={(e) => {
            const selected = personalities.find((p) => p.name === e.target.value);
            setPersonality(e.target.value);
            if (selected) setSystemMessage(selected.content);
          }}
        >
          <option value="">Select Personality</option>
          {personalities.map((p) => (
            <option key={p.name} value={p.name}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Prompt Template</label>
        <select
          className="form-select"
          value={promptTemplate}
          onChange={(e) => handlePromptSelect(e.target.value)}
        >
          <option value="">Select Template</option>
          {prompts.map((p) => (
            <option key={p.name} value={p.name}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <button className="btn btn-secondary w-100 mt-auto" onClick={clearChat}>
        Clear Chat
      </button>
    </div>
  );
};

export default ChatOptions;
