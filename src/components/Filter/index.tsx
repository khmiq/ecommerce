import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card } from '../ui/card';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { ProductCard } from '../Card';


type Category = {
  id: string;
  name: string;
};

type Color = {
  id: string;
  name: string;
  hexCode: string;
};

type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  img: string;
  colorIds: Color[];
  colors?: Color[];
  category: {
    id: string;
    name: string;
  };
  avgStars: string;
  createdAt: string;
  discountedPrice?: number;
};

type FilterParams = {
  name?: string;
  minPrice?: number;
  maxPrice?: number;
  categoryId?: string;
  colorId?: string;
  page?: number;
  limit?: number;
};

// type ApiResponse<T> = {
//   data?: T;
//   error?: string;
//   success: boolean;
//  };
const Filter = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<FilterParams>({
    page: 1,
    limit: 12,
  });

  //Fetch categories
  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     try {
  //       const response = await fetch('https://keldibekov.online/category?page=1&limit=10');
  //       const result: ApiResponse<Category[]> = await response.json();

  //       if (result.success && result.data) {
  //         setCategories(result.data);
  //       } else {
  //         toast.error(result.error || 'Failed to fetch categories');
  //       }
  //     } catch (error) {
  //       toast.error('Network error while fetching categories');
  //       console.error('Error fetching categories:', error);
  //     }
  //   };

  //   fetchCategories();
  // }, []);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://keldibekov.online/category?page=1&limit=10', {
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('API Response:', result);
  
        // The response has data directly in "data" property
        if (result.data) {
          setCategories(result.data);
        } else {
          toast.error('No categories found in response');
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error(error instanceof Error ? error.message : 'Network error while fetching categories');
      }
    };
  
    fetchCategories();
  }, []);
 

 

  // Fetch colors
  useEffect(() => {
    const fetchColors = async () => {
      try {
        const response = await fetch('https://keldibekov.online/color');
        const result = await response.json();

        if (Array.isArray(result)) {
          setColors(result);
        } else if (result.data && Array.isArray(result.data)) {
          setColors(result.data);
        } else if (result.colors && Array.isArray(result.colors)) {
          setColors(result.colors);
        } else {
          toast.error('Unexpected colors data format');
          console.error('Unexpected colors response:', result);
          setColors([]);
        }
      } catch (error) {
        toast.error('Failed to fetch colors');
        console.error('Error fetching colors:', error);
        setColors([]);
      }
    };

    fetchColors();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();

        if (filters.name) queryParams.append('name', filters.name);
        if (filters.minPrice) queryParams.append('minPrice', filters.minPrice.toString());
        if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice.toString());
        if (filters.categoryId) queryParams.append('categoryId', filters.categoryId);
        if (filters.colorId) queryParams.append('colorId', filters.colorId);
        queryParams.append('page', filters.page?.toString() || '1');
        queryParams.append('limit', filters.limit?.toString() || '12');

        const response = await fetch(`https://keldibekov.online/products?${queryParams.toString()}`);
        const result = await response.json();

        if (Array.isArray(result)) {
          setProducts(result);
          setTotalPages(1);
        } else if (result.products && Array.isArray(result.products)) {
          setProducts(result.products);
          setTotalPages(result.totalPages || 1);
          setPage(result.currentPage || 1);
        } else {
          toast.error('Unexpected products data format');
          console.error('Unexpected products response:', result);
          setProducts([]);
        }
      } catch (error) {
        toast.error('Failed to fetch products');
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: 1,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [name]: value === 'all' ? undefined : value,
      page: 1,
    }));
  };

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const numValue = value ? parseFloat(value) : undefined;
    setFilters(prev => ({
      ...prev,
      [`${type}Price`]: numValue,
      page: 1,
    }));
  };

  const resetFilters = () => {
    setFilters({
      page: 1,
      limit: 12,
    });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setFilters(prev => ({
        ...prev,
        page: newPage,
      }));
    }
  };

  const mockToggleLike = () => {};
  const mockAddToCart = () => {};

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-6 mb-8">
        <h2 className="text-2xl font-bold mb-6">Filter Products</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Name filter */}
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Search by name"
              value={filters.name || ''}
              onChange={handleFilterChange}
            />
          </div>

          {/* Price range */}
          <div>
            <Label>Price Range</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min price"
                value={filters.minPrice || ''}
                onChange={(e) => handlePriceChange('min', e.target.value)}
                min="0"
              />
              <Input
                type="number"
                placeholder="Max price"
                value={filters.maxPrice || ''}
                onChange={(e) => handlePriceChange('max', e.target.value)}
                min="0"
              />
            </div>
          </div>

          {/* Category filter */}
          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={filters.categoryId || 'all'}
              onValueChange={(value) => handleSelectChange('categoryId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
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
          </div>

          {/* Color filter (fixed key warning) */}
          <div>
            <Label htmlFor="color">Color</Label>
            <Select
              value={filters.colorId || 'all'}
              onValueChange={(value) => handleSelectChange('colorId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select color" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Colors</SelectItem>
                {Array.isArray(colors) &&
  colors.map((color) => {
    if (typeof color.id !== 'string') return null;

    return (
      <SelectItem key={`color-${color.id}`} value={color.id}>
        <div className="flex items-center gap-2">
          <span
            className="w-4 h-4 rounded-full inline-block"
            style={{ backgroundColor: color.hexCode || '#ccc' }}
          />
          {color.name || 'Unnamed'}
        </div>
      </SelectItem>
    );
  })}

              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end mt-6 gap-4">
          <Button variant="outline" onClick={resetFilters}>
            Reset Filters
          </Button>
          <Button onClick={() => setFilters(prev => ({ ...prev, page: 1 }))}>
            Apply Filters
          </Button>
        </div>
      </Card>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium">No products found</h3>
          <p className="text-muted-foreground">Try adjusting your filters</p>
        </div>
      ) : (
        <>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isLiked={false}
                onToggleLike={mockToggleLike}
                onAddToCart={mockAddToCart}
              />
            ))}
          </motion.div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              <Button
                variant="outline"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
              >
                Previous
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <Button
                  key={pageNum}
                  variant={pageNum === page ? 'default' : 'outline'}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </Button>
              ))}

              <Button
                variant="outline"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Filter;
