import { useState } from 'react';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from './utils/api';


// export const ReviewForm = ({ productId }: { productId: string }) => {
//   const [commentText, setCommentText] = useState('');
//   const [rating, setRating] = useState(0);
//   const [hoverRating, setHoverRating] = useState(0);
//   const { addComment } = useComments();

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!commentText.trim()) {
//       toast.error('Please enter a comment');
//       return;
//     }
//     if (rating === 0) {
//       toast.error('Please select a rating');
//       return;
//     }
//     addComment({ 
//       text: commentText, 
//       star: rating, 
//       productId 
//     });
//     setCommentText('');
//     setRating(0);
//   };


export const ReviewForm = ({ productId }: { productId: string }) => {
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
      await api.addComment({
        text: commentText,
        star: rating,
        productId: productId // Now matches the CommentCreate type
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