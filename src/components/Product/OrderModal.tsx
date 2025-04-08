import { useState, useEffect } from 'react';
import { Product, Color } from './types/product';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { Checkbox } from '../ui/checkbox';
import { useOrder } from './hooks/useOrder';
// import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export const OrderModal = ({
  isOpen,
  onOpenChange,
  product,
  colors,
  loadingColors
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
  colors: Color[];
  loadingColors: boolean;
}) => {
//   const { token } = useAuth();
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [selectedColorIds, setSelectedColorIds] = useState<string[]>([]);
  const { mutate: placeOrder } = useOrder();

  const toggleColor = (colorId: string) => {
    setSelectedColorIds(prev => 
      prev.includes(colorId)
        ? prev.filter(id => id !== colorId)
        : [...prev, colorId]
    );
  };

  const handlePlaceOrder = () => {
    if (selectedColorIds.length === 0) {
      toast.error('Please select at least one color');
      return;
    }

    placeOrder({
      productId: product.id,
      colorIds: selectedColorIds, // Now matches your API
      count: orderQuantity,
    //   token
    });
  };

  // Initialize with product colors if available
  useEffect(() => {
    if (product?.colorIds?.length) {
      setSelectedColorIds(product.colorIds.map(c => c.id));
    }
  }, [product]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Your Order</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Select Colors (Multiple)</Label>
            {loadingColors ? (
              <div className="space-y-2">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <Skeleton className="w-4 h-4 rounded" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </div>
            ) : colors.length > 0 ? (
              <div className="space-y-2">
                {colors.map((color) => (
                  <div key={color.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`color-${color.id}`}
                      checked={selectedColorIds.includes(color.id)}
                      onCheckedChange={() => toggleColor(color.id)}
                    />
                    <Label htmlFor={`color-${color.id}`} className="flex items-center cursor-pointer">
                      <span 
                        className="w-4 h-4 rounded-full mr-2 border border-gray-300" 
                        style={{ backgroundColor: color.hexCode || '#ccc' }}
                      />
                      {color.name}
                    </Label>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No colors available</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Quantity</Label>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setOrderQuantity(prev => Math.max(1, prev - 1))}
                disabled={orderQuantity <= 1}
              >
                -
              </Button>
              <span className="w-10 text-center">{orderQuantity}</span>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setOrderQuantity(prev => prev + 1)}
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
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={handlePlaceOrder}
            disabled={selectedColorIds.length === 0 || loadingColors}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Place Order
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};