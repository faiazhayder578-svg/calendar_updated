import React, { useState } from 'react';
import { X, Star, Send, ThumbsUp } from 'lucide-react';

const ReviewsModal = ({ isOpen, closeModal, selectedClass, reviews, addReview, isDarkMode, isStudentMode }) => {
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
    closeModal();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Enhanced backdrop with blur effect */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-backdrop-enter"
        onClick={closeModal}
      />
      {/* Modal container with animation */}
      <div className={`relative w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden animate-modal-enter ${isDarkMode ? 'bg-slate-800 shadow-slate-900/50' : 'bg-white shadow-slate-200'
          }`}>
        {/* Header with clear title and close button */}
        <div className={`px-6 py-4 border-b flex justify-between items-center ${isDarkMode ? 'border-slate-700 bg-gradient-to-r from-amber-900/30 to-orange-900/30' : 'border-slate-100 bg-gradient-to-r from-amber-50 to-orange-50'
            }`}>
          <div>
            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {isStudentMode ? 'Course Reviews & Ratings' : 'Administrator: View Course Reviews'}
            </h3>
            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              {selectedClass.courseCode} - {selectedClass.faculty}
            </p>
          </div>
          <button
            onClick={closeModal}
            className={`p-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${isDarkMode 
              ? 'text-slate-400 hover:text-white hover:bg-slate-700/50 focus:ring-amber-500' 
              : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100 focus:ring-amber-400'
              }`}
          >
            <X className="w-5 h-5" strokeWidth={1.75} />
          </button>
        </div>

          <div className="px-6 py-5 max-h-[60vh] overflow-y-auto">
          {/* Overall Rating */}
          <div className={`p-6 rounded-xl mb-6 ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'
              }`}>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className={`text-6xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {averageRating}
                </div>
                <div className="flex justify-center gap-1.5 my-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      className={`w-6 h-6 transition-colors duration-200 ${star <= Math.round(averageRating)
                        ? 'fill-amber-400 text-amber-400'
                        : isDarkMode ? 'text-slate-600' : 'text-slate-300'
                        }`}
                      strokeWidth={1.75}
                    />
                  ))}
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                </div>
              </div>

              <div className="space-y-2.5">
                {ratingDistribution.map(({ star, count, percentage }) => (
                  <div key={star} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-12">
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        {star}
                      </span>
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" strokeWidth={1.75} />
                    </div>
                    <div className={`flex-1 h-2.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-600' : 'bg-slate-200'
                        }`}>
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-orange-400 transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className={`text-xs font-medium w-8 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

            {/* Add Review Form (Only for Students) */}
          {isStudentMode && (
            <form onSubmit={handleSubmit} className={`p-6 rounded-xl mb-6 ${isDarkMode ? 'bg-slate-700/30 border border-slate-600' : 'bg-blue-50 border border-blue-200'
                }`}>
              <h4 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Write a Review
              </h4>

              <div className="mb-4">
                <label className={`text-xs font-semibold uppercase tracking-wide block mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'
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
                      className="transition-transform duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 rounded-full"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors duration-200 ${star <= (hoverRating || rating)
                          ? 'fill-amber-400 text-amber-400'
                          : isDarkMode ? 'text-slate-600' : 'text-slate-300'
                          }`}
                        strokeWidth={1.75}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className={`text-xs font-semibold uppercase tracking-wide block mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  placeholder="Leave blank for anonymous"
                  className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 ${isDarkMode
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                    : 'bg-white border-slate-200 placeholder-slate-400'
                    }`}
                />
              </div>

              <div className="mb-5">
                <label className={`text-xs font-semibold uppercase tracking-wide block mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                  Your Review *
                </label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  required
                  rows="4"
                  placeholder="Share your experience with this course..."
                  className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 resize-none ${isDarkMode
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                    : 'bg-white border-slate-200 placeholder-slate-400'
                    }`}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-semibold inline-flex items-center justify-center gap-2 transition-all duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 active:scale-[0.98]"
              >
                <Send className="w-4 h-4" strokeWidth={1.75} />
                Submit Review
              </button>
            </form>
          )}

            {/* Reviews List */}
          <div className="space-y-4">
            <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              All Reviews ({reviews.length})
            </h4>
            {reviews.length === 0 ? (
              <div className={`text-center py-8 rounded-xl ${isDarkMode ? 'text-slate-400 bg-slate-700/30' : 'text-slate-500 bg-slate-50'}`}>
                No reviews yet. Be the first to review this course!
              </div>
            ) : (
              reviews.map(review => (
                <div
                  key={review.id}
                  className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${isDarkMode ? 'bg-slate-700/30 border-slate-700 hover:border-slate-600' : 'bg-slate-50 border-slate-100 hover:border-slate-200'
                      }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        {review.reviewer}
                      </div>
                      <div className="flex gap-1 my-1.5">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${star <= review.rating
                              ? 'fill-amber-400 text-amber-400'
                              : isDarkMode ? 'text-slate-600' : 'text-slate-300'
                              }`}
                            strokeWidth={1.75}
                          />
                        ))}
                      </div>
                    </div>
                    <span className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {review.date}
                    </span>
                  </div>
                  <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    {review.text}
                  </p>
                  <button className={`mt-3 inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${isDarkMode 
                    ? 'text-slate-400 hover:text-blue-400 hover:bg-slate-600/50 focus:ring-blue-400' 
                    : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50 focus:ring-blue-400'
                      }`}>
                    <ThumbsUp className="w-3.5 h-3.5" strokeWidth={1.75} />
                    Helpful ({review.likes})
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsModal;
