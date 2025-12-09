import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import api from '../api';

export const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { token } = useAuth(); // Obtener el token de autenticación

  const handleViewDetails = () => {
    // Ahora que la API devuelve el slug, podemos usarlo directamente
    if (product.slug) {
      navigate(`/product-slug/${product.slug}`);
    } else {
      // Esto no debería ocurrir con la API actualizada, pero lo mantenemos por seguridad
      console.error('Product does not have a slug for navigation');
      alert('This product cannot be accessed at the moment. Please try another product.');
    }
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation(); // Evitar que el clic en el botón dispare otros eventos

    // Verificar si el usuario está autenticado
    if (!token) {
      alert('Please log in to add items to your cart');
      navigate('/login');
      return;
    }

    try {
      // Llamada a la API para añadir al carrito
      const response = await api.post('/cart/add/', {
        product_id: product.id,
        quantity: 1
      });

      alert(`${product.name} has been added to your cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);

      // Verificar si es un error de autenticación
      if (error.response && error.response.status === 401) {
        alert('Session expired. Please log in again.');
        navigate('/login');
      } else if (error.response && error.response.status === 400) {
        // Error de validación, como producto_id faltante
        alert('Invalid product information. Please try again.');
      } else {
        // Otros errores
        const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to add product to cart. Please try again.';
        alert(errorMessage);
      }
    }
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.2 }}
      onClick={handleViewDetails}
    >
      <div className="relative pb-[100%]"> {/* Proporción 1:1 para la imagen */}
        <img
          src={product.image || 'https://via.placeholder.com/300x300'}
          alt={product.name}
          className="absolute h-full w-full object-cover"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/300x300'; }} // Imagen por defecto si falla la carga
          onClick={(e) => e.stopPropagation()} // Evitar que el clic en la imagen dispare el evento de la tarjeta
        />
        <div className="absolute top-2 right-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-blue-600 text-white rounded-full p-2 shadow-md hover:bg-blue-700 transition-colors"
            onClick={handleAddToCart}
            onClick={(e) => e.stopPropagation()} // Evitar propagación del evento
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l.558-1.443l1.358-5.43l5.404-5.404a1 1 0 00-1.414-1.414l-5.404 5.404L7.71 3.59l-.893.892L6.414 3H3z" />
            </svg>
          </motion.button>
        </div>
      </div>
      <div className="p-4">
        <div className="text-sm text-blue-600 font-semibold mb-1">{product.category}</div>
        <h3 className="font-bold text-lg mb-1 truncate">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-gray-800">${product.price}</span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            onClick={(e) => {
              e.stopPropagation(); // Evitar que el clic en el botón dispare otros eventos
              handleViewDetails();
            }}
          >
            View Details
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};