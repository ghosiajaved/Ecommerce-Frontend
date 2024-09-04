import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [formValues, setFormValues] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [currentUserId, setCurrentUserId] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users', error);
            setErrorMessage('Error fetching users.');
        }
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isUpdating) {
                await axios.put(`http://localhost:3000/api/users/${currentUserId}`, formValues);
                setSuccessMessage('User updated successfully!');
            } else {
                await axios.post('http://localhost:3000/api/users', formValues);
                setSuccessMessage('User created successfully!');
            }
            setFormValues({
                username: '',
                email: '',
                password: ''
            });
            setIsUpdating(false);
            setCurrentUserId(null);
            fetchUsers();
        } catch (error) {
            console.error('Error submitting form', error);
            setErrorMessage('Error submitting form');
        }
    };

    const handleUpdate = (user) => {
        setFormValues({
            username: user.username,
            email: user.email,
            password: '' // Clear password field on update
        });
        setCurrentUserId(user.id);
        setIsUpdating(true);
    };

    const handleDelete = async (userId) => {
        try {
            await axios.delete(`http://localhost:3000/api/users/${userId}`);
            setSuccessMessage('User deleted successfully!');
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user', error);
            setErrorMessage('Error deleting user');
        }
    };

    return (
        <div style={styles.container}>
            <Navbar />
            <br />
            <h3>User Management</h3>
            <br /><br />
            <form onSubmit={handleFormSubmit} style={styles.form}>
                <h2>{isUpdating ? 'Update User' : 'Create User'}</h2>
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formValues.username}
                    onChange={handleFormChange}
                    style={styles.input}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formValues.email}
                    onChange={handleFormChange}
                    style={styles.input}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formValues.password}
                    onChange={handleFormChange}
                    style={styles.input}
                    required
                />
                <div style={styles.buttonContainer}>
                    <button type="submit" style={styles.button}>
                        {isUpdating ? 'Update User' : 'Create User'}
                    </button>
                </div>
                {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            </form>
            <br/><br/>
            <div style={styles.userList}>
                {users.length > 0 ? (
                    users.map((user) => (
                        <div key={user.id} style={styles.userCard}>
                            <p><strong>ID:</strong> {user.id}</p>
                            <p><strong>Username:</strong> {user.username}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <div style={styles.buttonContainer}>
                                <button onClick={() => handleUpdate(user)} style={styles.button}>Update</button>
                                <button onClick={() => handleDelete(user.id)} style={styles.button}>Delete</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No users available.</p>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {

    },
    form: {
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
        width: '500px',
        margin: '0 auto',
    },
    input: {
        width: '100%',
        padding: '10px',
        marginBottom: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
    },
    button: {
        padding: '10px 20px',
        borderRadius: '4px',
        border: 'none',
        backgroundColor: 'black',
        color: '#fff',
        fontSize: '16px',
        cursor: 'pointer',
        marginRight: '10px', // Adjust this value to control the gap
    },
    buttonContainer: {
        marginBottom: '10px',
    },
    userList: {
        marginTop: '20px',
    },
    userCard: {
        border: '1px solid #ccc',
        padding: '15px',
        marginBottom: '10px',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
};

export default Users;
