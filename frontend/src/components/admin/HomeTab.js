import { useEffect, useState } from 'react';
import apiService from '../../services/apiService';
import { mediaUrl } from '../../services/publicApiService';
import HOME_DEFAULTS, { PHOTO_SLOT_LABELS } from '../../config/homeDefaults';
import { useToast, ToastContainer, useReportUnsaved } from '../AdminDashboardTabs';

// Must match backend/routes/home.js
const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
const MAX_VIDEO_BYTES = 4 * 1024 * 1024;
const VIDEO_TYPES = ['video/mp4', 'video/webm'];
const MAX_IMAGE_DIMENSION = 1000;
const MAX_COMPANIES = 20;

const EMPTY_FORM = { headline: '', headline_highlight: '', subtitle: '', photo_alts: ['', '', '', ''], speaker_companies: [] };

// Resize and re-encode a photo in the browser (WebP, or JPEG where WebP encoding isn't supported)
const compressImage = (file) => new Promise((resolve, reject) => {
  const url = URL.createObjectURL(file);
  const image = new Image();

  image.onload = () => {
    URL.revokeObjectURL(url);
    const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(image.width, image.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(image.width * scale);
    canvas.height = Math.round(image.height * scale);
    canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);

    const encode = (type, quality) => new Promise((done) => canvas.toBlob(done, type, quality));
    encode('image/webp', 0.8)
      .then((blob) => (blob && blob.type === 'image/webp' ? blob : encode('image/jpeg', 0.82)))
      .then((blob) => (blob ? resolve(blob) : reject(new Error('Could not process this image'))));
  };
  image.onerror = () => {
    URL.revokeObjectURL(url);
    reject(new Error('That file is not a readable image'));
  };
  image.src = url;
});

const formFromContent = (data) => ({
  headline: data.headline || '',
  headline_highlight: data.headline_highlight || '',
  subtitle: data.subtitle || '',
  photo_alts: data.photos.map((photo) => photo.alt || ''),
  // Start from the defaults so admins edit the list visitors currently see
  speaker_companies: data.speaker_companies || HOME_DEFAULTS.speaker_companies
});

const inputClass = 'w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent';

const Card = ({ title, description, children }) => (
  <section className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    {description && <p className="mb-5 mt-1 text-sm text-gray-500">{description}</p>}
    {children}
  </section>
);

const SourceBadge = ({ custom }) => (
  <span className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[11px] font-semibold ${custom ? 'bg-accent text-white' : 'bg-white/90 text-gray-600'}`}>
    {custom ? 'Custom' : 'Default'}
  </span>
);

// Upload/replace + reset controls shared by photo and video slots
const SlotActions = ({ custom, busy, accept, onFile, onReset }) => (
  <div className="mt-3 flex gap-2">
    <label className={`flex-1 cursor-pointer rounded-lg border border-gray-200 bg-white px-3 py-2 text-center text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 ${busy ? 'pointer-events-none opacity-60' : ''}`}>
      {busy ? 'Working…' : custom ? 'Replace' : 'Upload'}
      <input
        type="file"
        accept={accept}
        className="hidden"
        disabled={busy}
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = '';
          if (file) onFile(file);
        }}
      />
    </label>
    {custom && (
      <button
        type="button"
        onClick={onReset}
        disabled={busy}
        className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 disabled:opacity-60"
      >
        Reset
      </button>
    )}
  </div>
);

const HomeTab = () => {
  const { toasts, toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busySlot, setBusySlot] = useState(null); // photo index or 'video'
  const [form, setForm] = useState(EMPTY_FORM);
  const [savedForm, setSavedForm] = useState(EMPTY_FORM);
  const [media, setMedia] = useState({ photos: [null, null, null, null], video_id: null });
  const [newCompany, setNewCompany] = useState('');

  const applyMedia = (data) => setMedia({ photos: data.photos.map((photo) => photo.media_id), video_id: data.video_id });

  useEffect(() => {
    apiService.getHomeContent()
      .then((res) => {
        const loaded = formFromContent(res.data);
        setForm(loaded);
        setSavedForm(loaded);
        applyMedia(res.data);
      })
      .catch((error) => toast.error('Failed to load home page content: ' + error.message))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isDirty = JSON.stringify(form) !== JSON.stringify(savedForm);
  useReportUnsaved('home', isDirty); // warn before leaving the tab with unsaved text
  const setField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await apiService.updateHomeContent(form);
      const saved = formFromContent(res.data);
      setForm(saved);
      setSavedForm(saved);
      toast.success('Home page updated');
    } catch (error) {
      toast.error('Error saving: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  // Uploads and resets apply immediately; only media ids are taken from the response so
  // unsaved text edits in the form are kept.
  const runMediaAction = async (slot, action, successMessage) => {
    setBusySlot(slot);
    try {
      const res = await action();
      applyMedia(res.data);
      toast.success(successMessage);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusySlot(null);
    }
  };

  const handlePhotoFile = (index, file) => runMediaAction(index, async () => {
    const blob = await compressImage(file);
    if (blob.size > MAX_IMAGE_BYTES) throw new Error('Photo is still over 2 MB after compression — try a smaller image');
    return apiService.uploadHomePhoto(index, blob);
  }, `${PHOTO_SLOT_LABELS[index]} photo updated`);

  const handlePhotoReset = (index) => {
    if (!window.confirm(`Reset the ${PHOTO_SLOT_LABELS[index].toLowerCase()} photo to the default?`)) return;
    runMediaAction(index, () => apiService.resetHomePhoto(index), 'Photo reset to default');
  };

  const handleVideoFile = (file) => {
    if (!VIDEO_TYPES.includes(file.type)) {
      toast.error('Video must be an MP4 or WebM file');
      return;
    }
    if (file.size > MAX_VIDEO_BYTES) {
      toast.error(`Video is ${(file.size / 1024 / 1024).toFixed(1)} MB — the limit is 4 MB`);
      return;
    }
    runMediaAction('video', () => apiService.uploadHomeVideo(file), 'Video updated');
  };

  const handleVideoReset = () => {
    if (!window.confirm('Reset the centre video to the default logo animation?')) return;
    runMediaAction('video', () => apiService.resetHomeVideo(), 'Video reset to default');
  };

  const addCompany = () => {
    const name = newCompany.trim();
    if (!name) return;
    if (form.speaker_companies.some((company) => company.toLowerCase() === name.toLowerCase())) {
      toast.info(`${name} is already in the list`);
      return;
    }
    if (form.speaker_companies.length >= MAX_COMPANIES) {
      toast.error(`You can list up to ${MAX_COMPANIES} companies`);
      return;
    }
    setField('speaker_companies', [...form.speaker_companies, name.slice(0, 40)]);
    setNewCompany('');
  };

  const removeCompany = (name) => setField('speaker_companies', form.speaker_companies.filter((company) => company !== name));

  if (loading) {
    return <p className="py-12 text-center text-gray-500">Loading home page content…</p>;
  }

  const photoSlot = (index) => {
    const customId = media.photos[index];
    return (
      <div key={index} className="flex flex-col">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">{PHOTO_SLOT_LABELS[index]}</p>
        <div className="relative h-36 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
          <img
            src={customId ? mediaUrl(customId) : HOME_DEFAULTS.photos[index].src}
            alt={form.photo_alts[index] || HOME_DEFAULTS.photos[index].alt}
            className="h-full w-full object-cover"
          />
          <SourceBadge custom={Boolean(customId)} />
        </div>
        <SlotActions
          custom={Boolean(customId)}
          busy={busySlot === index}
          accept="image/*"
          onFile={(file) => handlePhotoFile(index, file)}
          onReset={() => handlePhotoReset(index)}
        />
        <input
          type="text"
          value={form.photo_alts[index]}
          onChange={(e) => setField('photo_alts', form.photo_alts.map((alt, i) => (i === index ? e.target.value : alt)))}
          maxLength={150}
          className={`${inputClass} mt-2 text-sm`}
          placeholder={HOME_DEFAULTS.photos[index].alt}
          aria-label={`${PHOTO_SLOT_LABELS[index]} photo description`}
        />
      </div>
    );
  };

  return (
    <div className="pb-20">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Home Page</h2>
          <p className="text-gray-600">Edit the first section visitors see. Empty fields use the built-in default.</p>
        </div>
        <a href="/#home" target="_blank" rel="noopener noreferrer" className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
          View on site ↗
        </a>
      </div>

      <Card title="Headline and text" description="The highlighted part is shown in colour after the headline.">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Headline</label>
            <input type="text" value={form.headline} onChange={(e) => setField('headline', e.target.value)} maxLength={120} className={inputClass} placeholder={HOME_DEFAULTS.headline} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Highlighted part</label>
            <input type="text" value={form.headline_highlight} onChange={(e) => setField('headline_highlight', e.target.value)} maxLength={80} className={inputClass} placeholder={HOME_DEFAULTS.headline_highlight} />
          </div>
        </div>
        <div className="mt-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">Subtitle</label>
          <textarea value={form.subtitle} onChange={(e) => setField('subtitle', e.target.value)} maxLength={300} rows={2} className={inputClass} placeholder={HOME_DEFAULTS.subtitle} />
        </div>

        {/* Live preview in the site's own styles */}
        <div className="mt-5 rounded-lg bg-cream px-6 py-8 text-center">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-gold-dark">Preview</p>
          <p className="font-display text-3xl font-extrabold leading-tight text-navy-ink">
            {form.headline || HOME_DEFAULTS.headline}{' '}
            <span className="text-navy">{form.headline_highlight || HOME_DEFAULTS.headline_highlight}</span>
          </p>
          <p className="mx-auto mt-3 max-w-lg text-slate-600">{form.subtitle || HOME_DEFAULTS.subtitle}</p>
        </div>
      </Card>

      <Card
        title="Photo strip"
        description="Same order as on the site. Photos upload straight away and are compressed automatically; descriptions are saved with Save changes."
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {photoSlot(0)}
          {photoSlot(1)}
          <div className="flex flex-col">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Centre video</p>
            <div className="relative h-36 overflow-hidden rounded-lg border-2 border-gold bg-white">
              <video
                key={media.video_id || 'default'}
                src={media.video_id ? mediaUrl(media.video_id) : HOME_DEFAULTS.video}
                className="h-full w-full object-contain"
                autoPlay
                loop
                muted
                playsInline
              />
              <SourceBadge custom={Boolean(media.video_id)} />
            </div>
            <SlotActions
              custom={Boolean(media.video_id)}
              busy={busySlot === 'video'}
              accept="video/mp4,video/webm"
              onFile={handleVideoFile}
              onReset={handleVideoReset}
            />
            <p className="mt-2 text-xs text-gray-500">MP4 or WebM, up to 4 MB. Plays muted on a loop.</p>
          </div>
          {photoSlot(2)}
          {photoSlot(3)}
        </div>
      </Card>

      <Card title="“Our speakers come from”" description="Company names shown under the photos.">
        <div className="mb-4 flex flex-wrap gap-2">
          {form.speaker_companies.map((company) => (
            <span key={company} className="inline-flex items-center gap-1 rounded-full bg-gray-100 py-1 pl-3 pr-1 text-sm font-medium text-gray-800">
              {company}
              <button
                type="button"
                onClick={() => removeCompany(company)}
                className="flex h-6 w-6 items-center justify-center rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-800"
                aria-label={`Remove ${company}`}
              >
                ×
              </button>
            </span>
          ))}
          {form.speaker_companies.length === 0 && <p className="text-sm text-gray-500">No names — the default list will be shown.</p>}
        </div>
        <div className="flex max-w-md gap-2">
          <input
            type="text"
            value={newCompany}
            onChange={(e) => setNewCompany(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addCompany();
              }
            }}
            maxLength={40}
            className={inputClass}
            placeholder="Add a company, e.g. Google"
          />
          <button type="button" onClick={addCompany} className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-900">
            Add
          </button>
        </div>
      </Card>

      {/* Save bar */}
      <div className="sticky bottom-4 z-10 flex items-center justify-end gap-3 rounded-xl border border-gray-200 bg-white/95 p-4 shadow-lg backdrop-blur">
        <span className="mr-auto text-sm text-gray-600">{isDirty ? 'You have unsaved changes' : 'All changes saved'}</span>
        <button
          type="button"
          onClick={() => setForm(savedForm)}
          disabled={!isDirty || saving}
          className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 disabled:opacity-50"
        >
          Discard
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={!isDirty || saving}
          className="rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-accent-dark disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>

      <ToastContainer toasts={toasts} />
    </div>
  );
};

export default HomeTab;
