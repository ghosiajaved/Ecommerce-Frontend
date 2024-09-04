import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setShowModal(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem('token'); // Clear the token
    navigate('/login'); // Redirect to login/signup page
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div style={styles.container}>
      <Navbar />
      <br /><br/>

      {/* Cards for each section */}
      <div style={styles.cardContainer}>
        {sections.map((section) => (
          <Card key={section.title} style={styles.card}>
            <Card.Img variant="top" src={section.image} />
            <Card.Body>
              <Card.Title>
                <Link to={section.link} style={styles.cardLink}>
                  {section.title}
                </Link>
              </Card.Title>
            </Card.Body>
          </Card>
        ))}
      </div>
      <br/>

      {/* Logout Button */}
      <Button variant="danger" onClick={handleLogout} style={styles.logoutButton}>Logout</Button>

      {/* Logout Confirmation Modal */}
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you want to leave the application?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>No</Button>
          <Button variant="primary" onClick={confirmLogout}>Yes</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Home;

const sections = [
  { title: 'Products', link: '/products', image: 'products.jfif' },
  { title: 'Orders', link: '/orders', image: 'orders.jfif' },
  { title: 'Categories', link: '/categories', image: 'categories.jfif' },
  { title: 'Users', link: '/users', image: 'users.jfif' },
  { title: 'Order-Products', link: '/order-products', image: 'orderProducts.jfif' },
];

const styles = {
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: 'white',
  },
  cardContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    justifyContent: 'center'
  },
  card: {
    width: '25rem',
  },
  cardLink: {
    textDecoration: 'none',
    color: 'black'
  },
  logoutButton: {
    marginTop: '20px',
  }
};
