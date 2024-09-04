import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const Navbar = () => {
  return (
    <nav style={styles.navbar}>
      <ul style={styles.navList}>
        <li><Link to="/" style={styles.navLink}>Home</Link></li>
        <li><Link to="/products" style={styles.navLink}>Products</Link></li>
        <li><Link to="/orders" style={styles.navLink}>Orders</Link></li>
        <li><Link to="/categories" style={styles.navLink}>Categories</Link></li>
        <li><Link to="/users" style={styles.navLink}>Users</Link></li>
        <li><Link to="/order-products" style={styles.navLink}>OrderProducts</Link></li>
      </ul>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px',
    backgroundColor: '#333',
    color: '#fff',
  },
  navList: {
    display: 'flex',
    listStyleType: 'none',
    margin: 0,
    padding: 0,
  },
  navLink: {
    color: '#fff',
    textDecoration: 'none',
    padding: '10px',
    fontSize: '16px',
  }
};

export default Navbar;
