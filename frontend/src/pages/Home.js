import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ProductCard } from '../components/ProductCard';
import { CategoryList } from '../components/CategoryList';
import api from '../api';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Cargar productos y categorías desde la API
  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      try {
        // Obtener productos
        const productsResponse = await api.get('/products/');
        setProducts(productsResponse.data.results || []);

        // Obtener categorías
        const categoriesResponse = await api.get('/categories/');
        setCategories(categoriesResponse.data.results || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load products and categories. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductsAndCategories();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
        <div className="text-xl">Loading products...</div>
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

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4">Welcome to Our E-commerce Store</h1>
        <p className="text-xl text-gray-600">Discover our amazing products</p>
      </motion.div>

      {/* Categorías */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Shop by Category</h2>
        <CategoryList categories={categories} />
      </motion.div>

      {/* Productos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Featured Products</h2>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Home;