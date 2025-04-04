// import { Heart } from "lucide-react";
// import { Button } from "../ui/button";
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
// import { Badge } from "../ui/badge";
// import toast from 'react-hot-toast';

// type Product = {
//   id: string;
//   name: string;
//   price: number;
//   category: {
//     name: string;
//   };
//   color: {
//     name: string;
//     id: string;
//   };
//   imageUrl: string;
//   rating: number;
// };

// type ProductCardProps = {
//   product: Product;
//   isLiked: boolean;
//   onToggleLike: () => void;
//   onAddToCart: () => void;
// };

// export const ProductCard = ({
//   product,
//   isLiked,
//   onToggleLike,
//   onAddToCart
// }: ProductCardProps) => {
//   const handleAddToCart = () => {
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

//   const handleBuyNow = () => {
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

//   const handleToggleLike = () => {
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

//   return (
//     <Card className="hover:shadow-lg transition-shadow relative">
//       <Button 
//         variant="ghost" 
//         size="icon"
//         className="absolute top-2 right-2 z-10 rounded-full hover:bg-red-50"
//         onClick={handleToggleLike}
//       >
//         <Heart className={`h-5 w-5 ${isLiked ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
//       </Button>

//       <CardHeader className="p-0">
//         <img 
//           src={product.imageUrl || "https://via.placeholder.com/300"} 
//           alt={product.name}
//           className="w-full h-48 object-cover rounded-t-lg"
//           loading="lazy"
//         />
//       </CardHeader>

//       <CardContent className="p-4">
//         <CardTitle className="text-lg mb-2 line-clamp-1">{product.name}</CardTitle>
        
//         <div className="flex items-center mb-2">
//           {[1, 2, 3, 4, 5].map((star) => (
//             <svg
//               key={star}
//               className={`w-4 h-4 ${star <= product.rating ? 'text-yellow-400' : 'text-gray-300'}`}
//               fill="currentColor"
//               viewBox="0 0 20 20"
//             >
//               <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//             </svg>
//           ))}
//           <span className="text-xs text-gray-500 ml-1">({product.rating})</span>
//         </div>

//         <div className="flex justify-between items-center mb-2 gap-2">
//           <Badge variant="outline" className="truncate">{product.category.name}</Badge>
//           <Badge variant="outline" className="truncate">{product.color.name}</Badge>
//         </div>
//         <p className="text-xl font-bold">${product.price.toFixed(2)}</p>
//       </CardContent>

//       <CardFooter className="flex justify-between p-4 pt-0 gap-2">
//         <Button variant="outline" className="flex-1" onClick={handleBuyNow}>
//           Buy Now
//         </Button>
//         <Button className="flex-1" onClick={handleAddToCart}>
//           Add to Cart
//         </Button>
//       </CardFooter>
//     </Card>
//   );
// };



import { Heart } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import toast from 'react-hot-toast';
import { Link } from "react-router-dom";

type Product = {
  id: string;
  name: string;
  price: number;
  category: {
    name: string;
  };
  color: {
    name: string;
    id: string;
  };
  imageUrl: string;
  rating: number;
};

type ProductCardProps = {
  product: Product;
  isLiked: boolean;
  onToggleLike: () => void;
  onAddToCart: () => void;
};

export const ProductCard = ({
  product,
  isLiked,
  onToggleLike,
  onAddToCart
}: ProductCardProps) => {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
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

  return (
    <Link to={`/products/${product.id}`} className="block">
      <Card className="hover:shadow-lg transition-shadow relative">
        <Button 
          variant="ghost" 
          size="icon"
          className="absolute top-2 right-2 z-10 rounded-full hover:bg-red-50"
          onClick={handleToggleLike}
        >
          <Heart className={`h-5 w-5 ${isLiked ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
        </Button>

        <CardHeader className="p-0">
          <img 
            src={product.imageUrl || "https://via.placeholder.com/300"} 
            alt={product.name}
            className="w-full h-48 object-cover rounded-t-lg"
            loading="lazy"
          />
        </CardHeader>

        <CardContent className="p-4">
          <CardTitle className="text-lg mb-2 line-clamp-1">{product.name}</CardTitle>
          
          <div className="flex items-center mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-4 h-4 ${star <= product.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-xs text-gray-500 ml-1">({product.rating})</span>
          </div>

          <div className="flex justify-between items-center mb-2 gap-2">
            <Badge variant="outline" className="truncate">{product.category.name}</Badge>
            <Badge variant="outline" className="truncate">{product.color.name}</Badge>
          </div>
          <p className="text-xl font-bold">${product.price.toFixed(2)}</p>
        </CardContent>

        <CardFooter className="flex justify-between p-4 pt-0 gap-2">
          <Button variant="outline" className="flex-1" onClick={handleBuyNow}>
            Buy Now
          </Button>
          <Button className="flex-1" onClick={handleAddToCart}>
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};