import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {  useColors } from './hooks/useColors';
import { useProduct } from './hooks/useProduct';
import { ProductGallery } from './ProductGallery';
import { ProductInfo } from './ProductInfo';
import { ProductTabs } from './ProductTabs';
import { OrderModal } from './OrderModal';
import { Skeleton } from '../ui/skeleton';
import { Button } from '../ui/button';
import { ChevronLeft } from 'lucide-react';
// import toast from 'react-hot-toast';

 const ProductDetail = () => {
  const { productId } = useParams();
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  
  const { data: product, isLoading, isError, error } = useProduct(productId || '');
  const { data: colors = [], isLoading: loadingColors } = useColors();

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 max-w-md mx-auto">
          Error loading product: {error instanceof Error ? error.message : 'Unknown error'}
        </div>
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
          className="gap-2"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center mt-8">
        <div className="bg-blue-50 border border-blue-200 text-blue-600 px-4 py-3 rounded-lg mb-4 max-w-md mx-auto">
          Product not found
        </div>
        <Link to="/">
          <Button variant="outline" className="gap-2">
            <ChevronLeft className="w-4 h-4" />
            Back to Products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-8 px-4 py-8">
      <Link to="/" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6">
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back to all products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <ProductGallery product={product} />
        <ProductInfo 
          product={product} 
          onOrderClick={() => setIsOrderModalOpen(true)} 
        />
      </div>

      <ProductTabs 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        product={product} 
      />

     

<OrderModal
  isOpen={isOrderModalOpen}
  onOpenChange={setIsOrderModalOpen}
  product={product}
  colors={colors}
  loadingColors={loadingColors}
/>
    </div>
  );
};

const ProductDetailSkeleton = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Skeleton className="w-full h-[500px] rounded-xl" />
      <div className="space-y-6">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  </div>
);

export default ProductDetail