import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Heart, MessageSquare, Phone, ShoppingCart, Star, ChevronLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import toast from 'react-hot-toast';
import { Skeleton } from '../ui/skeleton';

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
  comments: any[];
  createdAt: string;
};

export const ProductDetail = () => {
  const { productId } = useParams();
  const [isLiked, setIsLiked] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
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
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
            <path d="M16 16h5v5"/>
          </svg>
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
              <Badge variant="outline" className="flex items-center gap-1">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: '#4ade80' }} // Replace with actual color if available
                />
                {product.color?.name || 'No color'}
              </Badge>
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
              </div>
            </div>
          </div>

          {/* Seller Information */}
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

      {/* Product Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button className="border-b-2 border-blue-500 text-blue-600 px-1 py-4 text-sm font-medium">
            Description
          </button>
          <button className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 px-1 py-4 text-sm font-medium">
            Specifications
          </button>
          <button className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 px-1 py-4 text-sm font-medium">
            Reviews ({product.comments?.length || 0})
          </button>
        </nav>
      </div>

      {/* Description Section */}
      <div className="prose max-w-none mb-12">
        <h3>Product Details</h3>
        <p>{product.description || 'No detailed description available.'}</p>
        <ul>
          <li>Color: {product.color?.name || 'Not specified'}</li>
          <li>Category: {product.category?.name || 'Not specified'}</li>
          <li>Added on: {new Date(product.createdAt).toLocaleDateString()}</li>
        </ul>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
        
        {product.comments?.length ? (
          <div className="space-y-6">
            {product.comments.map((comment: any) => (
              <div key={comment.id} className="border-b pb-6 last:border-0">
                <div className="flex items-center space-x-3 mb-3">
                  <Avatar>
                    <AvatarFallback>{comment.user?.name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{comment.user?.name || 'Anonymous'}</h4>
                    <div className="flex items-center space-x-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i}
                            className={`w-4 h-4 ${i < (comment.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
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
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 mb-4">No reviews yet</p>
            <Button variant="outline">Be the first to review</Button>
          </div>
        )}
      </div>
    </div>
  );
};


// import { useState, useEffect, useRef } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import { useQuery } from '@tanstack/react-query';
// import axios from 'axios';
// import { Heart, MessageSquare, Phone, ShoppingCart, Star, ChevronLeft, X, Paperclip, Smile, Send } from 'lucide-react';
// import { Button } from '../ui/button';
// import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
// import { Badge } from '../ui/badge';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
// import { Input } from '../ui/input';
// import { Textarea } from '../ui/textarea';
// import toast from 'react-hot-toast';
// import { Skeleton } from '../ui/skeleton';
// import EmojiPicker from 'emoji-picker-react';

// const API_BASE = "https://keldibekov.online";

// type Product = {
//   id: string;
//   name: string;
//   price: number;
//   img: string;
//   description: string;
//   count: number;
//   skidka: number;
//   discountedPrice: number;
//   avgStars: string;
//   user: {
//     id: string;
//     firstname: string;
//     lastname: string;
//     email: string;
//     avatar?: string;
//   };
//   color: {
//     name: string;
//     hex?: string;
//   };
//   category: {
//     name: string;
//   };
//   likes: string[];
//   comments: any[];
//   createdAt: string;
// };

// type ChatMessage = {
//   id: string | number;
//   text: string;
//   sender: 'user' | 'seller';
//   timestamp: Date;
//   status?: 'sent' | 'delivered' | 'read';
// };

// export const ProductDetail = () => {
//   const { productId } = useParams();
//   const [isLiked, setIsLiked] = useState(false);
//   const [quantity, setQuantity] = useState(1);
//   const [activeImage, setActiveImage] = useState(0);
//   const [isChatOpen, setIsChatOpen] = useState(false);
//   const [message, setMessage] = useState('');
//   const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
//   const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const textareaRef = useRef<HTMLTextAreaElement>(null);

//   const images = [
//     product?.img || "https://via.placeholder.com/800",
//     "https://via.placeholder.com/800?text=Back+View",
//     "https://via.placeholder.com/800?text=Side+View",
//     "https://via.placeholder.com/800?text=Detail"
//   ];

//   const { 
//     data: product, 
//     isLoading, 
//     isError,
//     error 
//   } = useQuery<Product>({
//     queryKey: ['product', productId],
//     queryFn: async () => {
//       const { data } = await axios.get(`${API_BASE}/products/${productId}`);
//       return data;
//     },
//     retry: 2,
//   });

//   // Auto-scroll to bottom of chat
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [chatMessages]);

//   // Focus textarea when chat opens
//   useEffect(() => {
//     if (isChatOpen && textareaRef.current) {
//       setTimeout(() => textareaRef.current?.focus(), 100);
//     }
//   }, [isChatOpen]);

//   const handleAddToCart = () => {
//     if (!product) return;
//     toast.success(`${product.name} added to cart`, {
//       position: "top-center",
//       duration: 1500,
//       style: {
//         background: '#10B981',
//         color: '#fff',
//       }
//     });
//   };

//   const handleSendMessage = () => {
//     if (!message.trim()) return;
    
//     const newMessage: ChatMessage = {
//       id: Date.now(),
//       text: message,
//       sender: 'user',
//       timestamp: new Date(),
//       status: 'sent'
//     };
    
//     setChatMessages(prev => [...prev, newMessage]);
//     setMessage('');
//     setIsEmojiPickerOpen(false);
    
//     // Simulate seller reply after 1-3 seconds
//     const replyDelay = 1000 + Math.random() * 2000;
    
//     setTimeout(() => {
//       setChatMessages(prev => [
//         ...prev.map(msg => msg.id === newMessage.id ? {...msg, status: 'read'} : msg),
//         {
//           id: Date.now() + 1,
//           text: getSellerReply(message, product?.name || 'the product'),
//           sender: 'seller',
//           timestamp: new Date(),
//           status: 'delivered'
//         }
//       ]);
//     }, replyDelay);
//   };

//   const getSellerReply = (userMessage: string, productName: string) => {
//     const replies = [
//       `Thanks for your message about ${productName}! I'll get back to you soon.`,
//       `I appreciate your interest in ${productName}. How can I help you further?`,
//       `Regarding ${productName}, we have that in stock. Would you like to make an offer?`,
//       `Hello! Yes, ${productName} is available. When would you like to purchase it?`,
//       `Thanks for reaching out about ${productName}. It's one of our best sellers!`
//     ];
//     return replies[Math.floor(Math.random() * replies.length)];
//   };

//   const openChat = () => {
//     setIsChatOpen(true);
//     if (chatMessages.length === 0) {
//       setChatMessages([
//         {
//           id: 1,
//           text: `Hello! You're chatting with ${product?.user?.firstname || 'the seller'} about ${product?.name}. How can I help?`,
//           sender: 'seller',
//           timestamp: new Date(),
//           status: 'read'
//         }
//       ]);
//     }
//   };

//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   const addEmoji = (emojiData: any) => {
//     setMessage(prev => prev + emojiData.emoji);
//     setIsEmojiPickerOpen(false);
//   };

//   if (isLoading) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           <Skeleton className="w-full h-[500px] rounded-xl" />
//           <div className="space-y-6">
//             <Skeleton className="h-10 w-3/4" />
//             <Skeleton className="h-6 w-1/2" />
//             <div className="flex gap-2">
//               <Skeleton className="h-8 w-20" />
//               <Skeleton className="h-8 w-20" />
//             </div>
//             <Skeleton className="h-32 w-full" />
//             <Skeleton className="h-12 w-full" />
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="container mx-auto px-4 py-8 text-center">
//         <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 max-w-md mx-auto">
//           Error loading product: {error instanceof Error ? error.message : 'Unknown error'}
//         </div>
//         <Button 
//           variant="outline" 
//           onClick={() => window.location.reload()}
//           className="gap-2"
//         >
//           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//             <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
//             <path d="M3 3v5h5"/>
//             <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
//             <path d="M16 16h5v5"/>
//           </svg>
//           Try Again
//         </Button>
//       </div>
//     );
//   }

//   if (!product) {
//     return (
//       <div className="container mx-auto px-4 py-8 text-center">
//         <div className="bg-blue-50 border border-blue-200 text-blue-600 px-4 py-3 rounded-lg mb-4 max-w-md mx-auto">
//           Product not found
//         </div>
//         <Link to="/products">
//           <Button variant="outline" className="gap-2">
//             <ChevronLeft className="w-4 h-4" />
//             Back to Products
//           </Button>
//         </Link>
//       </div>
//     );
//   }

//   const rating = parseFloat(product.avgStars) || 0;
//   const sellerName = `${product.user?.firstname || ''} ${product.user?.lastname || ''}`.trim();
//   const hasDiscount = product.skidka > 0;

//   return (
//     <div className="container mx-auto px-4 py-8">
//       {/* Chat Modal */}
//       <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
//         <DialogContent className="max-w-md h-[80vh] flex flex-col p-0">
//           <DialogHeader className="border-b p-4">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <Avatar>
//                   {product.user?.avatar ? (
//                     <AvatarImage src={product.user.avatar} />
//                   ) : (
//                     <AvatarFallback>
//                       {sellerName ? sellerName.charAt(0).toUpperCase() : 'S'}
//                     </AvatarFallback>
//                   )}
//                 </Avatar>
//                 <div>
//                   <DialogTitle>Chat with {sellerName || 'Seller'}</DialogTitle>
//                   <p className="text-xs text-gray-500">
//                     {product.user?.isOnline ? 'Online now' : 'Last seen recently'}
//                   </p>
//                 </div>
//               </div>
//               <Button 
//                 variant="ghost" 
//                 size="icon" 
//                 onClick={() => setIsChatOpen(false)}
//               >
//                 <X className="w-4 h-4" />
//               </Button>
//             </div>
//           </DialogHeader>
          
//           <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
//             {chatMessages.map((msg) => (
//               <div 
//                 key={msg.id} 
//                 className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
//               >
//                 <div 
//                   className={`max-w-[80%] rounded-lg p-3 flex flex-col ${msg.sender === 'user' 
//                     ? 'bg-blue-500 text-white rounded-br-none' 
//                     : 'bg-white border text-gray-800 rounded-bl-none shadow-sm'}`}
//                 >
//                   <p className="whitespace-pre-wrap">{msg.text}</p>
//                   <div className="flex items-center justify-end gap-2 mt-1">
//                     <span className="text-xs opacity-70">
//                       {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                     </span>
//                     {msg.sender === 'user' && (
//                       <span className="text-xs">
//                         {msg.status === 'read' ? '✓✓' : msg.status === 'delivered' ? '✓' : ''}
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//             <div ref={messagesEndRef} />
//           </div>
          
//           <div className="border-t p-3 bg-white">
//             <div className="relative">
//               <Textarea
//                 ref={textareaRef}
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 placeholder="Type your message..."
//                 onKeyDown={handleKeyDown}
//                 className="pr-20 resize-none"
//                 rows={1}
//               />
//               <div className="absolute right-2 bottom-2 flex gap-1">
//                 <Button 
//                   variant="ghost" 
//                   size="icon" 
//                   className="h-8 w-8"
//                   onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
//                 >
//                   <Smile className="w-4 h-4" />
//                 </Button>
//                 <Button 
//                   variant="ghost" 
//                   size="icon" 
//                   className="h-8 w-8"
//                   disabled
//                   title="Coming soon"
//                 >
//                   <Paperclip className="w-4 h-4" />
//                 </Button>
//                 <Button 
//                   size="icon" 
//                   className="h-8 w-8"
//                   onClick={handleSendMessage}
//                   disabled={!message.trim()}
//                 >
//                   <Send className="w-4 h-4" />
//                 </Button>
//               </div>
//             </div>
//             {isEmojiPickerOpen && (
//               <div className="absolute bottom-16 right-0 z-10">
//                 <EmojiPicker 
//                   width={300}
//                   height={350}
//                   onEmojiClick={addEmoji}
//                   previewConfig={{ showPreview: false }}
//                 />
//               </div>
//             )}
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* Back button */}
//       <Link to="/products" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6">
//         <ChevronLeft className="w-4 h-4 mr-1" />
//         Back to all products
//       </Link>

//       {/* Product content */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
//         {/* Product Gallery */}
//         <div className="space-y-4">
//           <div className="bg-white rounded-xl shadow-sm overflow-hidden border relative">
//             <img 
//               src={images[activeImage]} 
//               alt={product.name}
//               className="w-full h-auto max-h-[500px] object-contain p-4"
//             />
//             {hasDiscount && (
//               <Badge variant="destructive" className="absolute top-3 left-3">
//                 -{product.skidka}%
//               </Badge>
//             )}
//           </div>
//           <div className="grid grid-cols-4 gap-2">
//             {images.map((img, index) => (
//               <button
//                 key={index}
//                 onClick={() => setActiveImage(index)}
//                 className={`rounded-md overflow-hidden border-2 ${activeImage === index ? 'border-blue-500' : 'border-transparent'}`}
//               >
//                 <img 
//                   src={img} 
//                   alt={`Preview ${index + 1}`}
//                   className="w-full h-20 object-cover"
//                 />
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Product Info */}
//         <div className="space-y-6">
//           <div className="flex justify-between items-start">
//             <div>
//               <Badge variant="outline" className="mb-2">
//                 {product.category?.name || 'Uncategorized'}
//               </Badge>
//               <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
//               <div className="flex items-center mt-2 space-x-2">
//                 <div className="flex">
//                   {[...Array(5)].map((_, i) => (
//                     <Star 
//                       key={i}
//                       className={`w-5 h-5 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
//                     />
//                   ))}
//                 </div>
//                 <span className="text-gray-500 text-sm">({rating.toFixed(1)})</span>
//                 <span className="text-gray-500 text-sm">•</span>
//                 <span className="text-gray-500 text-sm">{product.likes?.length || 0} likes</span>
//               </div>
//             </div>
//             <Button 
//               variant="ghost" 
//               size="icon"
//               onClick={() => setIsLiked(!isLiked)}
//               className="rounded-full"
//             >
//               <Heart className={`w-6 h-6 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
//             </Button>
//           </div>

//           <div className="space-y-4">
//             <div className="flex items-center gap-4">
//               {hasDiscount && (
//                 <>
//                   <p className="text-2xl font-bold text-gray-500 line-through">${product.price.toFixed(2)}</p>
//                   <p className="text-3xl font-bold text-gray-900">${product.discountedPrice.toFixed(2)}</p>
//                 </>
//               )}
//               {!hasDiscount && (
//                 <p className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</p>
//               )}
//             </div>
            
//             <div className="flex items-center gap-2">
//               <Badge variant="outline" className="flex items-center gap-1">
//                 {product.color?.hex && (
//                   <div 
//                     className="w-3 h-3 rounded-full" 
//                     style={{ backgroundColor: product.color.hex }}
//                   />
//                 )}
//                 {product.color?.name || 'No color'}
//               </Badge>
//               <Badge variant={product.count > 0 ? 'default' : 'destructive'}>
//                 {product.count > 0 ? `${product.count} in stock` : 'Out of stock'}
//               </Badge>
//             </div>

//             <p className="text-gray-700 leading-relaxed">{product.description || 'No description available'}</p>

//             <div className="pt-4 border-t">
//               <div className="flex items-center space-x-4">
//                 <div className="flex items-center space-x-2">
//                   <Button 
//                     variant="outline" 
//                     size="icon"
//                     onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                     disabled={quantity <= 1}
//                   >
//                     -
//                   </Button>
//                   <span className="w-10 text-center">{quantity}</span>
//                   <Button 
//                     variant="outline" 
//                     size="icon"
//                     onClick={() => setQuantity(quantity + 1)}
//                     disabled={quantity >= product.count}
//                   >
//                     +
//                   </Button>
//                 </div>
//                 <Button 
//                   onClick={handleAddToCart}
//                   disabled={product.count <= 0}
//                   className="flex-1"
//                 >
//                   <ShoppingCart className="w-4 h-4 mr-2" />
//                   Add to Cart
//                 </Button>
//               </div>
//             </div>
//           </div>

//           {/* Seller Information */}
//           <div className="border rounded-xl p-4 mt-6 bg-gray-50">
//             <h3 className="font-medium text-lg mb-3">Seller Information</h3>
//             <div className="flex items-center space-x-4">
//               <Avatar>
//                 {product.user?.avatar ? (
//                   <AvatarImage src={product.user.avatar} />
//                 ) : (
//                   <AvatarFallback>
//                     {sellerName ? sellerName.charAt(0).toUpperCase() : 'S'}
//                   </AvatarFallback>
//                 )}
//               </Avatar>
//               <div className="flex-1">
//                 <h4 className="font-medium">{sellerName || 'Unknown Seller'}</h4>
//                 <p className="text-sm text-gray-600">{product.user?.email}</p>
//                 <div className="flex items-center mt-1">
//                   <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
//                   <span className="text-sm ml-1">4.8 (120 reviews)</span>
//                 </div>
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-3 mt-4">
//               <Button 
//                 variant="outline" 
//                 className="w-full"
//                 onClick={openChat}
//               >
//                 <MessageSquare className="w-4 h-4 mr-2" />
//                 Message
//               </Button>
//               <Button variant="outline" className="w-full" asChild>
//                 <Link to={`/seller/${product.user?.id}`}>
//                   View Shop
//                 </Link>
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Product Tabs */}
//       <div className="border-b border-gray-200 mb-6">
//         <nav className="-mb-px flex space-x-8">
//           <button className="border-b-2 border-blue-500 text-blue-600 px-1 py-4 text-sm font-medium">
//             Description
//           </button>
//           <button className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 px-1 py-4 text-sm font-medium">
//             Specifications
//           </button>
//           <button className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 px-1 py-4 text-sm font-medium">
//             Reviews ({product.comments?.length || 0})
//           </button>
//         </nav>
//       </div>

//       {/* Description Section */}
//       <div className="prose max-w-none mb-12">
//         <h3 className="text-xl font-semibold mb-4">Product Details</h3>
//         <p>{product.description || 'No detailed description available.'}</p>
//         <ul className="mt-4 space-y-2">
//           <li className="flex">
//             <span className="text-gray-600 w-32">Color</span>
//             <span>{product.color?.name || 'Not specified'}</span>
//           </li>
//           <li className="flex">
//             <span className="text-gray-600 w-32">Category</span>
//             <span>{product.category?.name || 'Not specified'}</span>
//           </li>
//           <li className="flex">
//             <span className="text-gray-600 w-32">Added on</span>
//             <span>{new Date(product.createdAt).toLocaleDateString()}</span>
//           </li>
//           <li className="flex">
//             <span className="text-gray-600 w-32">Seller</span>
//             <span>{sellerName || 'Not specified'}</span>
//           </li>
//         </ul>
//       </div>

//       {/* Reviews Section */}
//       <div className="mt-12">
//         <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
        
//         {product.comments?.length ? (
//           <div className="space-y-6">
//             {product.comments.map((comment: any) => (
//               <div key={comment.id} className="border-b pb-6 last:border-0">
//                 <div className="flex items-center space-x-3 mb-3">
//                   <Avatar>
//                     <AvatarFallback>{comment.user?.name?.charAt(0) || 'U'}</AvatarFallback>
//                   </Avatar>
//                   <div>
//                     <h4 className="font-medium">{comment.user?.name || 'Anonymous'}</h4>
//                     <div className="flex items-center space-x-1">
//                       <div className="flex">
//                         {[...Array(5)].map((_, i) => (
//                           <Star 
//                             key={i}
//                             className={`w-4 h-4 ${i < (comment.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
//                           />
//                         ))}
//                       </div>
//                       <span className="text-xs text-gray-500">
//                         {new Date(comment.createdAt).toLocaleDateString()}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//                 <p className="text-gray-700">{comment.text}</p>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-12 bg-gray-50 rounded-lg">
//             <p className="text-gray-500 mb-4">No reviews yet</p>
//             <Button variant="outline">Be the first to review</Button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };