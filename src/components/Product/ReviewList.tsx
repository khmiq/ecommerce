import { Comment } from './types/product';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Star } from 'lucide-react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';

export const ReviewList = ({ comments }: { comments: Comment[] }) => {
  if (comments.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500 mb-4">No reviews yet</p>
        <Button variant="outline" asChild>
          <Link to="/login">Login to write a review</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <div key={comment.id} className="border-b pb-6 last:border-0">
          <div className="flex items-start space-x-3 mb-3">
            <Avatar>
              <AvatarFallback>
                {comment.user?.firstname?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h4 className="font-medium">
                {comment.user?.firstname} {comment.user?.lastname}
              </h4>
              <div className="flex flex-wrap items-center space-x-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i}
                      className={`w-4 h-4 ${
                        i < comment.star 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-gray-300'
                      }`}
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
  );
};

