import { useMutation } from '@tanstack/react-query';
import { api } from '../utils/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const useOrder = () => {
  const navigate = useNavigate();
  
  return useMutation({
    mutationFn: api.placeOrder,
    onSuccess: () => {
      toast.success('Order placed successfully!', {
        position: "top-center",
        duration: 2000,
        style: {
          background: '#10B981',
          color: '#fff',
        }
      });
      navigate('/orders');
    },
    onError: (error: any) => {
      toast.error('Failed to place order. Please try again.', {
        position: "top-center",
        duration: 2000,
        style: {
          background: '#EF4444',
          color: '#fff',
        }
      });
      console.error('Order error:', error);
    }
  });
};