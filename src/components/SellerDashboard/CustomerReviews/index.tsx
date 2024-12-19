import React, { useState } from 'react';
import { Star, Plus, X } from 'lucide-react';
import { supabase } from '../../../config/supabase';
import { compressImage } from '../../../utils/image';
import { logger } from '../../../services/utils/logger';

interface Review {
  id: string;
  customer_name: string;
  review_text: string;
  rating: number;
  profile_image: string | null;
  created_at: string;
}

interface CustomerReviewsProps {
  sellerId: string;
}

export function CustomerReviews({ sellerId }: CustomerReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    try {
      const { data, error: fetchError } = await supabase
        .from('customer_reviews')
        .select('*')
        .eq('seller_id', sellerId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setReviews(data || []);
    } catch (err) {
      logger.error('Error fetching reviews:', err);
      setError('Failed to load reviews');
    }
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Customer Reviews</h2>
        <button
          onClick={() => setIsAddingReview(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Add Review
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 p-4 rounded-md">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {isAddingReview && (
        <AddReviewForm
          sellerId={sellerId}
          onClose={() => setIsAddingReview(false)}
          onSuccess={() => {
            setIsAddingReview(false);
            fetchReviews();
          }}
        />
      )}

      <div className="space-y-6">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} onDelete={fetchReviews} />
        ))}
      </div>
    </div>
  );
}

interface AddReviewFormProps {
  sellerId: string;
  onClose: () => void;
  onSuccess: () => void;
}

function AddReviewForm({ sellerId, onClose, onSuccess }: AddReviewFormProps) {
  const [formData, setFormData] = useState({
    customerName: '',
    reviewText: '',
    rating: 5,
  });
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let profileImageUrl = null;

      if (image) {
        // Compress and upload image
        const compressedImage = await compressImage(image);
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('profile-images')
          .upload(fileName, compressedImage);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('profile-images')
          .getPublicUrl(fileName);

        profileImageUrl = publicUrl;
      }

      // Create review
      const { error: reviewError } = await supabase
        .from('customer_reviews')
        .insert([{
          seller_id: sellerId,
          customer_name: formData.customerName,
          review_text: formData.reviewText,
          rating: formData.rating,
          profile_image: profileImageUrl,
        }]);

      if (reviewError) throw reviewError;

      onSuccess();
    } catch (err) {
      logger.error('Error adding review:', err);
      setError(err instanceof Error ? err.message : 'Failed to add review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 bg-gray-50 p-6 rounded-lg">
      <div className="space-y-4">
        <div>
          <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">
            Customer Name
          </label>
          <input
            type="text"
            id="customerName"
            value={formData.customerName}
            onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          />
        </div>

        <div>
          <label htmlFor="reviewText" className="block text-sm font-medium text-gray-700">
            Review
          </label>
          <textarea
            id="reviewText"
            value={formData.reviewText}
            onChange={(e) => setFormData(prev => ({ ...prev, reviewText: e.target.value }))}
            required
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Rating</label>
          <div className="mt-1 flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, rating }))}
                className={`p-1 focus:outline-none ${
                  rating <= formData.rating ? 'text-yellow-400' : 'text-gray-300'
                }`}
              >
                <Star className="h-6 w-6 fill-current" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Customer Photo (Optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
          />
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 p-4 rounded-md">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="mt-6 flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Review'}
        </button>
      </div>
    </form>
  );
}

interface ReviewCardProps {
  review: Review;
  onDelete: () => void;
}

function ReviewCard({ review, onDelete }: ReviewCardProps) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    setDeleting(true);
    try {
      const { error } = await supabase
        .from('customer_reviews')
        .delete()
        .eq('id', review.id);

      if (error) throw error;
      onDelete();
    } catch (err) {
      logger.error('Error deleting review:', err);
      alert('Failed to delete review');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          {review.profile_image ? (
            <img
              src={review.profile_image}
              alt={review.customer_name}
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
              <span className="text-orange-600 font-medium text-lg">
                {review.customer_name[0].toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <h3 className="font-medium text-gray-900">{review.customer_name}</h3>
            <div className="flex items-center mt-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="ml-2 text-sm text-gray-500">
                {new Date(review.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className="mt-2 text-gray-600">{review.review_text}</p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-gray-400 hover:text-red-500"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}