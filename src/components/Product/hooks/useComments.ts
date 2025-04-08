import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../utils/api';
import toast from 'react-hot-toast';

export const useComments = () => {
  const queryClient = useQueryClient();
  
  return {
    addComment: useMutation({
      mutationFn: api.addComment,
      onSuccess: () => {
        toast.success('Comment added successfully');
        queryClient.invalidateQueries({ 
          queryKey: ['product'] 
        });
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to add comment');
      }
    }).mutate
  };
};