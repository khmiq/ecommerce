import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Heart, MessageSquare, ShoppingCart, Star, ChevronLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Skeleton } from '../ui/skeleton';
import toast from 'react-hot-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ChatModal } from '../ChatModal';


const API_BASE = "https://keldibekov.online";

type Product = {
  id: string;
  name: string;
  price: number;
  img: string;
  description: string;
  count: number;
  skidka: number;
  discountedPrice: number;
  avgStars: string;
  user: {
    firstname: string;
    lastname: string;
    email: string;
  };
  color: {
    name: string;
  };
  category: {
    name: string;
  };
  likes: string[];
  comments: Comment[];
  createdAt: string;
};

type Color = {
  id: string;
  name: string;
  hexCode: string;
};

type Comment = {
  id: string;
  text: string;
  star: number;
  user: {
    firstname: string;
    lastname: string;
  };
  createdAt: string;
};

const ReviewForm = ({ productId }: { productId: string }) => {
  const [commentText, setCommentText] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentText.trim()) {
      toast.error('Please enter a comment');
      return;
    }
    
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    try {
      await axios.post(`${API_BASE}/comments`, {
        text: commentText,
        star: rating,
        productId
      });
      toast.success('Review submitted successfully!');
      setCommentText('');
      setRating(0);
    } catch (error) {
      toast.error('Failed to submit review');
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 md:p-6 mb-8">
      <h3 className="text-lg font-medium mb-4">Write a Review</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Rating
          </label>
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="focus:outline-none"
              >
                <Star
                  className={`w-6 h-6 md:w-8 md:h-8 ${
                    (hoverRating || rating) >= star 
                      ? 'text-yellow-400 fill-yellow-400' 
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <Textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Share your thoughts about this product..."
            rows={4}
            className="w-full"
          />
        </div>
        <Button 
          type="submit" 
          disabled={!commentText.trim() || rating === 0}
          className="w-full sm:w-auto"
        >
          Submit Review
        </Button>
      </form>
    </div>
  );
};

 export const ReviewList = ({ comments }: { comments: Comment[] }) => {
  if (comments.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500 mb-4">No reviews yet</p>
        <Button variant="outline" asChild>
          <Link to="/login">Login to write a review</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <div key={comment.id} className="border-b pb-6 last:border-0">
          <div className="flex items-start space-x-3 mb-3">
            <Avatar>
              <AvatarFallback>
                {comment.user?.firstname?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h4 className="font-medium">
                {comment.user?.firstname} {comment.user?.lastname}
              </h4>
              <div className="flex flex-wrap items-center space-x-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i}
                      className={`w-4 h-4 ${
                        i < comment.star 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <p className="text-gray-700">{comment.text}</p>
        </div>
      ))}
    </div>
  );
};

export const ProductDetail = () => {
  const { productId } = useParams();
  const [isLiked, setIsLiked] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);
  const images = [
    "https://via.placeholder.com/800",
    "https://via.placeholder.com/800?text=Back+View",
    "https://via.placeholder.com/800?text=Side+View",
    "https://via.placeholder.com/800?text=Detail"
  ];

  const { 
    data: product, 
    isLoading, 
    isError,
    error 
  } = useQuery<Product>({
    queryKey: ['product', productId],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE}/products/${productId}`);
      return data;
    },
    retry: 2,
  });

  const { 
    data: colors = [], 
    // isLoading: isLoadingColors,
    // isError: isColorsError 
  } = useQuery<Color[]>({
    queryKey: ['colors'],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE}/color`);
      return data.data;
    },
    staleTime: 60 * 1000,
  });

  const productColor = colors.find(color => color.id) || product?.color;
 const currentUserId = "675abe14-8c68-4cac-a768-c258745aa972"
  const handleAddToCart = () => {
    if (!product) return;
    toast.success(`${product.name} added to cart`, {
      position: "top-center",
      duration: 1500,
      style: {
        background: '#10B981',
        color: '#fff',
      }
    });
  };

  const handleOrder = async () => {
    if (!productId || !selectedColor) {
      toast.error('Please select a color');
      return;
    }

    if (orderQuantity < 1) {
      toast.error('Quantity must be at least 1');
      return;
    }

    setIsOrdering(true);
    try {
      const response = await axios.post(`${API_BASE}/order`, {
        productId,
        colorId: selectedColor,
        count: orderQuantity
      }, {
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*'
        }
      });

      if (response.status === 200) {
        toast.success('Order placed successfully!');
        setIsOrderModalOpen(false);
      } else {
        throw new Error('Failed to place order');
      }
    } catch (error) {
      toast.error('Failed to place order');
      console.error('Order error:', error);
    } finally {
      setIsOrdering(false);
    }
  };

  if (isLoading) {
    return (
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

  const rating = parseFloat(product.avgStars) || 0;
  const sellerName = `${product.user?.firstname || ''} ${product.user?.lastname || ''}`.trim();
  const hasDiscount = product.skidka > 0;

  return (
    <div className="container mx-auto mt-8 px-4 py-8">
      <Link to="/" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6">
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back to all products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product Gallery */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
            <img 
              src={images[activeImage] || product.img || "https://via.placeholder.com/800"} 
              alt={product.name}
              className="w-full h-auto max-h-[500px] object-contain p-4"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                className={`rounded-md overflow-hidden border-2 ${activeImage === index ? 'border-blue-500' : 'border-transparent'}`}
              >
                <img 
                  src={img} 
                  alt={`Preview ${index + 1}`}
                  className="w-full h-20 object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <Badge variant="outline" className="mb-2">
                {product.category?.name || 'Uncategorized'}
              </Badge>
              <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
              <div className="flex items-center mt-2 space-x-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i}
                      className={`w-5 h-5 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-gray-500 text-sm">({rating.toFixed(1)})</span>
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
              <Heart className={`w-6 h-6 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {hasDiscount && (
                <>
                  <p className="text-2xl font-bold text-gray-500 line-through">${product.price.toFixed(2)}</p>
                  <p className="text-3xl font-bold text-gray-900">${product.discountedPrice.toFixed(2)}</p>
                  <Badge variant="destructive" className="text-sm px-2 py-1">
                    Save {product.skidka}%
                  </Badge>
                </>
              )}
              {!hasDiscount && (
                <p className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</p>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {productColor && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ 
                      backgroundColor: '#4ade80',
                      border: '1px solid #e5e7eb'
                    }}
                  />
                  {productColor.name || 'No color'}
                </Badge>
              )}
              <Badge variant={product.count > 0 ? 'default' : 'destructive'}>
                {product.count > 0 ? `${product.count} in stock` : 'Out of stock'}
              </Badge>
            </div>

            <p className="text-gray-700 leading-relaxed">{product.description || 'No description available'}</p>

            <div className="pt-4 border-t">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <span className="w-10 text-center">{quantity}</span>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={quantity >= product.count}
                  >
                    +
                  </Button>
                </div>
                <Button 
                  onClick={handleAddToCart}
                  disabled={product.count <= 0}
                  className="flex-1"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
                <Dialog open={isOrderModalOpen} onOpenChange={setIsOrderModalOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="default"
                      disabled={product.count <= 0}
                      className="flex-1"
                    >
                      Buy Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Order Details</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="color" className="text-right">
                          Color
                        </Label>
                        <div className="col-span-3">
                          <select
                            id="color"
                            value={selectedColor}
                            onChange={(e) => setSelectedColor(e.target.value)}
                            className="w-full p-2 border rounded-md"
                            required
                          >
                            <option value="">Select a color</option>
                            {colors.map((color) => (
                              <option key={color.id} value={color.id}>
                                {color.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="quantity" className="text-right">
                          Quantity
                        </Label>
                        <div className="col-span-3 flex items-center space-x-2">
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))}
                            disabled={orderQuantity <= 1}
                          >
                            -
                          </Button>
                          <Input
                            id="quantity"
                            type="number"
                            min="1"
                            max={product.count}
                            value={orderQuantity}
                            onChange={(e) => setOrderQuantity(Math.max(1, Math.min(product.count, Number(e.target.value))))}
                            className="w-20 text-center"
                          />
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => setOrderQuantity(Math.min(product.count, orderQuantity + 1))}
                            disabled={orderQuantity >= product.count}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => setIsOrderModalOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleOrder}
                        disabled={isOrdering || !selectedColor}
                      >
                        {isOrdering ? 'Processing...' : 'Place Order'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button 
            onClick={() => setActiveTab('description')}
            className={`border-b-2 px-1 py-4 text-sm font-medium ${
              activeTab === 'description' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Description
          </button>
          <button 
            onClick={() => setActiveTab('reviews')}
            className={`border-b-2 px-1 py-4 text-sm font-medium ${
              activeTab === 'reviews' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Reviews ({product.comments?.length || 0})
          </button>
        </nav>
      </div>
      <div className="border rounded-xl p-4 mt-6 bg-gray-50">
        <h3 className="font-medium text-lg mb-3">Seller Information</h3>
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

        <div className="grid grid-cols-2 gap-3 mt-4">
          {/* <Button variant="outline" className="w-full" asChild>
            <a href={`mailto:${product.user?.email}`}>
              <MessageSquare className="w-4 h-4 mr-2" />
              Message
            </a>
          </Button> */}
          <ChatModal 
  productId={product.id}
  // sellerEmail={product.user?.email}
  sellerName={sellerName}
  currentUserId={currentUserId}
>
  <Button variant="outline" className="w-full">
    <MessageSquare className="w-4 h-4 mr-2" />
    Message
  </Button>
</ChatModal>
          <Button variant="outline" className="w-full" asChild>
            <Link to={`/seller/${product.user}`}>
              View Shop
            </Link>
          </Button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'description' ? (
        <div className="prose max-w-none mb-12">
          <h3>Product Details</h3>
          <p>{product.description || 'No detailed description available.'}</p>
          <ul>
            <li>Color: {productColor?.name || 'Not specified'}</li>
            <li>Category: {product.category?.name || 'Not specified'}</li>
            <li>Added on: {new Date(product.createdAt).toLocaleDateString()}</li>
          </ul>
        </div>
      ) : (
        <div className="mt-6">
          <ReviewForm productId={product.id} />
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
          <ReviewList comments={product.comments || []} />
        </div>
      )}
    </div>
  );
};


