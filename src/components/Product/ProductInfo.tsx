import { useState } from 'react';
import { Product } from './types/product';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Heart, ShoppingCart, Star, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export const ProductInfo = ({ 
  product, 
  onOrderClick 
}: { 
  product: Product; 
  onOrderClick: () => void 
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [quantity, setQuantity] = useState(1);
  
  const productRating = parseFloat(product.avgStars) || 0;
  const sellerName = `${product.user?.firstname || ''} ${product.user?.lastname || ''}`.trim();
  const hasDiscount = product.skidka > 0;

  const handleAddToCart = () => {
    toast.success(`${product.name} added to cart`, {
      position: "top-center",
      duration: 1500,
      style: {
        background: '#10B981',
        color: '#fff',
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <Badge variant="outline" className="mb-2">
            {product.category?.name || 'Uncategorized'}
          </Badge>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{product.name}</h1>
          <div className="flex items-center mt-2 space-x-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i}
                  className={`w-4 h-4 md:w-5 md:h-5 ${i < productRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span className="text-gray-500 text-sm">({productRating.toFixed(1)})</span>
            <span className="text-gray-500 text-sm">•</span>
            <span className="text-gray-500 text-sm">{product.likes?.length || 0} likes</span>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setIsLiked(!isLiked)}
          className="rounded-full"
        >
          <Heart className={`w-5 h-5 md:w-6 md:h-6 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {hasDiscount && (
            <>
              <p className="text-xl md:text-2xl font-bold text-gray-500 line-through">${product.price.toFixed(2)}</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl md:text-3xl font-bold text-gray-900">${product.discountedPrice.toFixed(2)}</p>
                <Badge variant="destructive" className="text-sm px-2 py-1">
                  Save {product.skidka}%
                </Badge>
              </div>
            </>
          )}
          {!hasDiscount && (
            <p className="text-2xl md:text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</p>
          )}
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {product.colorIds?.length > 0 ? (
            product.colorIds.map(colors => (
              <Badge key={colors.id} variant="outline" className="flex items-center gap-1">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: colors.hexCode || '#4ade80' }}
                />
                {colors.name}
              </Badge>
            ))
          ) : (
            <Badge variant="outline">No colors specified</Badge>
          )}
          <Badge variant={product.count > 0 ? 'default' : 'destructive'}>
            {product.count > 0 ? `${product.count} in stock` : 'Out of stock'}
          </Badge>
        </div>

        <p className="text-gray-700 leading-relaxed">{product.description || 'No description available'}</p>

        <div className="pt-4 border-t">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="flex-1 sm:flex-none"
              >
                -
              </Button>
              <span className="w-10 text-center">{quantity}</span>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
                disabled={quantity >= product.count}
                className="flex-1 sm:flex-none"
              >
                +
              </Button>
            </div>
            <Button 
              onClick={handleAddToCart}
              disabled={product.count <= 0}
              variant="outline"
              className="w-full sm:w-auto flex-1"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
            <Button 
              onClick={onOrderClick}
              disabled={product.count <= 0}
              className="w-full sm:w-auto flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Buy Now
            </Button>
          </div>
        </div>
      </div>

      {/* Seller Information */}
      <div className="border rounded-xl p-4 mt-6 bg-gray-50">
        <h3 className="font-medium text-lg mb-3">Seller Information</h3>
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarFallback>
                {sellerName ? sellerName.charAt(0).toUpperCase() : 'S'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h4 className="font-medium">{sellerName || 'Unknown Seller'}</h4>
              <p className="text-sm text-gray-600">{product.user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:ml-auto">
            <Button variant="outline" className="w-full" asChild>
              <a href={`mailto:${product.user?.email}`}>
                <MessageSquare className="w-4 h-4 mr-2" />
                Message
              </a>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link to={`/seller/${product.user}`}>
                View Shop
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};