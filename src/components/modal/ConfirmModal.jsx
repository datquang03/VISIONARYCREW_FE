import { motion, AnimatePresence } from 'framer-motion';

export const ConfirmModal = ({ onConfirm, onCancel, time, date }) => {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
        >
          <h2 className="text-xl font-bold mb-4 text-gray-800">Xác nhận tạo lịch</h2>
          <p className="mb-4 text-gray-600">
            Bạn muốn tạo lịch rảnh vào <b>{time}</b> ngày <b>{date.toLocaleDateString('vi-VN')}</b>?
          </p>
          <div className="flex justify-end gap-4">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 cursor-pointer"
            >
              Hủy
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer"
            >
              Xác nhận
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
