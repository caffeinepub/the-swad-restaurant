import React, { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetAllReviews, useSubmitReview, useGetCallerUserProfile } from '../hooks/useQueries';
import StarRating from '../components/StarRating';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, MessageSquare, LogIn } from 'lucide-react';
import LoginButton from '../components/LoginButton';
import { toast } from 'sonner';

function formatDate(timestamp: bigint) {
  return new Date(Number(timestamp) / 1_000_000).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
}

export default function Reviews() {
  const { identity } = useInternetIdentity();
  const { data: reviews = [], isLoading } = useGetAllReviews();
  const { data: profile } = useGetCallerUserProfile();
  const submitReview = useSubmitReview();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) { toast.error('Please write a review'); return; }
    try {
      await submitReview.mutateAsync({ rating: BigInt(rating), comment: comment.trim() });
      setComment('');
      setRating(5);
      toast.success('Review submitted! Thank you 🙏');
    } catch {
      toast.error('Failed to submit review');
    }
  };

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length
    : 0;

  return (
    <main className="page-enter max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-maroon mb-2">Reviews & Ratings</h1>
        <div className="ornament-divider w-48 mx-auto"><span className="text-gold text-lg">✦</span></div>
        {reviews.length > 0 && (
          <div className="flex items-center justify-center gap-3 mt-4">
            <StarRating rating={Math.round(avgRating)} size="lg" />
            <span className="font-display text-2xl font-bold text-maroon">{avgRating.toFixed(1)}</span>
            <span className="text-muted-foreground font-body text-sm">({reviews.length} reviews)</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submit Review */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50 sticky top-24">
            <h2 className="font-display text-xl font-bold text-maroon mb-4">Share Your Experience</h2>
            {!identity ? (
              <div className="text-center py-4">
                <LogIn className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground font-body text-sm mb-4">Login to write a review</p>
                <LoginButton />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <p className="text-sm font-body text-muted-foreground mb-2">Your Rating</p>
                  <StarRating rating={rating} interactive onChange={setRating} size="lg" />
                </div>
                <div className="space-y-1.5">
                  <Textarea
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder="Tell us about your experience..."
                    rows={4}
                    className="resize-none"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={submitReview.isPending || !comment.trim()}
                  className="w-full bg-maroon text-cream hover:bg-maroon/90"
                >
                  {submitReview.isPending ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</>
                  ) : 'Submit Review'}
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-2 space-y-4">
          {isLoading ? (
            [1, 2, 3].map(i => (
              <div key={i} className="bg-card rounded-xl p-4 border border-border/50">
                <div className="flex gap-3 mb-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-12 w-full" />
              </div>
            ))
          ) : reviews.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-2xl border border-border/50">
              <MessageSquare className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="font-display text-lg text-muted-foreground">No reviews yet</p>
              <p className="text-sm text-muted-foreground font-body mt-1">Be the first to share your experience!</p>
            </div>
          ) : (
            [...reviews].reverse().map((review, idx) => {
              const isCurrentUser = identity && review.user.toString() === identity.getPrincipal().toString();
              const displayName = isCurrentUser && profile?.name ? profile.name : `Guest ${review.user.toString().slice(0, 6)}`;
              return (
                <div key={idx} className="bg-card rounded-xl p-4 shadow-card border border-border/50">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-maroon/10 flex items-center justify-center shrink-0">
                      <span className="font-display font-bold text-maroon text-sm">
                        {displayName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-foreground text-sm font-body">{displayName}</p>
                        <p className="text-xs text-muted-foreground font-body shrink-0">{formatDate(review.timestamp)}</p>
                      </div>
                      <StarRating rating={Number(review.rating)} size="sm" />
                    </div>
                  </div>
                  <p className="text-sm font-body text-foreground/80 leading-relaxed">{review.comment}</p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}
