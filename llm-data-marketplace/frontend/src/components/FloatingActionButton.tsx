import { motion } from 'framer-motion';
import { Plus, Upload, Database, Brain } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const buttonVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
    hover: { scale: 1.1 },
    tap: { scale: 0.95 }
  };

  const menuVariants = {
    closed: { scale: 0, opacity: 0 },
    open: { scale: 1, opacity: 1 }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Action Menu */}
      <motion.div
        variants={menuVariants}
        animate={isOpen ? "open" : "closed"}
        className="absolute bottom-16 right-0 flex flex-col gap-3"
      >
        <Link to="/upload-dataset">
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover-glow"
            style={{ backgroundColor: '#F0B90B', color: '#0B0E11' }}
            title="Upload Dataset"
          >
            <Database className="w-5 h-5" />
          </motion.button>
        </Link>
        
        <Link to="/upload-model">
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover-glow"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#FFFFFF' }}
            title="Upload AI Model"
          >
            <Brain className="w-5 h-5" />
          </motion.button>
        </Link>
      </motion.div>

      {/* Main FAB */}
      <motion.button
        variants={buttonVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        whileTap="tap"
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl hover-glow animate-pulse-slow"
        style={{ backgroundColor: '#F0B90B', color: '#0B0E11' }}
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Plus className="w-6 h-6" />
        </motion.div>
      </motion.button>
    </div>
  );
};

export default FloatingActionButton;
