import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../App'; // Importar el hook de autenticación

const Navbar = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirigir al home después del logout
  };

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">
          <Link to="/">E-Commerce Store</Link>
        </div>
        <div className="flex space-x-4">
          <Link to="/" className="hover:text-blue-200">Home</Link>
          <Link to="/cart" className="hover:text-blue-200">Cart</Link>

          {token ? (
            // Usuario autenticado
            <div className="flex items-center space-x-4">
              <Link to="/import-products" className="hover:text-blue-200">Import Products</Link>
              <span className="hidden md:inline">Welcome, {user?.username || 'User'}!</span>
              <button
                onClick={handleLogout}
                className="hover:text-blue-200"
              >
                Logout
              </button>
            </div>
          ) : (
            // Usuario no autenticado
            <>
              <Link to="/login" className="hover:text-blue-200">Login</Link>
              <Link to="/register" className="hover:text-blue-200">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;