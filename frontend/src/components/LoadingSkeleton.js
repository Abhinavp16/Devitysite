import devityLogo from '../img/devity logo.png';
import Bone from './SkeletonBone';

// Mirrors the real Header + Hero layout so the swap to real content doesn't shift anything.
const LoadingSkeleton = ({ progress = 0, currentStep = 'Loading…' }) => (
  <div className="min-h-screen bg-cream transition-colors duration-300 dark:bg-slate-900" role="status" aria-live="polite">
    <span className="sr-only">{currentStep}</span>

    {/* Real loading progress */}
    <div className="fixed inset-x-0 top-0 z-[60] h-[3px] bg-transparent">
      <div className="h-full bg-gold transition-[width] duration-300 ease-out" style={{ width: `${progress}%` }} />
    </div>

    {/* Navbar */}
    <div className="fixed left-0 right-0 top-0 z-50 flex justify-center pt-2 sm:pt-4 md:pt-6">
      <div className="w-[98%] max-w-7xl rounded-2xl border border-gold/30 bg-navy/95 py-2 shadow-2xl sm:w-[95%] sm:py-3">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="rounded-full border border-white/20 bg-white/5 p-1.5 sm:p-2">
            <img src={devityLogo} alt="" className="h-10 w-auto sm:h-12" />
          </div>
          <div className="hidden gap-2 md:flex">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <Bone key={i} onNavy delay={i * 0.08} className="h-9 w-16 rounded-xl lg:h-10 lg:w-20" />
            ))}
          </div>
          <Bone onNavy className="h-9 w-9 rounded-xl md:hidden" />
        </div>
      </div>
    </div>

    {/* Hero */}
    <section className="pb-16 pt-32 sm:pt-36 md:pb-20">
      <div className="mx-auto flex max-w-5xl flex-col items-center px-4 sm:px-6 lg:px-8">
        <Bone className="h-3 w-64 rounded-full" />
        <span className="mt-2 block h-0.5 w-11 bg-gold" aria-hidden="true" />

        <div className="mt-6 flex w-full flex-col items-center gap-3">
          <Bone delay={0.1} className="h-11 w-[90%] max-w-[760px] rounded-lg sm:h-14 lg:h-[4.25rem]" />
          <Bone delay={0.2} className="h-11 w-[65%] max-w-[520px] rounded-lg sm:h-14 lg:h-[4.25rem]" />
        </div>

        <div className="mt-6 flex w-full flex-col items-center gap-2">
          <Bone delay={0.3} className="h-4 w-[80%] max-w-[520px] rounded-full" />
          <Bone delay={0.35} className="h-4 w-[45%] max-w-[260px] rounded-full" />
        </div>

        <div className="mt-8 flex gap-3">
          <div className="sk h-12 w-40 rounded-md !bg-navy/80 dark:!bg-gold/40" style={{ '--sk-delay': '0.4s' }} aria-hidden="true" />
          <Bone delay={0.45} className="h-12 w-40 rounded-md border border-cream-line dark:border-gray-700" />
        </div>
      </div>

      {/* Photo strip with the logo tile in the centre */}
      <div className="mx-auto mt-14 grid max-w-[1400px] grid-cols-3 items-center gap-3 px-4 sm:px-8 md:grid-cols-[1fr_1.15fr_1.3fr_1.15fr_1fr] md:gap-4">
        <Bone delay={0.15} className="hidden h-[170px] rounded-md md:block md:h-[200px]" />
        <Bone delay={0.25} className="h-[170px] rounded-md md:h-[250px]" />
        <div className="flex h-[210px] items-center justify-center rounded-md border-2 border-gold bg-white dark:bg-gray-800 md:h-[300px]">
          <img src={devityLogo} alt="" className="sk-breathe h-1/3 w-auto object-contain" />
        </div>
        <Bone delay={0.35} className="h-[170px] rounded-md md:h-[250px]" />
        <Bone delay={0.45} className="hidden h-[170px] rounded-md md:block md:h-[200px]" />
      </div>

      {/* "Our speakers come from" row */}
      <div className="mx-auto mt-12 flex max-w-5xl flex-col items-center px-4">
        <Bone className="h-3 w-36 rounded-full" />
        <div className="mt-5 flex flex-wrap justify-center gap-x-8 gap-y-3">
          {[80, 60, 84, 52, 92, 64, 70].map((width, i) => (
            <Bone key={i} delay={i * 0.06} className="h-5 rounded-full" style={{ width }} />
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default LoadingSkeleton;
