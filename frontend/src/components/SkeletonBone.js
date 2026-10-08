import '../styles/skeleton.css';

// Shimmer placeholder block. `delay` staggers the sweep so blocks don't flash in lockstep.
const SkeletonBone = ({ className = '', delay = 0, onNavy = false, style }) => (
  <div
    className={`sk ${onNavy ? 'sk-on-navy' : ''} ${className}`}
    style={{ '--sk-delay': `${delay}s`, ...style }}
    aria-hidden="true"
  />
);

export default SkeletonBone;
