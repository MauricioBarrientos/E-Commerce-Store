import React, { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api';

const ProductImport = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [apiUrl, setApiUrl] = useState('https://fakestoreapi.com/products');

  const handleImport = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await api.post('/products/import/', {
        api_url: apiUrl
      });

      setMessage(`Importación completada exitosamente: ${response.data.imported_count} productos importados`);
    } catch (err) {
      console.error('Error importing products:', err);
      setError(err.response?.data?.error || 'Error al importar productos. Por favor, inténtelo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">Importar Productos</h1>
        
        <p className="text-gray-600 mb-8 text-center">
          Importa productos desde una API externa para poblar tu catálogo automáticamente.
        </p>

        <div className="mb-6">
          <label htmlFor="apiUrl" className="block text-sm font-medium text-gray-700 mb-2">
            URL de la API de productos
          </label>
          <input
            type="text"
            id="apiUrl"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://api.example.com/products"
          />
          <p className="mt-2 text-sm text-gray-500">
            La URL debe devolver un array de productos en formato JSON compatible.
          </p>
        </div>

        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleImport}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-75"
          >
            {loading ? 'Importando...' : 'Importar Productos'}
          </motion.button>
        </div>

        {message && (
          <div className="mt-6 p-4 bg-green-50 rounded-md">
            <div className="text-green-700">{message}</div>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-50 rounded-md">
            <div className="text-red-700">{error}</div>
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">¿Cómo funciona?</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>Esta herramienta importa productos desde APIs externas directamente a tu catálogo</li>
            <li>Los productos se mapean automáticamente a las categorías existentes</li>
            <li>Se descargan las imágenes y se almacenan localmente</li>
            <li>Si un producto ya existe, se actualiza en lugar de crear uno nuevo</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductImport;