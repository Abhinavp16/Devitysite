import { useEffect, useState } from 'react';
import publicApiService from '../services/publicApiService';
import SectionHeading from './SectionHeading';
import SkeletonBone from './SkeletonBone';

const BENTO_SIZE = 5; // photos shown in the feature grid; the rest go in a row below

const formatDate = (date) => date
  ? new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  : '';

const getMemoryId = (memory) => memory?.id ?? memory?._id ?? '';

// Pair each photo with its label, dropping empty slots
const getPhotos = (memory) => {
  const urls = memory?.image_urls?.length ? memory.image_urls : [memory?.image_url];
  const titles = memory?.image_titles || [];
  return urls
    .map((src, index) => ({ src, caption: titles[index] || '' }))
    .filter((photo) => photo.src);
};

// Grid layout adapts to how many photos an event has. The first photo is the large feature tile.
const bentoGridClass = (count) => {
  if (count === 1) return 'md:grid-cols-1 md:grid-rows-[420px]';
  if (count === 2) return 'md:grid-cols-2 md:grid-rows-[340px]';
  if (count === 3) return 'md:grid-cols-[2fr_1fr] md:grid-rows-[200px_200px]';
  return 'md:grid-cols-[2fr_1fr_1fr] md:grid-rows-[200px_200px]';
};

const bentoTileClass = (index, count) => {
  // Mobile: 2 columns, feature tile full width; an odd leftover tile spans the row
  const mobile = index === 0
    ? 'col-span-2 row-span-2'
    : index === count - 1 && (count - 1) % 2 === 1 ? 'col-span-2' : 'col-span-1';

  let desktop = 'md:col-span-1 md:row-span-1';
  if (index === 0 && count >= 3) desktop = 'md:col-span-1 md:row-span-2';
  if (index === 3 && count === 4) desktop = 'md:col-span-2 md:row-span-1';

  return `${mobile} ${desktop}`;
};

const PhotoTile = ({ photo, alt, className = '' }) => (
  <figure className={`relative m-0 overflow-hidden rounded-md bg-cream dark:bg-gray-800 ${className}`}>
    <img src={photo.src} alt={alt} loading="lazy" className="h-full w-full object-cover" />
    {photo.caption && (
      <figcaption className="absolute bottom-3 left-3 rounded-md bg-slate-900/75 px-2.5 py-1 text-xs font-semibold text-white">
        {photo.caption}
      </figcaption>
    )}
  </figure>
);

const ClubMemories = () => {
  const [memories, setMemories] = useState([]);
  const [activeMemoryId, setActiveMemoryId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    publicApiService.getMemories()
      .then((data) => {
        if (isMounted) {
          setMemories(data);
          setActiveMemoryId(getMemoryId(data[0]));
        }
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

  const activeMemory = memories.find((memory) => getMemoryId(memory) === activeMemoryId) || memories[0];
  const photos = getPhotos(activeMemory);
  const featured = photos.slice(0, BENTO_SIZE);
  const extra = photos.slice(BENTO_SIZE);
  const date = formatDate(activeMemory?.event_date);

  return (
    <section id="memories" className="bg-white py-20 transition-colors duration-300 dark:bg-slate-900 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Club memories" title="Moments from our events" />

        {isLoading && (
          <div role="status" aria-label="Loading memories">
            <div className="mb-6 flex flex-wrap gap-2">
              {[132, 96, 120, 112, 104].map((width, i) => (
                <SkeletonBone key={i} delay={i * 0.08} className="h-9 rounded-full" style={{ width }} />
              ))}
            </div>
            <SkeletonBone className="mb-6 h-4 w-full max-w-xl rounded-full" />
            <div className={`grid auto-rows-[150px] grid-cols-2 gap-3 ${bentoGridClass(BENTO_SIZE)}`}>
              {[0, 1, 2, 3, 4].map((i) => (
                <SkeletonBone key={i} delay={i * 0.1} className={`rounded-md ${bentoTileClass(i, BENTO_SIZE)}`} />
              ))}
            </div>
          </div>
        )}
        {error && <p className="text-red-600 dark:text-red-400">Unable to load memories: {error}</p>}
        {!isLoading && !error && memories.length === 0 && (
          <p className="text-slate-600 dark:text-gray-400">Photos from our events will appear here soon.</p>
        )}

        {activeMemory && (
          <>
            <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Choose an event">
              {memories.map((memory) => {
                const isActive = getMemoryId(memory) === getMemoryId(activeMemory);
                return (
                  <button
                    key={getMemoryId(memory) || memory.title}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setActiveMemoryId(getMemoryId(memory))}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${isActive
                      ? 'border-navy bg-navy text-white dark:border-gold dark:bg-gold dark:text-navy-ink'
                      : 'border-cream-line bg-white text-slate-600 hover:border-navy/40 hover:text-navy-ink dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gold/60 dark:hover:text-white'
                      }`}
                  >
                    {memory.title}
                  </button>
                );
              })}
            </div>

            {(date || activeMemory.description) && (
              <p className="mb-6 max-w-3xl text-sm leading-relaxed text-slate-600 line-clamp-2 dark:text-gray-400">
                {date && <span className="font-semibold text-navy-ink dark:text-gray-200">{date}</span>}
                {date && activeMemory.description && ' · '}
                {activeMemory.description}
              </p>
            )}

            {/* key re-mounts the grid so each event's photos fade in */}
            <div key={getMemoryId(activeMemory)} className="animate-fadeInUp">
              {featured.length > 0 ? (
                <div className={`grid auto-rows-[150px] grid-cols-2 gap-3 ${bentoGridClass(featured.length)}`}>
                  {featured.map((photo, index) => (
                    <PhotoTile
                      key={index}
                      photo={photo}
                      alt={photo.caption ? `${activeMemory.title} — ${photo.caption}` : activeMemory.title}
                      className={bentoTileClass(index, featured.length)}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-md border border-dashed border-cream-line py-16 text-center text-sm text-slate-500 dark:border-gray-700 dark:text-gray-400">
                  Photos from this event are coming soon.
                </div>
              )}

              {extra.length > 0 && (
                <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
                  {extra.map((photo, index) => (
                    <PhotoTile
                      key={index}
                      photo={photo}
                      alt={photo.caption ? `${activeMemory.title} — ${photo.caption}` : activeMemory.title}
                      className="h-40 md:h-48"
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default ClubMemories;
