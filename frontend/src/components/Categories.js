import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [categoryName, setCategoryName] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [formTitle, setFormTitle] = useState('Create Category');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/categories/');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleCreateCategory = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/api/categories', { name: categoryName });
            setCategories([...categories, response.data]);
            setCategoryName('');
            setFormTitle('Create Category');
            setSelectedCategoryId(null);
            setSuccessMessage('Category created successfully!');
        } catch (error) {
            console.error('Error creating category:', error);
            setErrorMessage('Error creating category.');
        }
    };

    const handleUpdateCategory = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:3000/api/categories/${selectedCategoryId}`, { name: categoryName });
            setCategories(categories.map(cat => cat.id === selectedCategoryId ? response.data : cat));
            setCategoryName('');
            setFormTitle('Create Category');
            setSelectedCategoryId(null);
            setSuccessMessage('Category updated successfully!');
        } catch (error) {
            console.error('Error updating category:', error);
            setErrorMessage('Error updating category.');
        }
    };

    const handleDeleteCategory = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/api/categories/${id}`);
            setCategories(categories.filter(cat => cat.id !== id));
            setSuccessMessage('Category deleted successfully!');
        } catch (error) {
            console.error('Error deleting category:', error);
            setErrorMessage('Error deleting category.');
        }
    };

    const handleEditCategory = (category) => {
        setCategoryName(category.name);
        setSelectedCategoryId(category.id);
        setFormTitle('Update Category');
    };

    return (
        <div style={styles.container}>
            <Navbar /><br/>
            <div style={styles.content}>
                <h3>Category Management</h3>
                <br/>
                <form onSubmit={selectedCategoryId ? handleUpdateCategory : handleCreateCategory} style={styles.form}>
                    <h4>{formTitle}</h4>
                    <input
                        type="text"
                        placeholder="Category Name"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        required
                        style={styles.input}
                    />
                    <button type="submit" className="btn btn-dark">
                        {selectedCategoryId ? 'Update Category' : 'Add Category'}
                    </button>
                    {successMessage && <p style={styles.successMessage}>{successMessage}</p>}
                    {errorMessage && <p style={styles.errorMessage}>{errorMessage}</p>}
                </form>
                <br/><br/>
                <div style={styles.categoryList}>
                    {categories.length > 0 ? (
                        categories.map((category) => (
                            <div key={category.id} style={styles.categoryCard}>
                                <h3 style={styles.categoryName}>Category Name: {category.name}</h3>
                                <button
                                    onClick={() => handleEditCategory(category)}
                                    className="btn btn-dark"
                                    style={styles.button}
                                >
                                    Update
                                </button>
                                <button
                                    onClick={() => handleDeleteCategory(category.id)}
                                    className="btn btn-dark"
                                    style={styles.button}
                                >
                                    Delete
                                </button>
                            </div>
                        ))
                    ) : (
                        <p style={styles.noCategories}>No categories available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
       
    },
    content: {
        
    },
    form: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
        width: '500px',
        margin: 'auto',
    },
    input: {
        width: '100%',
        padding: '10px',
        marginBottom: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
    },
    button: {
        margin: '5px',
    },
    categoryList: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: '20px',
    },
    categoryCard: {
        width: '300px',
        border: '1px solid #ccc',
        padding: '20px',
        margin: '10px',
        borderRadius: '10px',
        backgroundColor: 'white',
        color: '#333',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
    categoryName: {
        fontSize: '1.5rem',
        marginBottom: '30px',
    },
    noCategories: {
        fontSize: '1.2rem',
        color: '#777',
    },
    successMessage: {
        color: 'green',
    },
    errorMessage: {
        color: 'red',
    },
};

export default Categories;
