import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Form from './components/Form';
import Home from './components/Home';
import Products from './components/Products'; // Import the Products component
import Orders from './components/Orders';
import Categories from './components/Categories';
import Users from './components/Users';
import PrivateRoute from './components/PrivateRoute';
import OrderProducts from './components/OrderProducts';

function App() {

  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
    <Routes>
     {/* Redirect to home if user is authenticated, otherwise to login */}
     <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />} />

      
      {/* Login and Signup routes */}
      <Route path="/signup" element={<Form isSignup />} />
      <Route path="/login" element={<Form />} />

      {/* Protected routes */}
      <Route path="/home" element={<PrivateRoute element={<Home />} />} />
      <Route path="/products" element={<PrivateRoute element={<Products />} />} />
      <Route path="/orders" element={<PrivateRoute element={<Orders />} />} />
      <Route path="/categories" element={<PrivateRoute element={<Categories />} />} />
      <Route path="/users" element={<PrivateRoute element={<Users />} />} />
      <Route path="/order-products" element={<PrivateRoute element={<OrderProducts />} />} />

    </Routes>
  </Router>
  );
}

export default App;
