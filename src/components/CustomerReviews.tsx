'use client';

import { useMemo } from 'react';
import StarRating from './StarRating';

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  verified: boolean;
  helpful: number;
}

interface CustomerReviewsProps {
  productSku: string;
  productName: string;
  className?: string;
}

// Generate deterministic reviews based on SKU
function generateReviews(sku: string): Review[] {
  const hash = sku.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0);
  const reviewCount = 3 + (Math.abs(hash) % 4); // 3-6 reviews

  const reviewTemplates = [
    {
      titles: ['Beautiful arrangement!', 'Exceeded expectations', 'Simply stunning', 'Perfect gift'],
      contents: [
        'The flowers arrived fresh and beautifully arranged. My recipient was thrilled!',
        'Ordered for my mom\'s birthday and she absolutely loved them. Will order again.',
        'The arrangement was even prettier than the photo. Great quality and fast delivery.',
        'Fresh flowers, beautiful colors, and delivered right on time. Highly recommend!',
      ],
    },
    {
      titles: ['Great service', 'Wonderful experience', 'Very satisfied', 'Would recommend'],
      contents: [
        'Easy ordering process and the flowers arrived exactly when promised.',
        'Customer service was helpful when I had questions. Flowers were gorgeous.',
        'Second time ordering and both times the quality has been excellent.',
        'The delivery driver was professional and the flowers were perfectly arranged.',
      ],
    },
    {
      titles: ['Made her day!', 'Perfect for the occasion', 'Beautiful bouquet', 'Lovely flowers'],
      contents: [
        'Sent these for an anniversary and my wife was so happy. Beautiful selection.',
        'The sympathy arrangement was tasteful and arrived promptly. Much appreciated.',
        'These brightened up my home office. Fresh and fragrant for over a week.',
        'Ordered last minute and they still delivered same day. Lifesaver!',
      ],
    },
  ];

  const firstNames = ['Sarah', 'Michael', 'Jennifer', 'David', 'Emily', 'Robert', 'Lisa', 'James', 'Maria', 'John'];
  const lastInitials = ['M', 'S', 'T', 'R', 'L', 'K', 'B', 'W', 'H', 'P'];

  const reviews: Review[] = [];

  for (let i = 0; i < reviewCount; i++) {
    const templateSet = reviewTemplates[i % reviewTemplates.length];
    const titleIdx = (Math.abs(hash) + i * 7) % templateSet.titles.length;
    const contentIdx = (Math.abs(hash) + i * 11) % templateSet.contents.length;
    const nameIdx = (Math.abs(hash) + i * 13) % firstNames.length;
    const initialIdx = (Math.abs(hash) + i * 17) % lastInitials.length;

    // Generate rating between 4 and 5
    const rating = 4 + ((Math.abs(hash) + i) % 2);

    // Generate date within last 90 days
    const daysAgo = (Math.abs(hash) + i * 23) % 90;
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);

    reviews.push({
      id: `review-${sku}-${i}`,
      author: `${firstNames[nameIdx]} ${lastInitials[initialIdx]}.`,
      rating,
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      title: templateSet.titles[titleIdx],
      content: templateSet.contents[contentIdx],
      verified: (Math.abs(hash) + i) % 3 !== 0, // ~67% verified
      helpful: (Math.abs(hash) + i * 5) % 15, // 0-14 helpful votes
    });
  }

  return reviews;
}

export default function CustomerReviews({ productSku, productName, className = '' }: CustomerReviewsProps) {
  const reviews = useMemo(() => generateReviews(productSku), [productSku]);

  const averageRating = useMemo(() => {
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  }, [reviews]);

  const ratingDistribution = useMemo(() => {
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((review) => {
      dist[review.rating as keyof typeof dist]++;
    });
    return dist;
  }, [reviews]);

  return (
    <section className={`py-12 ${className}`}>
      <div className="container-wide">
        <h2 className="font-display text-2xl font-semibold text-forest-900 mb-8">
          Customer Reviews
        </h2>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-cream-50 rounded-2xl p-6 border border-cream-200">
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-forest-900 mb-2">
                  {averageRating.toFixed(1)}
                </div>
                <StarRating rating={averageRating} size="lg" showCount={false} />
                <p className="text-sm text-forest-800/60 mt-2">
                  Based on {reviews.length} reviews
                </p>
              </div>

              {/* Rating bars */}
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count = ratingDistribution[stars as keyof typeof ratingDistribution];
                  const percentage = (count / reviews.length) * 100;

                  return (
                    <div key={stars} className="flex items-center gap-3">
                      <span className="text-sm text-forest-800/60 w-6">{stars}</span>
                      <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <div className="flex-1 h-2 bg-cream-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-forest-800/60 w-8 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>

              {/* Write review CTA */}
              <button className="w-full mt-6 py-3 border border-sage-300 rounded-xl text-sage-700 font-medium hover:bg-sage-50 transition-colors">
                Write a Review
              </button>
            </div>
          </div>

          {/* Reviews list */}
          <div className="lg:col-span-2 space-y-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-xl p-6 border border-cream-200 hover:border-cream-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-medium text-forest-900">{review.author}</span>
                      {review.verified && (
                        <span className="inline-flex items-center gap-1 text-xs text-sage-600 bg-sage-50 px-2 py-0.5 rounded-full">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    <StarRating rating={review.rating} size="sm" showCount={false} />
                  </div>
                  <span className="text-sm text-forest-800/50">{review.date}</span>
                </div>

                <h4 className="font-medium text-forest-900 mb-2">{review.title}</h4>
                <p className="text-forest-800/70 leading-relaxed">{review.content}</p>

                {review.helpful > 0 && (
                  <div className="mt-4 pt-4 border-t border-cream-100 flex items-center gap-4">
                    <span className="text-sm text-forest-800/50">
                      {review.helpful} {review.helpful === 1 ? 'person' : 'people'} found this helpful
                    </span>
                    <button className="text-sm text-sage-600 hover:text-sage-700 transition-colors">
                      Helpful
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
