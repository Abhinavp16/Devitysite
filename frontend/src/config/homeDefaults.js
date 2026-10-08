// Built-in home (hero) content. Used whenever the admin hasn't customised a field,
// and as the fallback if the API can't be reached.
const asset = (path) => `${process.env.PUBLIC_URL}/assets/${path}`;

const HOME_DEFAULTS = {
  headline: "Where Amity's builders learn",
  headline_highlight: 'from the industry.',
  subtitle: 'Workshops, hackathons and sessions with engineers who ship real products.',
  // Strip order: outer-left, inner-left, inner-right, outer-right (the logo video sits in the middle)
  photos: [
    { src: asset('hero/tech-elevate.jpg'), alt: 'Tech Elevate session' },
    { src: asset('hero/devity-summit.jpg'), alt: 'Hands-on training at Devity Summit' },
    { src: asset('hero/envision-x.jpg'), alt: 'Envision X presentation' },
    { src: asset('hero/code-fusion.jpg'), alt: 'Code Fusion workshop' }
  ],
  video: asset('videos/devity_logo.mp4'),
  speaker_companies: ['Microsoft', 'Adobe', 'MongoDB', 'DELL', 'Salesforce', 'Optum', 'McAfee']
};

export const PHOTO_SLOT_LABELS = ['Outer left', 'Inner left', 'Inner right', 'Outer right'];

export default HOME_DEFAULTS;
