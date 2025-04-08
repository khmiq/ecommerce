export type Comment = {
    id: string;
    text: string;
    star: number;
    createdAt: string;
    user: {
      id: string;
      firstname: string;
      lastname: string;
    };
  };
  export type CommentCreate = {
    text: string;
    star: number;
    productId: string; // This is what your API expects
  };
  
  export type Color = {
    id: string;
    name: string;
    hexCode?: string;  // Made optional if not always provided
  };
  
  export type Category = {
    id: string;
    name: string;
  };
  
  export type User = {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
  };
 
  
  // If you can modify the ProductCard component:
// type ProductCardProps = {
//     product: {
//       id: string;
//       name: string;
//       price: number;
//       // Accept either img or imageUrl
//       img?: string;
//       imageUrl?: string;
//       // Accept different color representations
//       color?: Color;
//       colors?: Color[];
//       colorIds?: Color[];
//       // ... other properties
//     };
//     // ... other props
//   };
export type Product = {
    id: string;
    name: string;
    price: number;
    description: string;
    // Make sure to include both img and imageUrl if needed
    img: string;           // Your API seems to use this
    imageUrl?: string;     // Add if ProductCard expects this
    // Color handling options:
    color?: Color;         // Single color (if ProductCard expects this)
    colorIds: Color[];    // Array of colors (from your API)
    colors?: Color[];      // Alternative naming
    category: Category;
    rating?: number;
    count: number;
    skidka: number;
    discountedPrice: number;
    avgStars: string;
    likes: string[];
    user: {
      firstname: string;
      lastname: string;
      email: string;
    };
    comments: Comment[];
    createdAt: string;
    updatedAt?: string;
  };
 
  export type OrderCreate = {
    productId: string;
    colorIds: string[]; // Changed from colorId to colorIds
    count: number;
    // token: string;
  };
  // For order creation
 
  
  // For API responses
  export type ApiResponse<T> = {
    data: T;
    message?: string;
    success: boolean;
  };
  
  // For product list response
  export type ProductListResponse = ApiResponse<Product[]>;
  
  // For single product response
  export type ProductResponse = ApiResponse<Product>;