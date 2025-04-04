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



