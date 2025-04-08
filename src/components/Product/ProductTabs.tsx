import { Product } from './types/product';
import { ReviewForm } from './ReviewForm';
import { ReviewList } from './ReviewList';
import { Badge } from '../ui/badge';

export const ProductTabs = ({
  activeTab,
  onTabChange,
  product
}: {
  activeTab: string;
  onTabChange: (tab: string) => void;
  product: Product;
}) => {
  return (
    <>
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-4 overflow-x-auto">
          {['description', 'specifications', 'reviews'].map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab === 'reviews' 
                ? `Reviews (${product.comments?.length || 0})` 
                : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'description' && (
        <div className="prose max-w-none mb-12">
          <h3 className="text-xl font-bold mb-4">Product Details</h3>
          <p>{product.description || 'No detailed description available.'}</p>
          
          <ul className="mt-4 space-y-2">
            <li>
              Colors: {product.colorIds?.length ? (
                <span className="inline-flex gap-2 ml-2">
                  {product.colorIds.map(color => (
                    <Badge 
                      key={color.id} 
                      variant="outline" 
                      className="flex items-center gap-1"
                    >
                      {color.hexCode && (
                        <span 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: color.hexCode }}
                        />
                      )}
                      {color.name}
                    </Badge>
                  ))}
                </span>
              ) : 'Not specified'}
            </li>
            <li>Category: {product.category?.name || 'Not specified'}</li>
            <li>Added on: {new Date(product.createdAt).toLocaleDateString()}</li>
          </ul>
        </div>
      )}

      {activeTab === 'specifications' && (
        <div className="prose max-w-none mb-12">
          <h3 className="text-xl font-bold mb-4">Specifications</h3>
          <p>No specifications available for this product.</p>
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="mt-6">
          <ReviewForm productId={product.id} />
          <ReviewList comments={product.comments || []} />
        </div>
      )}
    </>
  );
};