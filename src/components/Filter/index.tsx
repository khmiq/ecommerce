// import { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { useSearchParams } from "react-router-dom";
// import axios from "axios";
// import { Input } from "../../components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
// import { Button } from "../../components/ui/button";
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
// import { Badge } from "../../components/ui/badge";
// import { Heart } from "lucide-react";

// // API endpoints
// const API_BASE = "https://keldibekov.online";

// // Types
// type Category = {
//   id: string;
//   name: string;
// };

// type Color = {
//   id: string;
//   name: string;
// };

// type Product = {
//   id: string;
//   name: string;
//   price: number;
//   category: Category;
//   color: Color;
//   imageUrl: string;
//   rating: number;
//   isLiked: boolean;
// };

// // Fetch data functions
// const fetchCategories = async (): Promise<Category[]> => {
//   const { data } = await axios.get(`${API_BASE}/category`);
//   return data;
// };

// const fetchColors = async (): Promise<Color[]> => {
//   const { data } = await axios.get(`${API_BASE}/color`);
//   return data;
// };

// const fetchProducts = async (params: URLSearchParams): Promise<Product[]> => {
//   const { data } = await axios.get(`${API_BASE}/products`, { params });
//   return data.map((product: any) => ({
//     ...product,
//     isLiked: false // Default value, update from API if available
//   }));
// };

// const Filter = () => {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const [searchTerm, setSearchTerm] = useState<string>("");
//   const [minPrice, setMinPrice] = useState<string>("");
//   const [maxPrice, setMaxPrice] = useState<string>("");
//   const [selectedCategory, setSelectedCategory] = useState<string>("all");
//   const [selectedColor, setSelectedColor] = useState<string>("all");
//   const [sortBy, setSortBy] = useState<string>("price");
//   // const [order, setOrder] = useState<string>("asc");
//   const [localLikes, setLocalLikes] = useState<Record<string, boolean>>({});

//   // Fetch filter options
//   const { data: categories = [], isLoading: loadingCategories } = useQuery({
//     queryKey: ["categories"],
//     queryFn: fetchCategories,
//   });

//   const { data: colors = [], isLoading: loadingColors } = useQuery({
//     queryKey: ["colors"],
//     queryFn: fetchColors,
//   });

//   // Fetch products with current filters
//   const { data: products = [], isLoading: loadingProducts } = useQuery({
//     queryKey: ["products", searchParams.toString()],
//     queryFn: () => fetchProducts(searchParams),
//   });

//   const applyFilters = () => {
//     const params = new URLSearchParams();
//     if (searchTerm) params.set("search", searchTerm);
//     if (minPrice) params.set("minPrice", minPrice);
//     if (maxPrice) params.set("maxPrice", maxPrice);
//     if (selectedCategory !== "all") params.set("categoryId", selectedCategory);
//     if (selectedColor !== "all") params.set("colorId", selectedColor);
//     params.set("sortBy", sortBy);
//     // params.set("order", order);
//     setSearchParams(params);
//   };

//   const addToCart = (productId: string) => {
//     console.log("Added to cart:", productId);
//   };

//   const toggleLike = (productId: string) => {
//     setLocalLikes(prev => ({
//       ...prev,
//       [productId]: !prev[productId]
//     }));
//   };

//   return (
//     <div className="container mx-auto p-4">
//       {/* Filter Section */}
//       <div className="p-6 bg-white shadow-md rounded-md mb-8 space-y-4">
//         <h2 className="text-xl font-bold mb-4">Filter Products</h2>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//           {/* Search Input */}
//           <Input
//             placeholder="Search products..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />

//           {/* Min & Max Price Inputs */}
//           <Input
//             type="number"
//             placeholder="Min Price"
//             value={minPrice}
//             onChange={(e) => setMinPrice(e.target.value)}
//           />
//           <Input
//             type="number"
//             placeholder="Max Price"
//             value={maxPrice}
//             onChange={(e) => setMaxPrice(e.target.value)}
//           />

//           {/* Category Select */}
//           <Select value={selectedCategory} onValueChange={setSelectedCategory}>
//             <SelectTrigger>
//               <SelectValue placeholder="All Categories" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Categories</SelectItem>
//               {loadingCategories ? (
//                 <SelectItem value="loading" disabled>Loading...</SelectItem>
//               ) : (
//                 categories.map((category) => (
//                   <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
//                 ))
//               )}
//             </SelectContent>
//           </Select>

//           {/* Color Select */}
//           <Select value={selectedColor} onValueChange={setSelectedColor}>
//             <SelectTrigger>
//               <SelectValue placeholder="All Colors" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Colors</SelectItem>
//               {loadingColors ? (
//                 <SelectItem value="loading" disabled>Loading...</SelectItem>
//               ) : (
//                 colors.map((color) => (
//                   <SelectItem key={color.id} value={color.id}>{color.name}</SelectItem>
//                 ))
//               )}
//             </SelectContent>
//           </Select>

//           {/* Sorting Select */}
//           <Select value={sortBy} onValueChange={setSortBy}>
//             <SelectTrigger>
//               <SelectValue placeholder="Sort By" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="price">Price</SelectItem>
//               <SelectItem value="name">Name</SelectItem>
//               <SelectItem value="createdAt">Newest</SelectItem>
//               <SelectItem value="rating">Rating</SelectItem>
//             </SelectContent>
//           </Select>

//           {/* Order Select */}
//           {/* <Select value={order} onValueChange={setOrder}>
//             <SelectTrigger>
//               <SelectValue placeholder="Order" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="asc">Ascending</SelectItem>
//               <SelectItem value="desc">Descending</SelectItem>
//             </SelectContent>
//           </Select> */}
//         </div>

//         {/* Apply Button */}
//         <div className="flex justify-end">
//           <Button onClick={applyFilters} className="w-full md:w-auto">
//             Apply Filters
//           </Button>
//         </div>
//       </div>

//       {/* Products Section */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//         {loadingProducts ? (
//           <div className="col-span-full text-center">Loading products...</div>
//         ) : products.length === 0 ? (
//           <div className="col-span-full text-center">No products found</div>
//         ) : (
//           products.map((product) => (
//             <Card key={product.id} className="hover:shadow-lg transition-shadow relative">
//               {/* Like button */}
//               <Button 
//                 variant="ghost" 
//                 size="icon"
//                 className="absolute top-2 right-2 z-10 rounded-full"
//                 onClick={() => toggleLike(product.id)}
//               >
//                 <Heart 
//                   className={`h-5 w-5 ${
//                     localLikes[product.id] ? "fill-red-500 text-red-500" : "text-gray-400"
//                   }`} 
//                 />
//               </Button>

//               {/* Product image */}
//               <CardHeader className="p-0">
//                 <img 
//                   src={product.imageUrl || "https://via.placeholder.com/300"} 
//                   alt={product.name}
//                   className="w-full h-48 object-cover rounded-t-lg"
//                 />
//               </CardHeader>

//               <CardContent className="p-4">
//                 <CardTitle className="text-lg mb-2">{product.name}</CardTitle>
                
//                 {/* Rating stars */}
//                 <div className="flex items-center mb-2">
//                   {[1, 2, 3, 4, 5].map((star) => (
//                     <svg
//                       key={star}
//                       className={`w-4 h-4 ${
//                         star <= product.rating ? 'text-yellow-400' : 'text-gray-300'
//                       }`}
//                       fill="currentColor"
//                       viewBox="0 0 20 20"
//                     >
//                       <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                     </svg>
//                   ))}
//                   <span className="text-xs text-gray-500 ml-1">({product.rating})</span>
//                 </div>

//                 <div className="flex justify-between items-center mb-2">
//                   <Badge variant="outline">{product.category.name}</Badge>
//                   <Badge variant="outline">{product.color.name}</Badge>
//                 </div>
//                 <p className="text-xl font-bold">${product.price.toFixed(2)}</p>
//               </CardContent>

//               <CardFooter className="flex justify-between p-4 pt-0">
//                 <Button variant="outline">Buy Now</Button>
//                 <Button onClick={() => addToCart(product.id)}>Add to Cart</Button>
//               </CardFooter>
//             </Card>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default Filter;
import { useState, useCallback, useMemo, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { ProductCard } from "../Card";
import { Skeleton } from "../ui/skeleton";
import toast from "react-hot-toast";

const API_BASE = "https://keldibekov.online";

type Category = {
  id: string;
  name: string;
};

type Color = {
  id: string;
  name: string;
};

type Product = {
  id: string;
  name: string;
  price: number;
  category: Category;
  color: Color;
  imageUrl: string;
  rating: number;
};

const fetchCategories = async (): Promise<Category[]> => {
  const { data } = await axios.get(`${API_BASE}/category`);
  return Array.isArray(data) ? data : [];
};

const fetchColors = async (): Promise<Color[]> => {
  const { data } = await axios.get(`${API_BASE}/color`);
  return Array.isArray(data) ? data : [];
};

const fetchProducts = async (params: URLSearchParams): Promise<Product[]> => {
  const queryParams = Object.fromEntries(params.entries());
  const { data } = await axios.get(`${API_BASE}/products`, { params: queryParams });
  return Array.isArray(data) ? data : [];
};

export const Filter = () => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Initialize state from URL params
  const [localFilters, setLocalFilters] = useState({
    search: searchParams.get("search") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    categoryId: searchParams.get("categoryId") || "all",
    colorId: searchParams.get("colorId") || "all",
  });
  
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "price");
  const [localLikes, setLocalLikes] = useState<Record<string, boolean>>({});

  // Sync state with URL params on mount
  useEffect(() => {
    setLocalFilters({
      search: searchParams.get("search") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      categoryId: searchParams.get("categoryId") || "all",
      colorId: searchParams.get("colorId") || "all",
    });
    setSortBy(searchParams.get("sortBy") || "price");
  }, [searchParams]);

  // Fetch data
  const { 
    data: categories = [], 
    isLoading: loadingCategories,
    error: categoriesError
  } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 60 * 1000,
  });

  const { 
    data: colors = [], 
    isLoading: loadingColors,
    error: colorsError
  } = useQuery<Color[]>({
    queryKey: ["colors"],
    queryFn: fetchColors,
    staleTime: 60 * 1000,
  });

  const { 
    data: products = [], 
    isLoading: loadingProducts, 
    isError: productsError
  } = useQuery<Product[]>({
    queryKey: ["products", searchParams.toString()],
    queryFn: () => fetchProducts(searchParams),
    retry: 2,
  });

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams();
    
    if (localFilters.search) params.set("search", localFilters.search);
    if (localFilters.minPrice) params.set("minPrice", localFilters.minPrice);
    if (localFilters.maxPrice) params.set("maxPrice", localFilters.maxPrice);
    if (localFilters.categoryId !== "all") params.set("categoryId", localFilters.categoryId);
    if (localFilters.colorId !== "all") params.set("colorId", localFilters.colorId);
    params.set("sortBy", sortBy);
    
    setSearchParams(params);
    toast.success("Filters applied");
  }, [localFilters, sortBy, setSearchParams]);

  const resetFilters = useCallback(() => {
    setSearchParams(new URLSearchParams());
    toast.success("Filters reset");
  }, [setSearchParams]);

  const handleInputChange = useCallback((field: string, value: string) => {
    setLocalFilters(prev => ({ ...prev, [field]: value }));
  }, []);

  const addToCart = useCallback((productId: string) => {
    console.log("Added to cart:", productId);
    toast.success("Product added to cart");
  }, []);

  const toggleLike = useCallback((productId: string) => {
    setLocalLikes(prev => ({ ...prev, [productId]: !prev[productId] }));
  }, []);

  const isLoading = useMemo(
    () => loadingCategories || loadingColors || loadingProducts,
    [loadingCategories, loadingColors, loadingProducts]
  );

  const renderProductGrid = useMemo(() => {
    if (isLoading) {
      return Array(8).fill(0).map((_, index) => (
        <Skeleton key={index} className="h-64 w-full rounded-md" />
      ));
    }

    if (productsError) {
      return <div className="col-span-full text-center text-red-500">Error loading products</div>;
    }

    if (products.length === 0) {
      return <div className="col-span-full text-center">No products found</div>;
    }

    return products.map((product) => (
      <ProductCard
        key={product.id}
        product={product}
        isLiked={!!localLikes[product.id]}
        onToggleLike={() => toggleLike(product.id)}
        onAddToCart={() => addToCart(product.id)}
      />
    ));
  }, [isLoading, productsError, products, localLikes, toggleLike, addToCart]);

  return (
    <div className="container mx-auto p-4">
      <div className="p-6 bg-white shadow-md rounded-md mb-8 space-y-4">
        <h2 className="text-xl font-bold mb-4">Filter Products</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            placeholder="Search products..."
            value={localFilters.search}
            onChange={(e) => handleInputChange('search', e.target.value)}
          />

          <Input
            type="number"
            placeholder="Min Price"
            value={localFilters.minPrice}
            onChange={(e) => handleInputChange('minPrice', e.target.value)}
            min="0"
          />

          <Input
            type="number"
            placeholder="Max Price"
            value={localFilters.maxPrice}
            onChange={(e) => handleInputChange('maxPrice', e.target.value)}
            min={localFilters.minPrice || "0"}
          />

          <Select 
            value={localFilters.categoryId} 
            onValueChange={(value) => handleInputChange('categoryId', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select 
            value={localFilters.colorId} 
            onValueChange={(value) => handleInputChange('colorId', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Colors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Colors</SelectItem>
              {colors.map((color) => (
                <SelectItem key={color.id} value={color.id}>
                  {color.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price">Price</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="createdAt">Newest</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end gap-2">
          <Button 
            variant="outline"
            onClick={resetFilters}
          >
            Reset
          </Button>
          <Button 
            onClick={applyFilters}
            disabled={isLoading}
          >
            Apply Filters
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {renderProductGrid}
      </div>
    </div>
  );
};

export default Filter;