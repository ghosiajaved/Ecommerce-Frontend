import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const OrderProducts = () => {
  const [orderProducts, setOrderProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [formValues, setFormValues] = useState({ order_id: '', product_id: '' });
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchOrderProducts();
    fetchOrders();
    fetchProducts();
  }, []);

  const fetchOrderProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/order-products');
      setOrderProducts(response.data);
    } catch (error) {
      console.error('Error fetching order products', error);
      setErrorMessage('Error fetching order products.');
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders', error);
      setErrorMessage('Error fetching orders.');
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products', error);
      setErrorMessage('Error fetching products.');
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
            await axios.put(`http://localhost:3000/api/order-products/${currentOrderId}/${currentProductId}`, {
                newOrderId: formValues.order_id,
                newProductId: formValues.product_id
            });
            setSuccessMessage('Order product updated successfully!');
        } else {
            await axios.post('http://localhost:3000/api/order-products', formValues);
            setSuccessMessage('Order product added successfully!');
        }
        setFormValues({ order_id: '', product_id: '' });
        setIsUpdating(false);
        setCurrentOrderId(null);
        setCurrentProductId(null);
        
        fetchOrderProducts();
    } catch (error) {
        console.error('Error submitting form', error);
        setErrorMessage('Error submitting form');
    }
  };

  const handleUpdate = (orderProduct) => {
    setFormValues({
      order_id: orderProduct.order_id,
      product_id: orderProduct.product_id,
    });
    setCurrentOrderId(orderProduct.order_id);
    setCurrentProductId(orderProduct.product_id);
    setIsUpdating(true);
  };

  const handleDelete = async (order_id, product_id) => {
    try {
      await axios.delete(`http://localhost:3000/api/order-products/${order_id}/${product_id}`);
      setSuccessMessage('Order product deleted successfully!');
      fetchOrderProducts();
    } catch (error) {
      console.error('Error deleting order product', error);
      setErrorMessage('Error deleting order product');
    }
  };

  return (
    <div style={styles.container}>
        <Navbar/>
        <br/>
      <h3>Order Products Management</h3>
      <br/><br/>
      <form onSubmit={handleFormSubmit} style={styles.form}>
        <h2>{isUpdating ? 'Update Order Product' : 'Add Order Product'}</h2>
        
        <label>Order</label><br /><br />
        <select
          name="order_id"
          value={formValues.order_id}
          onChange={handleFormChange}
          style={styles.input}
          required
        >
          <option value="">Select Order</option>
          {orders.map(order => (
            <option key={order.id} value={order.id}>{order.id}</option>
          ))}
        </select>

        <label>Product</label><br /><br />
        <select
          name="product_id"
          value={formValues.product_id}
          onChange={handleFormChange}
          style={styles.input}
          required
        >
          <option value="">Select Product</option>
          {products.map(product => (
            <option key={product.id} value={product.id}>{product.name}</option>
          ))}
        </select>

        <button type="submit" style={styles.button}>
          {isUpdating ? 'Update Order Product' : 'Add Order Product'}
        </button>
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      </form>
      <div style={styles.orderProductList}>
        {orderProducts.length > 0 ? (
          orderProducts.map((orderProduct) => (
            <div key={`${orderProduct.order_id}-${orderProduct.product_id}`} style={styles.orderProductCard}>
              <p><strong>Order ID:</strong> {orderProduct.order_id}</p>
              <p><strong>Product ID:</strong> {orderProduct.product_id}</p>
              <button onClick={() => handleUpdate(orderProduct)} style={styles.button}>Update</button>
              <button onClick={() => handleDelete(orderProduct.order_id, orderProduct.product_id)} style={styles.button}>Delete</button>
            </div>
          ))
        ) : (
          <p>No order products available.</p>
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
        width: '30%',
        padding: '10px',
        borderRadius: '4px',
        border: 'none',
        backgroundColor: 'black',
        color: '#fff',
        fontSize: '16px',
        cursor: 'pointer',
        marginBottom: '10px',
        marginRight: '5px',
    },
    orderProductList: {
        marginTop: '20px',
    },
    orderProductCard: {
        border: '1px solid #ccc',
        padding: '15px',
        marginBottom: '10px',
        borderRadius: '4px',
        display: 'flex',
        justifyContent: 'space-between',
    },
};

export default OrderProducts;
