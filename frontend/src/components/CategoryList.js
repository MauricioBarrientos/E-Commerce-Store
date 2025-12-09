import React from 'react';
import { motion } from 'framer-motion';

export const CategoryList = ({ categories }) => {
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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 md:grid-cols-4 gap-6"
    >
      {categories.map((category) => (
        <motion.div
          key={category.id}
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
        >
          <div className="relative pb-[100%]"> {/* Proporción 1:1 para la imagen */}
            <img 
              src={category.image} 
              alt={category.name} 
              className="absolute h-full w-full object-cover"
            />
          </div>
          <div className="p-4 text-center">
            <h3 className="font-bold text-lg">{category.name}</h3>
            <p className="text-gray-600 text-sm">{category.count} products</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};