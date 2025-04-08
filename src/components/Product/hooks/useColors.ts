import { useQuery } from '@tanstack/react-query';
import { api } from '../utils/api';
import { Color } from '../types/product';

export const useColors = () => {
    return useQuery<Color[]>({
      queryKey: ['colors'],
      queryFn: () => api.fetchColors(),
      staleTime: 60 * 1000,
    });
  };


