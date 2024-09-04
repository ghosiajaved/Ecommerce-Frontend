import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [formValues, setFormValues] = useState({
    product: '', // Adjusted to match the column name in the database
    quantity: '',
    user_id: ''
  });
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchOrders();
    fetchProducts();
    fetchUsers();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/orders/');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/products/');
      console.log('Fetched products:', response.data);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/users/');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users', error);
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
        await axios.put(`http://localhost:3000/api/orders/${formValues.id}`, formValues);
        setSuccessMessage('Order updated successfully!');
      } else {
        await axios.post('http://localhost:3000/api/orders', formValues);
        setSuccessMessage('Order created successfully!');
      }
      setFormValues({
        product: '', // Adjusted to match the column name in the database
        quantity: '',
        user_id: ''
      });
      setIsUpdating(false);
      fetchOrders();
      setTimeout(() => setSuccessMessage(''), 3000);  // Clear success message after 3 seconds
    } catch (error) {
      console.error('Error submitting form', error);
      setErrorMessage('Error submitting form');
    }
  };

  const handleUpdate = (order) => {
    setFormValues({
      id: order.id,
      product: order.product, // Adjusted to match the column name in the database
      quantity: order.quantity,
      user_id: order.user_id
    });
    setIsUpdating(true);
  };

  const handleDelete = async (orderId) => {
    try {
      await axios.delete(`http://localhost:3000/api/orders/${orderId}`);
      setSuccessMessage('Order deleted successfully!');
      fetchOrders();
      setTimeout(() => setSuccessMessage(''), 3000);  // Clear success message after 3 seconds
    } catch (error) {
      console.error('Error deleting order', error);
      setErrorMessage('Error deleting order');
    }
  };

  const getUserById = (id) => {
    const user = users.find(u => u.id === id);
    return user ? user.username : 'Unknown';
  };

  return (
    <div style={styles.container}>
      <Navbar />
      <br />
      <h3>Orders Management</h3>
      <br />

      <form onSubmit={handleFormSubmit} style={styles.form}>
        <h2>{isUpdating ? 'Update Order' : 'Add New Order'}</h2>

        <label>Product</label><br /><br />
        <select
          name="product"
          value={formValues.product}
          onChange={handleFormChange}
          style={styles.input}
          required
        >
          <option value="">Select Product</option>
          {products.map(product => (
            <option key={product.id} value={product.id}>{product.name}</option>
          ))}
        </select>

        <label>User</label><br /><br />
        <select
          name="user_id"
          value={formValues.user_id}
          onChange={handleFormChange}
          style={styles.input}
          required
        >
          <option value="">Select User</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>{user.username}</option>
          ))}
        </select>

        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={formValues.quantity}
          onChange={handleFormChange}
          style={styles.input}
          required
        />

        <button type="submit" style={styles.button}>
          {isUpdating ? 'Update Order' : 'Create Order'}
        </button>

        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      </form>

      <div style={styles.orderList}>
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.id} style={styles.orderCard}>
              <h3 style={styles.orderProduct}>Order ID: <b>{order.id}</b></h3>
              <p style={styles.orderProduct}>Product ID: {order.product}</p>
              <p style={styles.orderUser}>User: {getUserById(order.user_id)}</p>
              <p style={styles.orderQuantity}>Quantity: {order.quantity}</p>
              <button onClick={() => handleUpdate(order)} style={styles.button}>Update</button>
              <button onClick={() => handleDelete(order.id)} style={styles.button}>Delete</button>
            </div>
          ))
        ) : (
          <p style={styles.noOrders}>No orders available.</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {},
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
  orderList: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: '40px',
  },
  orderCard: {
    width: '300px',
    border: '1px solid #ccc',
    padding: '20px',
    margin: '10px',
    borderRadius: '10px',
    backgroundColor: 'white',
    color: '#333',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
  orderProduct: {
    fontSize: '1.3rem',
    marginBottom: '10px',
  },
  orderUser: {
    fontSize: '1rem',
    marginBottom: '10px',
  },
  orderQuantity: {
    fontSize: '1rem',
    marginBottom: '10px',
  },
  noOrders: {
    fontSize: '1.2rem',
    color: '#555',
  },
};

export default Orders;

 