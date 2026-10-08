import { useEffect, useRef, useState } from 'react';
import { initMobileOptimizations } from '../utils/mobileUtils';
import publicApiService, { mediaUrl } from '../services/publicApiService';
import HOME_DEFAULTS from '../config/homeDefaults';
import SkeletonBone from './SkeletonBone';
import devityLogo from '../img/devity logo.png';

const CONTENT_TIMEOUT_MS = 3000; // after this, show the built-in defaults instead of waiting

// Strip layout per photo slot (outer-left, inner-left, inner-right, outer-right); the video sits in the middle
const SLOT_STYLES = [
  { height: 'md:h-[200px]', mobileHidden: true },
  { height: 'md:h-[250px]' },
  { height: 'md:h-[250px]' },
  { height: 'md:h-[200px]', mobileHidden: true }
];

// Admin-edited values win; anything not customised falls back to the built-in default
const resolveContent = (data) => ({
  headline: data?.headline || HOME_DEFAULTS.headline,
  headline_highlight: data?.headline_highlight || HOME_DEFAULTS.headline_highlight,
  subtitle: data?.subtitle || HOME_DEFAULTS.subtitle,
  photos: HOME_DEFAULTS.photos.map((fallback, index) => {
    const photo = data?.photos?.[index];
    return {
      src: photo?.media_id ? mediaUrl(photo.media_id) : fallback.src,
      fallbackSrc: fallback.src,
      alt: photo?.alt || fallback.alt
    };
  }),
  video: data?.video_id ? mediaUrl(data.video_id) : HOME_DEFAULTS.video,
  speaker_companies: data?.speaker_companies?.length ? data.speaker_companies : HOME_DEFAULTS.speaker_companies
});

const withTimeout = (promise, ms) => Promise.race([
  promise,
  new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms))
]);

const slotClass = (index) => {
  const { height, mobileHidden } = SLOT_STYLES[index];
  return `h-[170px] w-full rounded-md ${height} ${mobileHidden ? 'hidden md:block' : ''}`;
};

const Hero = () => {
  const videoRef = useRef(null);
  const [content, setContent] = useState(null); // null while loading
  const [videoSrc, setVideoSrc] = useState(null);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    initMobileOptimizations();

    let isMounted = true;
    withTimeout(publicApiService.getHome(), CONTENT_TIMEOUT_MS)
      .then((data) => resolveContent(data))
      .catch(() => resolveContent(null))
      .then((resolved) => {
        if (!isMounted) return;
        setContent(resolved);
        setVideoSrc(resolved.video);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Some mobile browsers ignore autoPlay until the first interaction — retry then
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;
    // React sets `muted` only as a property; iOS Safari also needs the attribute to allow autoplay
    video.muted = true;
    video.setAttribute('muted', '');
    const controller = new AbortController();
    video.play().catch(() => {
      document.addEventListener('click', () => video.play().catch(() => {}), { once: true, signal: controller.signal });
    });
    return () => controller.abort();
  }, [videoSrc]);

  // A broken custom video falls back to the built-in one, then to the static logo
  const handleVideoError = () => {
    if (videoSrc !== HOME_DEFAULTS.video) setVideoSrc(HOME_DEFAULTS.video);
    else setVideoFailed(true);
  };

  const isLoading = content === null;

  // z-10 keeps the hero above the page-wide fixed AnimatedBackground layer, which otherwise washes it out
  return (
    <section id="home" className="relative z-10 overflow-hidden bg-cream pb-16 pt-32 transition-colors duration-300 dark:bg-slate-900 sm:pt-36 md:pb-20">
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-dark dark:text-gold">
          Devity Club · Amity University Chhattisgarh
        </p>
        <span className="mx-auto mt-2 block h-0.5 w-11 bg-gold" aria-hidden="true" />

        {isLoading ? (
          <div className="mt-6 flex flex-col items-center gap-3" role="status" aria-label="Loading">
            <SkeletonBone className="h-11 w-[90%] max-w-[760px] rounded-lg sm:h-14 lg:h-[4.25rem]" />
            <SkeletonBone delay={0.1} className="h-11 w-[65%] max-w-[520px] rounded-lg sm:h-14 lg:h-[4.25rem]" />
            <SkeletonBone delay={0.2} className="mt-3 h-4 w-[80%] max-w-[520px] rounded-full" />
            <SkeletonBone delay={0.25} className="h-4 w-[45%] max-w-[260px] rounded-full" />
          </div>
        ) : (
          <>
            <h1 className="mx-auto mt-6 max-w-4xl font-display text-[2.6rem] font-extrabold leading-[1.08] tracking-tight text-navy-ink dark:text-white sm:text-6xl lg:text-[4.25rem]">
              {content.headline}{' '}
              <span className="text-navy dark:text-gold">{content.headline_highlight}</span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-600 dark:text-gray-300">
              {content.subtitle}
            </p>
          </>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href="#contact" className="rounded-md bg-navy px-6 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-navy-ink dark:bg-gold dark:text-navy-ink dark:hover:bg-gold/90">
            Join the club →
          </a>
          <a href="#events" className="rounded-md border border-cream-line bg-white px-6 py-3 text-[15px] font-semibold text-navy-ink transition-colors hover:border-navy/40 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:border-gold/60">
            Upcoming events
          </a>
        </div>
      </div>

      {/* Photo strip with the looping logo video in the centre */}
      <div className="mx-auto mt-14 grid max-w-[1400px] grid-cols-3 items-center gap-3 px-4 sm:px-8 md:grid-cols-[1fr_1.15fr_1.3fr_1.15fr_1fr] md:gap-4">
        {[0, 1, 2, 3].map((index) => {
          const photo = content?.photos[index];
          const tile = isLoading ? (
            <SkeletonBone key={index} delay={index * 0.1} className={slotClass(index)} />
          ) : (
            <img
              key={index}
              src={photo.src}
              alt={photo.alt}
              className={`${slotClass(index)} object-cover`}
              onError={(e) => {
                // Custom photo missing/broken → show the built-in photo instead (once, so it can't loop)
                if (!e.currentTarget.dataset.usedFallback) {
                  e.currentTarget.dataset.usedFallback = 'true';
                  e.currentTarget.src = photo.fallbackSrc;
                }
              }}
            />
          );

          // Video tile goes between the two inner photos
          if (index !== 2) return tile;
          return [
            <div key="video" className="flex h-[210px] items-center justify-center overflow-hidden rounded-md border-2 border-gold bg-white dark:bg-gray-800 md:h-[300px]">
              {isLoading || videoFailed ? (
                <img src={devityLogo} alt="Devity Club logo" className={`h-1/3 w-auto object-contain ${isLoading ? 'sk-breathe' : ''}`} />
              ) : (
                <video
                  ref={videoRef}
                  key={videoSrc}
                  src={videoSrc}
                  className="h-full w-full bg-white object-contain"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  aria-label="Devity Club animated logo"
                  onError={handleVideoError}
                />
              )}
            </div>,
            tile
          ];
        })}
      </div>

      <div className="mx-auto mt-12 max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        {/* Double-click is the hidden entry to the admin login */}
        <p
          onDoubleClick={() => { window.location.href = '/login'; }}
          className="cursor-default select-none text-[13px] text-slate-500 dark:text-gray-400"
        >
          Our speakers come from
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-lg font-bold tracking-tight text-slate-400 dark:text-gray-500">
          {isLoading
            ? [80, 60, 84, 52, 92, 64, 70].map((width, i) => (
              <SkeletonBone key={i} delay={i * 0.06} className="h-5 rounded-full" style={{ width }} />
            ))
            : content.speaker_companies.map((company) => <span key={company}>{company}</span>)}
        </div>
      </div>
    </section>
  );
};

export default Hero;
