import React from 'react';

const ChatInput = ({ userInput, setUserInput, sendMessage, stopProcessing, isProcessing }) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent newline in textarea
      sendMessage();
    }
  };

  return (
    <div className="p-3 bg-light" style={{ maxWidth: '800px', width: '100%', borderTopLeftRadius: '10px', borderTopRightRadius: '10px', marginBottom: '10px' }}>
      <textarea
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        onKeyPress={handleKeyPress}
        className="form-control mb-2"
        style={{
          resize: 'none',
          height: 'auto',
          overflowY: 'scroll',
          maxHeight: '250px',
          backgroundColor: '#f8f9fa',
          border: 'none',
        }}
        rows="1"
        placeholder="Type your message here..."
        disabled={isProcessing}
        onInput={(e) => {
          e.target.style.height = 'auto';
          e.target.style.height = `${Math.min(e.target.scrollHeight, 250)}px`;
        }}
      />
      {isProcessing ? (
        <button className="btn btn-danger w-100" onClick={stopProcessing}>
          Stop
        </button>
      ) : (
        <button className="btn btn-success w-100" onClick={sendMessage}>
          Send
        </button>
      )}
    </div>
  );
};

export default ChatInput;
