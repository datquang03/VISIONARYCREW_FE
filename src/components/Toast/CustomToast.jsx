import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Configure toast with Tailwind-like styling
const toastOptions = {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'colored',
};

// Custom toast function
export const CustomToast = ({ message, type = 'info' }) => {
  switch (type) {
    case 'success':
      toast.success(message, {
        ...toastOptions,
        className: 'bg-green-500 text-white font-semibold rounded-xl shadow-md',
      });
      break;
    case 'error':
      toast.error(message, {
        ...toastOptions,
        className: 'bg-red-500 text-white font-semibold rounded-xl shadow-md',
      });
      break;
    case 'info':
    default:
      toast.info(message, {
        ...toastOptions,
        className: 'bg-blue-500 text-white font-semibold rounded-xl shadow-md',
      });
      break;
  }
};

// Initialize toast container (call this once in your app, e.g., in App.js)
export const ToastContainer = () => {
  return <toast.ToastContainer />;
};