import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Signup.css'; 

function SignUpPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Student'); 

  // Assume this is the role the administrator wants to block signups for
  const blockedRole = 'Student';

  const handleSignUp = () => {
    if (role === blockedRole) {
      alert('Sign up for this role is blocked by the administrator.');
      return; // Prevent further execution if the role is blocked
    }

    const userData = {
      username,
      password,
      role
    };
    localStorage.setItem('userData', JSON.stringify(userData));
    window.location.href = '/';
  };

  return (
    <div className="signup-body">
      <div className="signup-container">
        <h2>Sign Up</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="Student">Student</option>
          <option value="Faculty">Faculty</option>
          <option value="Staff">Staff</option>
          <option value="Moderator">Moderator</option>
          <option value="Administrator">Administrator</option>
        </select>
        <button className="btn" onClick={handleSignUp}>Sign Up</button>
      </div>
    </div>
  );
}

export default SignUpPage;
