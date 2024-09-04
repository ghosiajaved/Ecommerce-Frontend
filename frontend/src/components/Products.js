
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const Products = () => {
  const [products, setProducts] = useState([]);
  //const [currentProduct, setCurrentProduct] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formValues, setFormValues] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    category: ''
  });
  const [categories, setCategories] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchCategories();  // Fetch categories when the component mounts
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/products/');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/categories/');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories', error);
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
        await axios.put(`http://localhost:3000/api/products/${formValues.name}`, formValues);
        setSuccessMessage('Product updated successfully!');
      } else {
        await axios.post('http://localhost:3000/api/products', formValues);
        setSuccessMessage('Product created successfully!');
      }
      setFormValues({
        name: '',
        description: '',
        price: '',
        quantity: '',
        category: ''
      });
      setIsUpdating(false);
      fetchProducts();
    } catch (error) {
      console.error('Error submitting form', error);
      setErrorMessage('Error submitting form');
    }
  };

  const handleUpdate = (product) => {
    setFormValues({
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      category: product.cat_id  // Set category to the id of the selected category
    });
    setIsUpdating(true);
  };

  const handleDelete = async (productName) => {
    try {
      await axios.delete(`http://localhost:3000/api/products/${productName}`);
      setSuccessMessage('Product deleted successfully!');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product', error);
      setErrorMessage('Error deleting product');
    }
  };

  return (
    <div style={styles.container}>
      <Navbar />
      <br />
      <h3>Products Management</h3>
      <br />

      <form onSubmit={handleFormSubmit} style={styles.form}>
        <h2>{isUpdating ? 'Update Product' : 'Add New Product'}</h2>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formValues.name}
          onChange={handleFormChange}
          style={styles.input}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formValues.description}
          onChange={handleFormChange}
          style={styles.textarea}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formValues.price}
          onChange={handleFormChange}
          style={styles.input}
          required
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={formValues.quantity}
          onChange={handleFormChange}
          style={styles.input}
          required
        />
        <label>Category</label><br /><br />
        <select
          name="category"
          value={formValues.category}
          onChange={handleFormChange}
          style={styles.input}
          required
        >
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <button type="submit" style={styles.button}>
          {isUpdating ? 'Update Product' : 'Create Product'}
        </button>

        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      </form>

      <div style={styles.productList}>
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} style={styles.productCard}>
              <h3 style={styles.productName}>{product.name}</h3>
              <p style={styles.productDescription}>{product.description}</p>
              <p style={styles.productPrice}>Price: Rs. {product.price}</p>
              <p style={styles.productQuantity}>Quantity: {product.quantity}</p>
              <p style={styles.productCategory}>Category ID: {product.cat_id}</p> {/* Show category ID */}
              <button onClick={() => handleUpdate(product)} style={styles.button}>Update</button>
              <button onClick={() => handleDelete(product.name)} style={styles.button}>Delete</button>
            </div>
          ))
        ) : (
          <p style={styles.noProducts}>No products available.</p>
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
  textarea: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    resize: 'none',
    height: '100px',
  },
  button: {
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: 'black',
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer',
    marginBottom: '10px',
  },
  productList: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: '40px',
  },
  productCard: {
    width: '300px',
    border: '1px solid #ccc',
    padding: '20px',
    margin: '10px',
    borderRadius: '10px',
    backgroundColor: 'white',
    color: '#333',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
  productName: {
    fontSize: '1.5rem',
    marginBottom: '10px',
  },
  productDescription: {
    fontSize: '1rem',
    marginBottom: '10px',
  },
  productPrice: {
    fontSize: '1.2rem',
    marginBottom: '10px',
  },
  productQuantity: {
    fontSize: '1rem',
    marginBottom: '10px',
  },
  productCategory: {
    fontSize: '1rem',
    marginBottom: '10px',
  },
  noProducts: {
    fontSize: '1.2rem',
    color: '#555',
  },
};

export default Products;
