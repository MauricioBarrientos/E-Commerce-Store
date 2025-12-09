import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../api';

const Cart = () => {
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Cargar datos del carrito desde la API
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await api.get('/cart/');
        setCartData(response.data);
      } catch (err) {
        console.error('Error fetching cart:', err);
        setError('Failed to load cart. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const updateQuantity = async (item_id, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const response = await api.put(`/cart/item/${item_id}/update/`, {
        quantity: newQuantity
      });

      // Actualizar datos del carrito después del cambio
      const updatedCart = await api.get('/cart/');
      setCartData(updatedCart.data);
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Failed to update quantity. Please try again.');
    }
  };

  const removeItem = async (item_id) => {
    try {
      await api.delete(`/cart/item/${item_id}/remove/`);

      // Actualizar datos del carrito después de eliminar
      const updatedCart = await api.get('/cart/');
      setCartData(updatedCart.data);
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Failed to remove item. Please try again.');
    }
  };

  const clearCart = async () => {
    try {
      await api.delete('/cart/clear/');
      setCartData(null); // O actualizar con carrito vacío
    } catch (error) {
      console.error('Error clearing cart:', error);
      alert('Failed to clear cart. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
        <div className="text-xl">Loading cart...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="rounded-md bg-red-50 p-4 max-w-md mx-auto">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  const cartItems = cartData?.items || [];
  const cartTotal = cartData?.total_cost || 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet</p>
            <Link
              to="/"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lista de productos en el carrito */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <ul className="divide-y divide-gray-200">
                  {cartItems.map((item, index) => (
                    <motion.li
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-6 flex items-center"
                    >
                      <img
                        src={item.product_details?.image || 'https://via.placeholder.com/300x200'}
                        alt={item.product_details?.name}
                        className="w-24 h-24 object-contain rounded-lg mr-6"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{item.product_details?.name}</h3>
                        <p className="text-gray-600">${item.product_details?.price}</p>

                        <div className="flex items-center mt-4">
                          <span className="mr-3">Quantity:</span>
                          <div className="flex items-center border rounded-lg mr-4">
                            <button
                              className="px-3 py-1 disabled:opacity-50"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              -
                            </button>
                            <span className="px-4 py-1">{item.quantity}</span>
                            <button
                              className="px-3 py-1 disabled:opacity-50"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:text-red-800 font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-bold">${(item.quantity * item.product_details?.price).toFixed(2)}</p>
                      </div>
                    </motion.li>
                  ))}
                </ul>

                <div className="p-6 bg-gray-50 flex justify-between items-center">
                  <Link
                    to="/"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    &larr; Continue Shopping
                  </Link>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Clear Cart
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Resumen del pedido y checkout */}
            <div>
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>${(cartTotal * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${(cartTotal * 0.08).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${(cartTotal + cartTotal * 0.1 + cartTotal * 0.08).toFixed(2)}</span>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors text-center block"
                >
                  Proceed to Checkout
                </Link>
              </div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-6 bg-blue-50 rounded-xl p-6"
              >
                <h3 className="font-bold mb-2">Shipping Information</h3>
                <p className="text-gray-600 text-sm">
                  Free shipping on orders over $100. Standard shipping takes 3-5 business days.
                </p>
              </motion.div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Cart;