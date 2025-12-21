import React from 'react';
import { motion } from 'framer-motion';
import { Logo } from './ui/Logo';
import LoadingSpinner from './LoadingSpinner';

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = "Loading decentralized marketplace..."
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: '#0B0E11' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center space-y-8"
      >
        {/* Logo */}
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          <Logo size="lg" />
        </motion.div>

        {/* Loading Spinner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col items-center space-y-4"
        >
          <LoadingSpinner size="lg" />
          <p className="text-sm font-medium" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            {message}
          </p>
        </motion.div>

        {/* Blockchain-inspired animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex space-x-2"
        >
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut"
              }}
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: '#F0B90B' }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;