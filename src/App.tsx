// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import FilterSort from './components/Filter'
import {ProductDetail} from './components/ProductDetail'
import Login from './components/Login/index'
import { Profile } from './components/Profile/Profile'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 2,
    },
  },
});

function App() {
  return (
    <Router> {/* Only one Router should exist in your app */}
      <QueryClientProvider client={queryClient}>
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<FilterSort />} />
            <Route path="/products/:productId" element={<ProductDetail />} />
            <Route path='/login' element={<Login />}/>
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<div>Page Not Found</div>} />
          </Routes>
        </main>
        <Toaster position="top-center" />
      </QueryClientProvider>
    </Router>
  )
}

export default App