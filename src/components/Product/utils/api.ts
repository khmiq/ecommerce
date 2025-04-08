// import axios from 'axios';
// import { Product, Category, Color, OrderCreate, CommentCreate } from '../types/product';

// const API_BASE = "https://keldibekov.online";

// export const api = {
//   // Product endpoints
//   fetchProduct: async (productId: string): Promise<Product> => {
//     const { data } = await axios.get<{ data: Product }>(`${API_BASE}/products/${productId}`);
//     return data.data;
//   },

//   fetchProducts: async (params: URLSearchParams): Promise<Product[]> => {
//     const { data } = await axios.get<{ data: Product[] }>(`${API_BASE}/products`, {
//       params: Object.fromEntries(params.entries())
//     });
//     return data.data || [];
//   },
// //   fetchProduct: async (productId: string): Promise<Product> => {
// //     const response = await axios.get<ApiResponse<Product>>(`${API_BASE}/products/${productId}`);
// //     return response.data.data; // Access the nested data property
// //   },

// //   fetchProducts: async (params: URLSearchParams): Promise<Product[]> => {
// //     const response = await axios.get<ApiResponse<Product[]>>(`${API_BASE}/products`, {
// //       params: Object.fromEntries(params.entries())
// //     });
// //     return response.data.data || []; // Provide fallback empty array
// //   },

//   // Category endpoints
//   fetchCategories: async (): Promise<Category[]> => {
//     const { data } = await axios.get<{ data: Category[] }>(`${API_BASE}/category`);
//     return data.data || [];
//   },

//   // Color endpoints
//   fetchColors: async (): Promise<Color[]> => {
//     const { data } = await axios.get<{ data: Color[] }>(`${API_BASE}/color`);
//     return data.data || [];
//   },

//   // Comment endpoints
//   addComment: async (commentData: CommentCreate): Promise<Comment> => {
//     const { data } = await axios.post<{ data: Comment }>(
//       `${API_BASE}/comments`,
//       commentData
//     );
//     return data.data;},

//   // Order endpoints
//   // shu yerda Ordercreatedan keyin & { token: string } shu qo'yilishi kerak!!
//   placeOrder: async (orderData: OrderCreate ): Promise<{ success: boolean }> => {
//     const { data } = await axios.post<{ success: boolean }>(`${API_BASE}/order`, {
//       productId: orderData.productId,
//       colorIds: orderData.colorIds,
//       count: orderData.count
//     }, {
//     //   headers: {
//     //     Authorization: `Bearer ${orderData.token}`
//     //   }
//     });
//     return data;
//   }
// };

import axios from 'axios';
import { Product, Category, Color, OrderCreate, CommentCreate } from '../types/product';

const API_BASE = "https://keldibekov.online";

interface ApiResponse<T> {
  data: T;
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export const api = {
  // Product endpoints
  fetchProduct: async (productId: string): Promise<Product> => {
    const { data } = await axios.get<ApiResponse<Product>>(`${API_BASE}/products/${productId}`);
    return {
      ...data.data,
      img: data.data.img || "https://via.placeholder.com/300",
      colorIds: data.data.colorIds || [],
      category: data.data.category || { id: "", name: "Uncategorized" },
      avgStars: data.data.avgStars || "0"
    };
  },

  fetchProducts: async (params: URLSearchParams): Promise<ApiResponse<Product[]>> => {
    const { data } = await axios.get<ApiResponse<Product[]>>(`${API_BASE}/products`, {
      params: Object.fromEntries(params.entries())
    });
    
    return {
      data: (data.data || []).map(p => ({
        ...p,
        img: p.img || "https://via.placeholder.com/300",
        colorIds: p.colorIds || [],
        category: p.category || { id: "", name: "Uncategorized" },
        avgStars: p.avgStars || "0"
      })),
      total: data.total || 0,
      page: data.page || 1,
      limit: data.limit || 10,
      totalPages: data.totalPages || 1
    };
  },

  // Category endpoints
  fetchCategories: async (): Promise<Category[]> => {
    const { data } = await axios.get<ApiResponse<Category[]>>(`${API_BASE}/category`);
    return data.data || [];
  },

  // Color endpoints
  fetchColors: async (): Promise<Color[]> => {
    const { data } = await axios.get<ApiResponse<Color[]>>(`${API_BASE}/color`);
    return data.data || [];
  },

  // Comment endpoints
  addComment: async (commentData: CommentCreate): Promise<Comment> => {
    const { data } = await axios.post<ApiResponse<Comment>>(
      `${API_BASE}/comments`,
      commentData
    );
    return data.data;
  },

  // Order endpoints
  placeOrder: async (orderData: OrderCreate): Promise<{ success: boolean }> => {
    const { data } = await axios.post<{ success: boolean }>(`${API_BASE}/order`, {
      productId: orderData.productId,
      colorIds: orderData.colorIds,
      count: orderData.count
    });
    return data;
  }
};