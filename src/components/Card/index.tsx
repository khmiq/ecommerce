// import { Heart } from "lucide-react";
// import { Button } from "../ui/button";
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
// import { Badge } from "../ui/badge";
// import toast from 'react-hot-toast';
// import { Link } from "react-router-dom";
// import { Color } from "../Product/types/product";

// type Product = {
//   id: string;
//   name: string;
//   price: number;
//   description: string;
//   img: string;
//   colorIds: Color[];
//   colors?: Color[];
//   category: {
//     id: string;
//     name: string;
//   };
//   avgStars: string;
//   createdAt: string;
//   discountedPrice?: number;
// };

// type ProductCardProps = {
//   product: Product;
//   isLiked: boolean;
//   onToggleLike: () => void;
//   onAddToCart: () => void;
// };

// // Utility function for image fallback
// const getSafeImageUrl = (imgUrl?: string, productName?: string) => {
//   if (!imgUrl) {
//     return `https://placehold.co/300x300?text=${encodeURIComponent(productName || 'Product')}`;
//   }
//   try {
//     new URL(imgUrl);
//     return imgUrl;
//   } catch {
//     return `https://placehold.co/300x300?text=${encodeURIComponent(productName || 'Product')}`;
//   }
// };

// export const ProductCard = ({
//   product,
//   isLiked,
//   onToggleLike,
//   onAddToCart
// }: ProductCardProps) => {
//   const handleAddToCart = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     onAddToCart();
//     toast.success(`${product.name} added to cart`, {
//       duration: 2000,
//       position: "top-right",
//       icon: '🛒',
//       style: {
//         borderRadius: '10px',
//         background: '#333',
//         color: '#fff',
//       },
//     });
//   };

//   const handleBuyNow = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     toast.loading('Proceeding to checkout...', {
//       duration: 2000,
//       position: "top-right",
//       style: {
//         borderRadius: '10px',
//         background: '#333',
//         color: '#fff',
//       },
//     });
//   };

//   const handleToggleLike = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     onToggleLike();
//     toast.success(
//       isLiked ? 'Removed from favorites' : 'Added to favorites', 
//       {
//         duration: 1500,
//         position: "top-right",
//         icon: isLiked ? '❌' : '❤️',
//         style: {
//           borderRadius: '10px',
//           background: '#333',
//           color: '#fff',
//         },
//       }
//     );
//   };

//   // Calculate derived values
//   const displayPrice = product.discountedPrice || product.price;
//   const rating = parseFloat(product.avgStars) || 0;
//   const imageUrl = getSafeImageUrl(product.img, product.name);
//   const colors = product.colors || product.colorIds || [];
//   const categoryName = product.category?.name || 'Uncategorized';

//   return (
//     <Link to={`/products/${product.id}`} className="block">
//       <Card className="hover:shadow-lg transition-shadow relative h-full flex flex-col">
//         {/* Like button */}
//         <Button 
//           variant="ghost" 
//           size="icon"
//           className="absolute top-2 right-2 z-10 rounded-full hover:bg-red-50"
//           onClick={handleToggleLike}
//         >
//           <Heart className={`h-5 w-5 ${isLiked ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
//         </Button>

//         {/* Product image */}
//         <CardHeader className="p-0 flex-shrink-0">
//           <img 
//             src={imageUrl}
//             alt={product.name}
//             className="w-full h-48 object-cover rounded-t-lg"
//             loading="lazy"
//             onError={(e) => {
//               (e.target as HTMLImageElement).src = "https://placehold.co/300x300?text=Product+Image";
//             }}
//           />
//         </CardHeader>

//         {/* Product details */}
//         <CardContent className="p-4 flex-grow">
//           <CardTitle className="text-lg mb-2 line-clamp-1">{product.name}</CardTitle>
          
//           {/* Rating */}
//           <div className="flex items-center mb-2">
//             {[1, 2, 3, 4, 5].map((star) => (
//               <svg
//                 key={star}
//                 className={`w-4 h-4 ${
//                   star <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'
//                 }`}
//                 fill="currentColor"
//                 viewBox="0 0 20 20"
//               >
//                 <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//               </svg>
//             ))}
//             <span className="text-xs text-gray-500 ml-1">({rating.toFixed(1)})</span>
//           </div>

//           {/* Category and colors */}
//           <div className="flex justify-between items-center mb-2 gap-2">
//             <Badge variant="outline" className="truncate">
//               {categoryName}
//             </Badge>
//             <div className="flex gap-1">
//               {colors.slice(0, 3).map((color) => (
//                 <span 
//                   key={color.id}
//                   className="w-4 h-4 rounded-full border border-gray-200"
//                   style={{ backgroundColor: color.hexCode || '#ccc' }}
//                   title={color.name}
//                 />
//               ))}
//               {colors.length > 3 && (
//                 <span className="text-xs text-gray-500">
//                   +{colors.length - 3}
//                 </span>
//               )}
//             </div>
//           </div>

//           {/* Price */}
//           <div className="flex items-center gap-2 mt-2">
//             <p className="text-xl font-bold">${displayPrice.toFixed(2)}</p>
//             {product.discountedPrice && (
//               <p className="text-sm text-gray-500 line-through">
//                 ${product.price.toFixed(2)}
//               </p>
//             )}
//           </div>
//         </CardContent>

//         {/* Actions */}
//         <CardFooter className="flex justify-between p-4 pt-0 gap-2">
//           <Button variant="outline" className="flex-1" onClick={handleBuyNow}>
//             Buy Now
//           </Button>
//           <Button className="flex-1" onClick={handleAddToCart}>
//             Add to Cart
//           </Button>
//         </CardFooter>
//       </Card>
//     </Link>
//   );
// };

import { Heart } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import toast from 'react-hot-toast';
import { Link } from "react-router-dom";
import { Color } from "../Product/types/product";

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

type ProductCardProps = {
  product: Product;
  isLiked: boolean;
  onToggleLike: () => void;
  onAddToCart: () => void;
};

const getSafeImageUrl = (imgUrl?: string, productName?: string) => {
  if (!imgUrl) {
    return `https://placehold.co/300x300?text=${encodeURIComponent(productName || 'Product')}`;
  }
  try {
    new URL(imgUrl);
    return imgUrl;
  } catch {
    return `https://placehold.co/300x300?text=${encodeURIComponent(productName || 'Product')}`;
  }
};

export const ProductCard = ({
  product,
  isLiked,
  onToggleLike,
  onAddToCart
}: ProductCardProps) => {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onAddToCart();
    toast.success(`${product.name} added to cart`, {
      duration: 2000,
      position: "top-right",
      icon: '🛒',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    toast.loading('Proceeding to checkout...', {
      duration: 2000,
      position: "top-right",
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
  };

  const handleToggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onToggleLike();
    toast.success(
      isLiked ? 'Removed from favorites' : 'Added to favorites', 
      {
        duration: 1500,
        position: "top-right",
        icon: isLiked ? '❌' : '❤️',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      }
    );
  };

  // Calculate derived values
  const displayPrice = product.discountedPrice || product.price;
  const rating = parseFloat(product.avgStars) || 0;
  const imageUrl = getSafeImageUrl(product.img, product.name);
  const colors = product.colors || product.colorIds || [];
  const categoryName = product.category?.name || 'Uncategorized';
  const hasDiscount = product.discountedPrice !== undefined;

  return (
    <Card className="hover:shadow-lg transition-shadow relative h-full flex flex-col group">
      {/* Like button - positioned outside the Link */}
      <Button 
        variant="ghost" 
        size="icon"
        className="absolute top-2 right-2 z-10 rounded-full hover:bg-red-50"
        onClick={handleToggleLike}
      >
        <Heart className={`h-5 w-5 ${isLiked ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
      </Button>

      {/* Clickable area - wraps only image and title */}
      <Link 
        to={`/products/${product.id}`} 
        className="cursor-pointer hover:no-underline"
      >
        <CardHeader className="p-0 flex-shrink-0">
          <img 
            src={imageUrl}
            alt={product.name}
            className="w-full h-48 object-cover rounded-t-lg group-hover:opacity-90 transition-opacity"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://placehold.co/300x300?text=Product+Image";
            }}
          />
        </CardHeader>

        <CardContent className="p-4 flex-grow">
          <CardTitle className="text-lg mb-2 line-clamp-1 hover:text-primary transition-colors">
            {product.name}
          </CardTitle>
        </CardContent>
      </Link>

      {/* Non-clickable content */}
      <CardContent className="p-4 pt-0">
        {/* Rating */}
        <div className="flex items-center mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              className={`w-4 h-4 ${
                star <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="text-xs text-gray-500 ml-1">({rating.toFixed(1)})</span>
        </div>

        {/* Category and colors */}
        <div className="flex justify-between items-center mb-2 gap-2">
          <Badge variant="outline" className="truncate">
            {categoryName}
          </Badge>
          <div className="flex gap-1">
            {colors.slice(0, 3).map((color) => (
              <span 
                key={color.id}
                className="w-4 h-4 rounded-full border border-gray-200"
                style={{ backgroundColor: color.hexCode || '#ccc' }}
                title={color.name}
              />
            ))}
            {colors.length > 3 && (
              <span className="text-xs text-gray-500">
                +{colors.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mt-2">
          <p className={`text-xl font-bold ${hasDiscount ? 'text-red-500' : ''}`}>
            ${displayPrice.toFixed(2)}
          </p>
          {hasDiscount && (
            <p className="text-sm text-gray-500 line-through">
              ${product.price.toFixed(2)}
            </p>
          )}
        </div>
      </CardContent>

      {/* Actions */}
      <CardFooter className="flex justify-between p-4 pt-0 gap-2">
        <Button 
          variant="outline" 
          className="flex-1" 
          onClick={handleBuyNow}
        >
          Buy Now
        </Button>
        <Button 
          className="flex-1" 
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};