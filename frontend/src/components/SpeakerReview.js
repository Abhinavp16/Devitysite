import { useEffect, useState } from 'react';
import publicApiService from '../services/publicApiService';
import SectionHeading from './SectionHeading';
import SkeletonBone from './SkeletonBone';

const PREVIEW_COUNT = 6;      // reviews shown before "Show all"
const LONG_REVIEW_CHARS = 260; // longer reviews are clamped with "Read more"

const ReviewCard = ({ review }) => {
  const [expanded, setExpanded] = useState(false);
  const isLong = (review.review || '').length > LONG_REVIEW_CHARS;

  return (
    <figure className="m-0 flex h-full flex-col rounded-md border border-cream-line bg-white p-6 dark:border-white/10 dark:bg-slate-900">
      {review.highlight && (
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-gold-dark dark:text-gold">
          {review.highlight}
        </p>
      )}
      <blockquote className={`m-0 text-[15px] leading-relaxed text-navy-ink dark:text-gray-100 ${isLong && !expanded ? 'line-clamp-5' : ''}`}>
        {review.review}
      </blockquote>
      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="mt-2 self-start text-sm font-semibold text-navy hover:underline dark:text-gold"
        >
          {expanded ? 'Show less' : 'Read more'}
        </button>
      )}
      <figcaption className="mt-auto flex items-center gap-3 pt-6">
        {review.image_url ? (
          <img src={review.image_url} alt="" loading="lazy" className="h-11 w-11 flex-shrink-0 rounded-full object-cover" />
        ) : (
          <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-gold-soft font-display text-lg font-bold text-navy" aria-hidden="true">
            {(review.name || '?').charAt(0)}
          </span>
        )}
        <div className="min-w-0">
          <p className="text-sm font-bold text-navy-ink dark:text-white">{review.name}</p>
          <p className="text-[13px] leading-snug text-slate-600 dark:text-gray-400">{review.role}</p>
        </div>
      </figcaption>
    </figure>
  );
};

export default function SpeakerReview() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    let isMounted = true;

    publicApiService.getReviews()
      .then((data) => {
        if (isMounted) setReviews(data);
      })
      .catch((err) => {
        if (isMounted) setError(err.message);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Testimonials are optional — hide the whole section rather than show an error or empty state
  if (!isLoading && (error || reviews.length === 0)) {
    return null;
  }

  const visibleReviews = showAll ? reviews : reviews.slice(0, PREVIEW_COUNT);

  return (
    <section className="bg-cream py-20 transition-colors duration-300 dark:bg-slate-950 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Voices from our speakers" title="What industry speakers say" />

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? [0, 1, 2].map((item) => (
              <div key={item} className="flex flex-col gap-3 rounded-md border border-cream-line bg-white p-6 dark:border-white/10 dark:bg-slate-900" aria-hidden="true">
                <SkeletonBone delay={item * 0.1} className="h-3 w-24 rounded-full" />
                <SkeletonBone delay={item * 0.1 + 0.05} className="h-4 w-full rounded-full" />
                <SkeletonBone delay={item * 0.1 + 0.1} className="h-4 w-full rounded-full" />
                <SkeletonBone delay={item * 0.1 + 0.15} className="h-4 w-2/3 rounded-full" />
                <div className="mt-4 flex items-center gap-3">
                  <SkeletonBone delay={item * 0.1 + 0.2} className="h-11 w-11 rounded-full" />
                  <div className="flex flex-1 flex-col gap-2">
                    <SkeletonBone delay={item * 0.1 + 0.25} className="h-3.5 w-28 rounded-full" />
                    <SkeletonBone delay={item * 0.1 + 0.3} className="h-3 w-40 rounded-full" />
                  </div>
                </div>
              </div>
            ))
            : visibleReviews.map((review, index) => (
              <ReviewCard key={review.id ?? review._id ?? index} review={review} />
            ))}
        </div>

        {!isLoading && reviews.length > PREVIEW_COUNT && (
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => setShowAll((value) => !value)}
              className="rounded-md border border-navy px-5 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-navy hover:text-white dark:border-gold dark:text-gold dark:hover:bg-gold dark:hover:text-navy-ink"
            >
              {showAll ? 'Show fewer' : `Show all ${reviews.length} reviews`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
