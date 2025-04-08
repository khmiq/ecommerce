// import { useState } from 'react';
// import { Product } from './types/product';
// // import { Skeleton } from '../ui/skeleton';

// const images = [
//   "https://via.placeholder.com/800",
//   "https://via.placeholder.com/800?text=Back+View",
//   "https://via.placeholder.com/800?text=Side+View",
//   "https://via.placeholder.com/800?text=Detail"
// ];

// export const ProductGallery = ({ product }: { product: Product }) => {
//   const [activeImage, setActiveImage] = useState(0);

//   return (
//     <div className="space-y-4">
//       <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
//         <img 
//           src={images[activeImage] || product?.img || "https://via.placeholder.com/800"} 
//           alt={product.name}
//           className="w-full h-auto max-h-[500px] object-contain p-4"
//         />
//       </div>
//       <div className="grid grid-cols-4 gap-2">
//         {images.map((img, index) => (
//           <button
//             key={index}
//             onClick={() => setActiveImage(index)}
//             className={`rounded-md overflow-hidden border-2 ${activeImage === index ? 'border-blue-500' : 'border-transparent'}`}
//           >
//             <img 
//               src={img} 
//               alt={`Preview ${index + 1}`}
//               className="w-full h-20 object-cover"
//             />
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };



import { useState } from 'react';
import { Product } from './types/product';

export const ProductGallery = ({ product }: { product: Product }) => {
  const [activeImage, setActiveImage] = useState(0);

  // Array of image URLs, you can use actual images from your API here instead of placeholders
  const images = [
    product.img || "https://via.placeholder.com/800",
    "https://via.placeholder.com/800?text=Back+View",
    "https://via.placeholder.com/800?text=Side+View",
    "https://via.placeholder.com/800?text=Detail"
  ];

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
        <img 
          src={images[activeImage]} 
          alt={product.name}
          className="w-full h-auto max-h-[500px] object-contain p-4"
        />
      </div>

      {/* Thumbnail Previews */}
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
  );
};


