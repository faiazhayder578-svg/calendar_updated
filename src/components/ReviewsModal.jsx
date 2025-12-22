import React, { useState } from 'react';
import { X, Star, Send, ThumbsUp } from 'lucide-react';

const ReviewsModal = ({ isOpen, closeModal, selectedClass, reviews, addReview, isDarkMode }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviewerName, setReviewerName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
    
    const review = {
      id: Date.now(),
      rating,
      text: reviewText,
      reviewer: reviewerName || 'Anonymous',
      date: new Date().toLocaleDateString(),
      likes: 0
    };
    
    addReview(selectedClass.id, review);
    setRating(0);
    setReviewText('');
    setReviewerName('');
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    percentage: reviews.length > 0 ? (reviews.filter(r => r.rating === star).length / reviews.length) * 100 : 0
  }));

  if (!isOpen || !selectedClass) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={closeModal}
      />
      <div className="min-h-screen px-4 flex items-center justify-center">
        <div className={`relative w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden ${
          isDarkMode ? 'bg-slate-800' : 'bg-white'
        }`}>
          {/* Header */}
          <div className={`px-6 py-4 border-b flex justify-between items-center ${
            isDarkMode ? 'border-slate-700 bg-gradient-to-r from-amber-900/30 to-orange-900/30' : 'border-slate-100 bg-gradient-to-r from-amber-50 to-orange-50'
          }`}>
            <div>
              <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Course Reviews & Ratings
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                {selectedClass.courseCode} - {selectedClass.faculty}
              </p>
            </div>
            <button 
              onClick={closeModal}
              className={`transition-colors ${
                isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-900'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 max-h-[70vh] overflow-y-auto">
            {/* Overall Rating */}
            <div className={`p-6 rounded-xl mb-6 ${
              isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'
            }`}>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className={`text-6xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {averageRating}
                  </div>
                  <div className="flex justify-center gap-1 my-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        className={`w-6 h-6 ${
                          star <= Math.round(averageRating)
                            ? 'fill-amber-400 text-amber-400'
                            : isDarkMode ? 'text-slate-600' : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                  <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                  </div>
                </div>

                <div className="space-y-2">
                  {ratingDistribution.map(({ star, count, percentage }) => (
                    <div key={star} className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-12">
                        <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                          {star}
                        </span>
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      </div>
                      <div className={`flex-1 h-2 rounded-full overflow-hidden ${
                        isDarkMode ? 'bg-slate-600' : 'bg-slate-200'
                      }`}>
                        <div
                          className="h-full bg-gradient-to-r from-amber-400 to-orange-400 transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className={`text-xs w-8 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Add Review Form */}
            <form onSubmit={handleSubmit} className={`p-6 rounded-xl mb-6 ${
              isDarkMode ? 'bg-slate-700/30 border border-slate-600' : 'bg-blue-50 border border-blue-200'
            }`}>
              <h4 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Write a Review
              </h4>

              <div className="mb-4">
                <label className={`text-sm font-medium block mb-2 ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Your Rating *
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= (hoverRating || rating)
                            ? 'fill-amber-400 text-amber-400'
                            : isDarkMode ? 'text-slate-600' : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className={`text-sm font-medium block mb-2 ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  placeholder="Leave blank for anonymous"
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                    isDarkMode 
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                      : 'bg-white border-slate-200'
                  }`}
                />
              </div>

              <div className="mb-4">
                <label className={`text-sm font-medium block mb-2 ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Your Review *
                </label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  required
                  rows="4"
                  placeholder="Share your experience with this course..."
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                    isDarkMode 
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                      : 'bg-white border-slate-200'
                  }`}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-all"
              >
                <Send className="w-4 h-4" />
                Submit Review
              </button>
            </form>

            {/* Reviews List */}
            <div className="space-y-4">
              <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                All Reviews ({reviews.length})
              </h4>
              {reviews.length === 0 ? (
                <div className={`text-center py-8 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  No reviews yet. Be the first to review this course!
                </div>
              ) : (
                reviews.map(review => (
                  <div
                    key={review.id}
                    className={`p-4 rounded-lg ${
                      isDarkMode ? 'bg-slate-700/30' : 'bg-slate-50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                          {review.reviewer}
                        </div>
                        <div className="flex gap-1 my-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= review.rating
                                  ? 'fill-amber-400 text-amber-400'
                                  : isDarkMode ? 'text-slate-600' : 'text-slate-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        {review.date}
                      </span>
                    </div>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      {review.text}
                    </p>
                    <button className={`mt-2 flex items-center gap-1 text-xs ${
                      isDarkMode ? 'text-slate-400 hover:text-blue-400' : 'text-slate-500 hover:text-blue-600'
                    }`}>
                      <ThumbsUp className="w-3 h-3" />
                      Helpful ({review.likes})
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsModal;
