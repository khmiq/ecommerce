import { useState, useCallback, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
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
  // const _queryClient = useQueryClient();
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
    error: _categoriesError
  } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 60 * 1000,
  });

  const { 
    data: colors = [], 
    isLoading: loadingColors,
    error: _colorsError
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