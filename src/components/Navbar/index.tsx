import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import clsx from "clsx";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Phone", path: "/phone" },
    { name: "Electronics", path: "/electronics" },
    { name: "Laptops", path: "/laptops" },
    { name: "Accessories", path: "/accessories" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#111] text-white shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* LOGO */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/" className="text-2xl font-bold sm:text-xl">
            MY SHOP
          </Link>
        </motion.div>

        {/* NAV LINKS - DESKTOP */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Link
                to={item.path}
                className="text-lg font-semibold hover:text-gray-400 transition-all duration-300"
              >
                {item.name}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* LOGIN BUTTON */}
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Link
            to="/login"
            className="hidden md:block bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-white font-semibold transition-all"
          >
            Login
          </Link>
        </motion.div>

        {/* HAMBURGER MENU - MOBILE */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={30} /> : <Menu size={30} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: isOpen ? "auto" : 0 }}
        transition={{ duration: 0.3 }}
        className={clsx(
          "md:hidden overflow-hidden bg-gray-900 text-white",
          isOpen ? "p-4" : "p-0"
        )}
      >
        {navItems.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="py-2 text-center"
          >
            <Link to={item.path} onClick={() => setIsOpen(false)}>
              {item.name}
            </Link>
          </motion.div>
        ))}
        <div className="text-center mt-4">
          <Link
            to="/login"
            className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-lg text-white font-semibold transition-all"
            onClick={() => setIsOpen(false)}
          >
            Login
          </Link>
        </div>
      </motion.div>
    </nav>
  );
};

export default Navbar;


// src/pages/Profile.tsx
// import { useState } from 'react';
// // import { useAuth } from '../context/AuthContext';
// import { Button } from '../ui/button';
// import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
// import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

// export const Profile = () => {
//   // const { user } = useAuth();
//   const user ={
//     "email": "user@example.com",
//     "password": "12345678",
//     "firstname": "Ali",
//     "lastname": "Valiyev",
//     "img": "https://example.com/image.jpg",
//     "regionId": "3365cd95-8062-4242-b033-85e4210d146a",
//     "createdAt": "2022-01-01T10:00:00.000Z",
//     "updatedAt": "2022-01-01T10:00:00.000Z",
//     "phoneNumber": "+998991234567",
//   }
//   const [activeTab, setActiveTab] = useState('info');

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex flex-col md:flex-row gap-8">
//         {/* Profile Sidebar */}
//         <div className="w-full md:w-1/3 lg:w-1/4 space-y-6">
//           <Card>
//             <CardHeader className="items-center">
//               <Avatar className="h-24 w-24 mb-4">
//                 <AvatarImage src={user?.photoUrl} />
//                 <AvatarFallback className="text-2xl">
//                   {user?.firstname?.charAt(0)}{user?.lastname?.charAt(0)}
//                 </AvatarFallback>
//               </Avatar>
//               <CardTitle className="text-center">
//                 {user?.firstname} {user?.lastname}
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="space-y-1">
//                 <p className="text-sm text-gray-500">Member since</p>
//                 <p>{new Date(user?.createdAt).toLocaleDateString()}</p>
//               </div>
//               <div className="space-y-1">
//                 <p className="text-sm text-gray-500">Region</p>
//                 <p>{user?.regionId || 'Not specified'}</p>
//               </div>
//               <Button variant="outline" className="w-full">
//                 Change Password
//               </Button>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Main Content */}
//         <div className="flex-1">
//           <Tabs value={activeTab} onValueChange={setActiveTab}>
//             <TabsList className="grid w-full grid-cols-4">
//               <TabsTrigger value="info">Profile Info</TabsTrigger>
//               <TabsTrigger value="viewed">Recently Viewed</TabsTrigger>
//               <TabsTrigger value="liked">Liked Products</TabsTrigger>
//               <TabsTrigger value="posts">My Posts</TabsTrigger>
//             </TabsList>

//             <TabsContent value="info">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Personal Information</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <p className="text-sm text-gray-500">First Name</p>
//                       <p>{user?.firstname}</p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-500">Last Name</p>
//                       <p>{user?.lastname}</p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-500">Email</p>
//                       <p>{user?.email}</p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-500">Phone</p>
//                       <p>{user?.phoneNumber || 'Not specified'}</p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </TabsContent>

//             <TabsContent value="viewed">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Recently Viewed Products</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   {/* Map through viewed products */}
//                   {user?.viewedProducts?.length ? (
//                     <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//                       {user.viewedProducts.map(product => (
//                         <ProductCard key={product.id} product={product} />
//                       ))}
//                     </div>
//                   ) : (
//                     <p>No recently viewed products</p>
//                   )}
//                 </CardContent>
//               </Card>
//             </TabsContent>

//             <TabsContent value="liked">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Liked Products</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   {user?.likedProducts?.length ? (
//                     <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//                       {user.likedProducts.map(product => (
//                         <ProductCard key={product.id} product={product} />
//                       ))}
//                     </div>
//                   ) : (
//                     <p>No liked products</p>
//                   )}
//                 </CardContent>
//               </Card>
//             </TabsContent>

//             <TabsContent value="posts">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>My Posts</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   {user?.posts?.length ? (
//                     <div className="space-y-4">
//                       {user.posts.map(post => (
//                         <PostCard key={post.id} post={post} />
//                       ))}
//                     </div>
//                   ) : (
//                     <p>No posts yet</p>
//                   )}
//                 </CardContent>
//               </Card>
//             </TabsContent>
//           </Tabs>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Simple product card component for the lists
// const ProductCard = ({ product }: { product: any }) => (
//   <div className="border rounded-lg p-3 hover:shadow-md transition-shadow">
//     <img 
//       src={product.image} 
//       alt={product.name}
//       className="w-full h-32 object-cover rounded-md mb-2"
//     />
//     <h3 className="font-medium">{product.name}</h3>
//     <p className="text-sm text-gray-600">${product.price}</p>
//   </div>
// );

// // Simple post card component
// const PostCard = ({ post }: { post: any }) => (
//   <div className="border rounded-lg p-4">
//     <h3 className="font-medium">{post.title}</h3>
//     <p className="text-sm text-gray-500 mb-2">
//       {new Date(post.createdAt).toLocaleDateString()}
//     </p>
//     <p className="text-gray-700">{post.content.substring(0, 100)}...</p>
//   </div>
// );
