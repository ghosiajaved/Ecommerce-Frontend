import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Form = ({ isSignup }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isSignup ? '/api/users/signup' : '/api/users/login';
        const data = isSignup ? { username, email, password } : { email,password };

        try {
            const response = await axios.post(`http://localhost:3000${endpoint}`, data);
            localStorage.setItem('token', response.data.token);
            navigate('/home');
        } catch (error) {
            setError(error.response ? error.response.data.message : 'An error occurred during authentication. Please try again.');
        }
    };

    return (
        <div style={containerStyle}>
            <form onSubmit={handleSubmit} style={formStyle}>
                {isSignup && (
                    <>
                        <input
                            type="text"
                            placeholder="Name"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={inputStyle}
                        />
                    </>
                )}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={inputStyle}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={inputStyle}
                    autoComplete="current-password"
                />
                <button type="submit" style={buttonStyle}>
                    {isSignup ? 'Sign Up' : 'Login'}
                </button>
                {error && <div style={errorStyle}>{error}</div>}
            </form>
            {!isSignup && (
                <div style={linkContainerStyle}>
                    <span>New user?</span>
                    <button style={linkStyle} onClick={() => navigate('/signup')}>
                        Sign Up
                    </button>
                </div>
            )}
        </div>
    );
};



// Inline styles
const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f9f9f9',
};

const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    width: '300px',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
};

const inputStyle = {
    marginBottom: '15px',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
};

const buttonStyle = {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: 'black',
    color: 'white',
    cursor: 'pointer',
};

const linkContainerStyle = {
    marginTop: '10px',
    textAlign: 'center',
};

const linkStyle = {
    background: 'none',
    border: 'none',
    color: '#007bff',
    cursor: 'pointer',
    fontSize: '16px',
};

const errorStyle = {
    color: 'red',
    marginTop: '10px',
};

export default Form;
