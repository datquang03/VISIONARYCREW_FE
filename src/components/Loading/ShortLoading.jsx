
import { motion } from 'framer-motion';

const ShortLoading = ({ text }) => {
  return (
    <div className="flex items-center justify-center space-x-1 text-gray-600 font-medium text-sm">
      <span>{text}</span>
      <motion.span
        className="inline-block"
        animate={{ opacity: [0.2, 1, 0.2] }}
        transition={{ repeat: Infinity, duration: 1, ease: 'easeInOut' }}
      >
        .
      </motion.span>
      <motion.span
        className="inline-block"
        animate={{ opacity: [0.2, 1, 0.2] }}
        transition={{ repeat: Infinity, duration: 1, ease: 'easeInOut', delay: 0.2 }}
      >
        .
      </motion.span>
      <motion.span
        className="inline-block"
        animate={{ opacity: [0.2, 1, 0.2] }}
        transition={{ repeat: Infinity, duration: 1, ease: 'easeInOut', delay: 0.4 }}
      >
        .
      </motion.span>
    </div>
  );
};

export default ShortLoading;
