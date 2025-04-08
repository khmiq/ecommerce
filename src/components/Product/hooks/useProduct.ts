// import { useQuery } from '@tanstack/react-query';
// import { api } from '../utils/api';
// import { Product } from '../types/product';

// export const useProduct = (productId: string) => {
//   return useQuery<Product>({
//     queryKey: ['product', productId],
//     queryFn: async () => {
//       const { data } = await api.fetchProduct(productId);
//       return data;
//     },
//     retry: 2,
//   });
// };
import { useQuery } from '@tanstack/react-query';
import { api } from '../utils/api';
import { Product } from '../types/product';

export const useProduct = (productId: string) => {
  return useQuery<Product, Error>({
    queryKey: ['product', productId],
    queryFn: () => api.fetchProduct(productId),
    retry: 2,
    staleTime: 60 * 1000,
  });
};