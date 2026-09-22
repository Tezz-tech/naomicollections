import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useProductReviews, useSubmitReview } from '../../features/reviews/hooks';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../ui';
import { formatDate } from '../../lib/format';

const reviewSchema = z.object({
  rating: z.number().min(1, 'Please select a rating').max(5),
  title: z.string().max(120).optional(),
  comment: z.string().min(4, 'Tell us a bit more').max(1000),
});

const TABS = ['Description', 'Reviews', 'Shipping & Returns'];

function ReviewForm({ productId }) {
  const { user } = useAuthStore();
  const location = useLocation();
  const [rating, setRating] = useState(0);
  const { mutate, isPending } = useSubmitReview(productId);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(reviewSchema) });

  if (!user) {
    return (
      <p className="text-sm text-grey">
        <Link to="/login" state={{ from: location.pathname }} className="link-underline text-black">
          Log in
        </Link>{' '}
        to leave a review.
      </p>
    );
  }

  function onSubmit(values) {
    mutate(
      { product: productId, ...values, rating },
      {
        onSuccess: (res) => {
          toast.success(res.message);
          reset();
          setRating(0);
        },
        onError: (err) => toast.error(err.response?.data?.message || 'Could not submit review.'),
      }
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 max-w-md border-t border-grey-light pt-8">
      <p className="section-label mb-3">Write a Review</p>
      <div className="mb-4 flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" onClick={() => setRating(n)}>
            <Star className={`h-5 w-5 ${n <= rating ? 'fill-gold text-gold' : 'text-grey-light'}`} />
          </button>
        ))}
      </div>
      <input
        {...register('title')}
        placeholder="Title (optional)"
        className="mb-3 h-10 w-full border border-grey-light px-3 text-sm focus:border-gold focus:outline-none"
      />
      <textarea
        {...register('comment')}
        placeholder="Share your experience..."
        rows={3}
        className="w-full border border-grey-light px-3 py-2 text-sm focus:border-gold focus:outline-none"
      />
      {errors.comment && <p className="mt-1 text-xs text-status-error">{errors.comment.message}</p>}
      <Button type="submit" loading={isPending} className="mt-4">
        Submit Review
      </Button>
    </form>
  );
}

export default function DescriptionTabs({ product }) {
  const [tab, setTab] = useState('Description');
  const { data: reviews, isLoading } = useProductReviews(product._id);

  return (
    <div className="mt-20">
      <div className="flex justify-center gap-10 border-b border-grey-light">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`relative pb-4 text-xs uppercase tracking-widest2 transition-colors ${
              tab === t ? 'text-black' : 'text-grey hover:text-black'
            }`}
          >
            {t}
            {tab === t && (
              <motion.span layoutId="tab-underline" className="absolute -bottom-px left-0 h-px w-full bg-gold" />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="mx-auto max-w-2xl py-10"
        >
          {tab === 'Description' && (
            <div className="prose-sm text-sm leading-relaxed text-grey">
              <p>{product.description}</p>
              {product.tags?.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span key={tag} className="border border-grey-light px-2.5 py-1 text-[10px] uppercase tracking-wide text-grey">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'Reviews' && (
            <div>
              {product.ratingsCount > 0 && (
                <div className="mb-8 flex items-center gap-3">
                  <span className="font-serif text-4xl">{product.ratingsAverage.toFixed(1)}</span>
                  <div>
                    <div className="flex gap-0.5 text-gold">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < Math.round(product.ratingsAverage) ? 'fill-gold' : ''}`}
                        />
                      ))}
                    </div>
                    <p className="mt-1 text-xs text-grey">Based on {product.ratingsCount} reviews</p>
                  </div>
                </div>
              )}

              {isLoading ? (
                <p className="text-sm text-grey">Loading reviews...</p>
              ) : reviews?.length === 0 ? (
                <p className="text-sm text-grey">No reviews yet — be the first to share your experience.</p>
              ) : (
                <ul className="space-y-6">
                  {reviews?.map((review) => (
                    <li key={review._id} className="border-b border-grey-light pb-6">
                      <div className="flex items-center justify-between">
                        <div className="flex gap-0.5 text-gold">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? 'fill-gold' : ''}`} />
                          ))}
                        </div>
                        <span className="text-xs text-grey">{formatDate(review.createdAt)}</span>
                      </div>
                      {review.title && <p className="mt-2 text-sm font-medium">{review.title}</p>}
                      <p className="mt-1 text-sm text-grey">{review.comment}</p>
                      <p className="mt-2 text-xs text-grey">
                        {review.user?.name}
                        {review.isVerifiedPurchase && (
                          <span className="ml-2 text-status-success">Verified Purchase</span>
                        )}
                      </p>
                    </li>
                  ))}
                </ul>
              )}

              <ReviewForm productId={product._id} />
            </div>
          )}

          {tab === 'Shipping & Returns' && (
            <div className="space-y-4 text-sm leading-relaxed text-grey">
              <p>
                Orders are processed within 1-2 business days. Delivery timelines depend on your
                location — Lagos typically 1-2 days, other states 3-5 days.
              </p>
              <p>
                We accept returns within 7 days of delivery for unworn, unwashed items with tags
                attached. Visit your order history to start a return request.
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
