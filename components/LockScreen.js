import { useState } from 'react';

const LockScreen = ({ onAuthenticated }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/validate-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        onAuthenticated();
      } else {
        setError('Invalid password. Please try again.');
      }
    } catch {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center bg-light">
      <div className="p-4 border rounded bg-white shadow" style={{ width: '300px' }}>
        <h2 className="text-center mb-4">Welcome to Nimbus Prompter 2000</h2>
        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <div className="text-danger mb-3 text-center">{error}</div>}
        <button className="btn btn-primary w-100" onClick={handleLogin}>
          Alohomora
        </button>
      </div>
    </div>
  );
};

export default LockScreen;
