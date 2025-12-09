import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../App';
import api from '../api';

const ProductDetail = () => {
  const { id, slug } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth(); // Obtener el token de autenticación
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Obtenemos el producto específico desde la API, usando slug o id
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        let response;
        if (slug) {
          // Si hay slug en los parámetros, usamos la ruta con slug
          response = await api.get(`/products/${slug}/`);
        } else if (id) {
          // Si no hay slug pero hay id, intentamos hacer una solicitud a la lista de productos
          // para encontrar el producto por ID y obtener su slug
          // Pero lo más directo es intentar la solicitud directamente, aunque probablemente dé 404
          // ya que el backend está configurado para usar slugs
          response = await api.get(`/products/${id}/`);
        } else {
          // Si no hay ni slug ni id, no podemos continuar
          setError('Invalid product URL. Missing product identifier.');
          setLoading(false);
          return;
        }
        setProduct(response.data);
      } catch (err) {
        console.error('Error fetching product:', err);

        // Verificar si es un error de autenticación
        if (err.response && err.response.status === 401) {
          setError('Session expired. Please log in again.');
          navigate('/login');
        } else if (err.response && err.response.status === 404) {
          // Si no se encuentra con el ID, intentamos buscar por slug si solo tenemos ID
          if (id && !slug) {
            // El backend usa slugs, no IDs directos para los endpoints de detalles
            // Esta situación ocurre cuando se trata de acceder directamente por ID
            // En lugar de mostrar el mensaje de formato, diremos que no se encontró
            setError('Product not found.');
          } else {
            setError('Product not found.');
          }
        } else {
          setError('Failed to load product details. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id || slug) {
      fetchProduct();
    } else {
      // Si no se proporcionan parámetros, mostramos un error
      setError('Invalid product URL. Missing product identifier.');
      setLoading(false);
    }
  }, [id, slug, navigate]);

  const handleAddToCart = async () => {
    if (!product) return;

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
        quantity: quantity
      });

      alert(`${quantity} ${product.name} has been added to your cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);

      // Verificar si es un error de autenticación
      if (error.response && error.response.status === 401) {
        alert('Session expired. Please log in again.');
        navigate('/login');
      } else {
        alert('Failed to add product to cart. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
        <div className="text-xl">Loading product...</div>
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

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
      </div>
    );
  }

  // Manejar la imagen del producto
  const productImages = product.image ? [product.image] : ['https://via.placeholder.com/600x400'];

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <div className="md:flex">
          {/* Galería de imágenes */}
          <div className="md:w-1/2 p-6">
            <div className="mb-4">
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-96 object-contain rounded-lg"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/600x400'; }} // Imagen por defecto si falla la carga
              />
            </div>
            <div className="flex space-x-2 overflow-x-auto">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/600x400'; }} // Imagen por defecto si falla la carga
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Detalles del producto */}
          <div className="md:w-1/2 p-6">
            <div className="text-sm text-blue-600 font-semibold mb-2">{product.category}</div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

            <div className="flex items-center mb-6">
              <span className="text-3xl font-bold text-gray-800">${product.price}</span>
              {product.available ? (
                <span className="ml-4 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">In Stock</span>
              ) : (
                <span className="ml-4 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">Out of Stock</span>
              )}
            </div>

            <p className="text-gray-600 mb-6">{product.description}</p>

            {/* Mostrar características si existen */}
            {product.features && Array.isArray(product.features) && product.features.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Features:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {product.features.map((feature, index) => (
                    <li key={index} className="text-gray-700">{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center mb-6">
              <span className="mr-3">Quantity:</span>
              <div className="flex items-center border rounded-lg">
                <button
                  className="px-3 py-1 disabled:opacity-50"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <span className="px-4 py-1">{quantity}</span>
                <button
                  className="px-3 py-1 disabled:opacity-50"
                  disabled={quantity >= product.stock}
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                >
                  +
                </button>
              </div>
              <span className="ml-3 text-gray-600">({product.stock} available)</span>
            </div>

            <div className="flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                  product.available
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-400 text-gray-700 cursor-not-allowed'
                }`}
                onClick={handleAddToCart}
                disabled={!product.available}
              >
                Add to Cart
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Buy Now
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductDetail;