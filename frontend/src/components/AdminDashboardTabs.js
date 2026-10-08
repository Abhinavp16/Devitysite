import { createContext, useContext, useEffect, useRef, useState } from 'react';
import apiService from '../services/apiService';
import Icon from './admin/icons';

// ─── Toast notification system ────────────────────────────────────────────────
// Usage: const { toasts, toast } = useToast();
//        toast.success('Done!') | toast.error('Oops') | toast.info('Note')
// Render: <ToastContainer toasts={toasts} />
// Inside the dashboard, ToastContext supplies one shared toast list (owned by AdminDashboard)
// so messages survive switching tabs; tabs then get an empty local list to render.

export const ToastContext = createContext(null);

export const useToast = () => {
  const shared = useContext(ToastContext);
  const [toasts, setToasts] = useState([]);

  const push = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  };

  if (shared) return { toasts: [], toast: shared };

  return {
    toasts,
    toast: {
      success: (msg) => push(msg, 'success'),
      error:   (msg) => push(msg, 'error'),
      info:    (msg) => push(msg, 'info'),
    }
  };
};

export const ToastContainer = ({ toasts }) => {
  if (!toasts.length) return null;
  const colours = {
    success: 'bg-green-600',
    error:   'bg-red-600',
    info:    'bg-blue-600',
  };
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`${colours[t.type] || colours.success} text-white px-4 py-3 rounded-xl shadow-xl text-sm font-medium max-w-sm animate-fadeInUp`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
};

// ─── Unsaved-changes guard ────────────────────────────────────────────────────
// Forms report whether they have unsaved edits; AdminDashboard asks before switching tabs,
// logging out or closing the page.

export const UnsavedChangesContext = createContext(() => {});

export const useReportUnsaved = (source, isDirty) => {
  const setDirty = useContext(UnsavedChangesContext);
  useEffect(() => {
    setDirty(source, isDirty);
    return () => setDirty(source, false);
  }, [source, isDirty, setDirty]);
};

// Tracks a modal form's edits since it was opened; returns a close handler that confirms before discarding.
const useFormGuard = (source, showForm, formData, resetForm) => {
  const [snapshot, setSnapshot] = useState(null);
  useEffect(() => {
    setSnapshot(showForm ? JSON.stringify(formData) : null);
  // Snapshot only when the form opens
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showForm]);

  const isDirty = showForm && snapshot !== null && JSON.stringify(formData) !== snapshot;
  useReportUnsaved(source, isDirty);

  return () => {
    if (!isDirty || window.confirm('Discard your unsaved changes?')) resetForm();
  };
};

// ─── Shared UI ────────────────────────────────────────────────────────────────

// Slide-over panel from the right (used for every form): closes on Esc or backdrop click,
// locks page scroll and focuses the first field.
export const Modal = ({ onClose, maxWidth = 'max-w-xl', label, children }) => {
  const panelRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onCloseRef.current(); };
    document.addEventListener('keydown', handleKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.querySelector('input:not([type=file]), textarea, select')?.focus();
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 animate-fade-in bg-slate-950/40" onMouseDown={() => onCloseRef.current()} aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className={`relative h-full w-full ${maxWidth} animate-drawer-in overflow-y-auto bg-white p-6 shadow-2xl sm:p-8`}
      >
        <button
          type="button"
          onClick={() => onCloseRef.current()}
          className="absolute right-4 top-4 rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
          aria-label="Close (Esc)"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
        </button>
        {children}
      </div>
    </div>
  );
};

export const SearchInput = ({ value, onChange, placeholder }) => (
  <div className="relative mb-6 max-w-md">
    <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-4.35-4.35M17 10.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z" />
    </svg>
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label={placeholder}
      className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
    />
  </div>
);

// Case-insensitive match of `query` against the given fields of an item
const matchesSearch = (item, fields, query) => {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return fields.some((field) => String(item[field] ?? '').toLowerCase().includes(q));
};

// Shown instead of the "No items yet" empty state when loading failed
const LoadErrorState = ({ what, onRetry }) => (
  <div className="text-center py-12">
    <div className="text-red-400 text-5xl mb-4">⚠️</div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">Couldn't load {what}</h3>
    <p className="text-gray-600 mb-4">Your content is safe — the server couldn't be reached.</p>
    {onRetry && (
      <button onClick={() => onRetry().catch(() => {})} className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors">
        Try again
      </button>
    )}
  </div>
);

const NoSearchResults = ({ query }) => (
  <p className="py-10 text-center text-gray-500">Nothing matches “{query}”.</p>
);

// Placeholder links like '#' (from seed data) aren't valid URLs and would block saving the form
const cleanUrl = (url) => (/^https?:\/\//i.test(url || '') ? url : '');

const MAX_MEMORY_IMAGES = 10;
// Shown as placeholders only — empty labels stay empty instead of saving made-up captions
const defaultMemoryImageTitles = [
  'Opening Ceremony',
  'Interactive Session',
  'Team Collaboration',
  'Problem Solving',
  'Award Ceremony',
  'Networking Session',
  'Project Showcase',
  'Hands-on Training',
  'Team Presentation',
  'Closing Ceremony'
];
const emptyMemoryImages = () => Array(MAX_MEMORY_IMAGES).fill('');

const ImageUploadField = ({ label, value, onChange }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const convertImageToWebpDataUrl = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const image = new Image();

        image.onload = () => {
          const maxSize = 900;
          const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
          const canvas = document.createElement('canvas');
          canvas.width = Math.round(image.width * scale);
          canvas.height = Math.round(image.height * scale);

          const context = canvas.getContext('2d');
          context.drawImage(image, 0, 0, canvas.width, canvas.height);

          const dataUrl = canvas.toDataURL('image/webp', 0.75);
          resolve(dataUrl);
        };

        image.onerror = () => reject(new Error('That file is not a readable image'));
        image.src = reader.result;
      };

      reader.onerror = () => reject(new Error('Unable to read the file'));
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');
    try {
      const dataUrl = await convertImageToWebpDataUrl(file);
      onChange(dataUrl);
    } catch (err) {
      setError('Image upload failed: ' + err.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="space-y-3">
        {value && (
          <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
          </div>
        )}
        <input
          type="url"
          value={value?.startsWith('data:') ? '' : value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
          placeholder="https://example.com/image.jpg"
        />
        <div className="flex flex-wrap gap-2">
          <label className="inline-flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer border border-gray-300 text-sm font-medium">
            {uploading ? 'Compressing...' : value ? 'Replace Image' : 'Upload Image'}
            <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} className="hidden" />
          </label>
          {value && (
            <button
              type="button"
              onClick={() => { onChange(''); setError(''); }}
              className="px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors text-sm font-medium"
            >
              Remove
            </button>
          )}
        </div>
        {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
      </div>
    </div>
  );
};

// Overview Tab Component
const activityLabels = {
  club_memories: 'club memory',
  events: 'event',
  team_members: 'team member',
  guest_speakers: 'guest speaker',
  event_speakers: 'event speaker',
  admin_users: 'admin user',
  speaker_reviews: 'speaker review',
  site_content: 'home page'
};

const activityColors = {
  CREATE: 'bg-green-500',
  UPDATE: 'bg-blue-500',
  DELETE: 'bg-red-500',
  LOGIN: 'bg-purple-500',
  LOGOUT: 'bg-gray-500'
};

const formatActivity = (activity) => {
  const action = String(activity.action || '').toLowerCase();
  const label = activityLabels[activity.table_name] || activity.table_name || 'item';

  if (activity.action === 'LOGIN') return `${activity.username || 'Admin'} logged in`;
  if (activity.action === 'LOGOUT') return `${activity.username || 'Admin'} logged out`;
  return `${activity.username || 'Admin'} ${action}d ${label}`;
};

export const ActivityItem = ({ activity }) => (
  <div className="flex items-start text-sm text-gray-600">
    <div className={`w-2 h-2 ${activityColors[activity.action] || 'bg-indigo-500'} rounded-full mr-3 mt-1.5 flex-shrink-0`}></div>
    <div>
      <p>{formatActivity(activity)}</p>
      {activity.created_at && <p className="text-xs text-gray-400 mt-0.5">{new Date(activity.created_at).toLocaleString()}</p>}
    </div>
  </div>
);

// Full, paginated activity history
export const ActivityLogModal = ({ onClose }) => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    apiService.getActivities({ page, limit: 20 })
      .then((res) => {
        setItems((prev) => (page === 1 ? res.data : [...prev, ...res.data]));
        setPages(res.pagination?.pages || 1);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <Modal onClose={onClose} maxWidth="max-w-lg" label="Activity log">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-bold">Activity log</h3>
        <button onClick={onClose} className="rounded-lg px-2 py-1 text-gray-500 hover:bg-gray-100" aria-label="Close">✕</button>
      </div>
      {error && <p className="text-sm text-red-600">Couldn't load activity: {error}</p>}
      <div className="space-y-3">
        {items.map((activity) => <ActivityItem key={activity.id} activity={activity} />)}
        {!loading && !error && items.length === 0 && <p className="text-sm text-gray-500">No activity yet.</p>}
      </div>
      {page < pages && (
        <button onClick={() => setPage((p) => p + 1)} disabled={loading} className="mt-5 w-full rounded-lg border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
          {loading ? 'Loading…' : 'Load more'}
        </button>
      )}
      {loading && page === 1 && <p className="text-sm text-gray-500">Loading…</p>}
    </Modal>
  );
};

// Club Memories Tab Component with Full CRUD
export const MemoriesTab = ({ dashboardData, setDashboardData, onDataChanged, refreshData, loadError, openNewSignal, initialSearch }) => {
  const { toasts, toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingMemory, setEditingMemory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    image_urls: emptyMemoryImages(),
    image_titles: emptyMemoryImages(),
    event_date: ''
  });

  const updateMemoryImage = (index, imageUrl) => {
    const imageUrls = [...(formData.image_urls || emptyMemoryImages())];
    imageUrls[index] = imageUrl;
    setFormData({ ...formData, image_urls: imageUrls, image_url: imageUrls[0] || '' });
  };

  const updateMemoryImageTitle = (index, title) => {
    const imageTitles = [...(formData.image_titles || emptyMemoryImages())];
    imageTitles[index] = title;
    setFormData({ ...formData, image_titles: imageTitles });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;
      if (editingMemory) {
        response = await apiService.updateMemory(editingMemory.id, formData);
      } else {
        response = await apiService.createMemory(formData);
      }

      if (response.success) {
        // Refresh the memories list
        const memoriesResponse = await apiService.getMemories();
        if (memoriesResponse.success) {
          setDashboardData(prev => ({
            ...prev,
            clubMemories: memoriesResponse.data
          }));
        }
        resetForm();
        onDataChanged && onDataChanged();
        toast.success(editingMemory ? 'Memory updated!' : 'Memory created!');
      }
    } catch (error) {
      console.error('Error saving memory:', error);
      toast.error('Error saving memory: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (memory) => {
    setEditingMemory(memory);
    setFormData({
      title: memory.title,
      description: memory.description,
      image_url: memory.image_url || '',
      image_urls: [...(memory.image_urls && memory.image_urls.length ? memory.image_urls : [memory.image_url || '']), ...emptyMemoryImages()].slice(0, MAX_MEMORY_IMAGES),
      image_titles: [...(memory.image_titles || []), ...emptyMemoryImages()].slice(0, MAX_MEMORY_IMAGES),
      event_date: memory.event_date
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this memory?')) {
      try {
        const response = await apiService.deleteMemory(id);
        if (response.success) {
          // Refresh the memories list
          const memoriesResponse = await apiService.getMemories();
          if (memoriesResponse.success) {
            setDashboardData(prev => ({
              ...prev,
              clubMemories: memoriesResponse.data
            }));
            onDataChanged && onDataChanged();
          }
          toast.success('Memory deleted!');
        }
      } catch (error) {
        console.error('Error deleting memory:', error);
        toast.error('Error deleting memory: ' + error.message);
      }
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', image_url: '', image_urls: emptyMemoryImages(), image_titles: emptyMemoryImages(), event_date: '' });
    setEditingMemory(null);
    setShowForm(false);
  };

  const requestClose = useFormGuard('memories', showForm, formData, resetForm);
  const [search, setSearch] = useState(initialSearch || '');
  // "New …" from the top bar / quick actions opens the create form
  useEffect(() => {
    if (openNewSignal) setShowForm(true);
  }, [openNewSignal]);
  const visibleMemories = dashboardData.clubMemories.filter((memory) => matchesSearch(memory, ['title', 'description'], search));

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Club Memories</h2>
          <p className="text-gray-600">Manage club photos and memories</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors shadow-sm font-semibold"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Memory
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <Modal onClose={requestClose} maxWidth="max-w-2xl" label="Memory">
            <h3 className="text-xl font-bold mb-4">
              {editingMemory ? 'Edit Memory' : 'Add New Memory'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                  rows="3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Memory Card Images</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(formData.image_urls || emptyMemoryImages()).slice(0, MAX_MEMORY_IMAGES).map((imageUrl, index) => (
                    <div key={index} className="space-y-3 rounded-xl border border-gray-200 p-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Card {index + 1} Label</label>
                        <input
                          type="text"
                          value={(formData.image_titles || [])[index] || ''}
                          onChange={(e) => updateMemoryImageTitle(index, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                          placeholder={`e.g. ${defaultMemoryImageTitles[index]} (optional)`}
                        />
                      </div>
                      <ImageUploadField
                        label={`Card ${index + 1} Image`}
                        value={imageUrl || ''}
                        onChange={(nextImageUrl) => updateMemoryImage(index, nextImageUrl)}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Date</label>
                <input
                  type="date"
                  value={formData.event_date}
                  onChange={(e) => setFormData({...formData, event_date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                  required
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-accent text-white py-2 px-4 rounded-lg hover:bg-accent-dark font-semibold transition-colors disabled:opacity-50"
                >
                  {loading ? 'Saving...' : (editingMemory ? 'Update' : 'Add')} Memory
                </button>
                <button
                  type="button"
                  onClick={requestClose}
                  className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
        </Modal>
      )}

      {dashboardData.clubMemories.length > 0 && <SearchInput value={search} onChange={setSearch} placeholder="Search memories" />}

      {/* Memories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {visibleMemories.map((memory) => (
          <div key={memory.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="relative h-48 bg-gray-200 rounded-t-xl flex items-center justify-center overflow-hidden">
              {memory.image_url ? (
                <img src={memory.image_url} alt={memory.title} className="w-full h-full object-cover" />
              ) : (
                <div className="text-gray-400 text-4xl">📸</div>
              )}
              <span className="absolute right-2 top-2 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white">
                {(memory.image_urls || []).length} {(memory.image_urls || []).length === 1 ? 'photo' : 'photos'}
              </span>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">{memory.title}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-3">{memory.description}</p>
              <p className="text-gray-500 text-xs mb-4">{memory.event_date ? new Date(memory.event_date).toLocaleDateString() : ''}</p>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(memory)}
                  className="flex-1 border border-gray-200 bg-white text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(memory.id)}
                  className="flex-1 border border-red-200 bg-white text-red-600 py-2 px-3 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {dashboardData.clubMemories.length > 0 && visibleMemories.length === 0 && <NoSearchResults query={search} />}
      {dashboardData.clubMemories.length === 0 && loadError && <LoadErrorState what="memories" onRetry={refreshData} />}
      {dashboardData.clubMemories.length === 0 && !loadError && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📸</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No memories yet</h3>
          <p className="text-gray-600 mb-4">Start by adding your first club memory!</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark font-semibold transition-colors"
          >
            Add First Memory
          </button>
        </div>
      )}
      <ToastContainer toasts={toasts} />
    </div>
  );
};

// Event dates are "YYYY-MM-DD" (UTC); format in UTC so the day never shifts by timezone
const formatDay = (date) => (date ? new Date(`${date}T00:00:00Z`).toLocaleDateString('en-US', { day: '2-digit', timeZone: 'UTC' }) : '');
const formatMonth = (date) => (date ? new Date(`${date}T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' }).toUpperCase() : '');

const EVENT_STATUS_STYLES = {
  upcoming: 'bg-green-100 text-green-800',
  completed: 'bg-indigo-100 text-indigo-800',
  cancelled: 'bg-red-100 text-red-800'
};

const SPEAKER_ROLES = ['speaker', 'keynote', 'moderator', 'panelist'];

// Speakers linked to an event. Changes save immediately (separate from the event form's Save).
const EventSpeakersEditor = ({ eventId, speakers }) => {
  const { toast } = useToast();
  const [assigned, setAssigned] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState('');
  const [role, setRole] = useState('speaker');
  const [busy, setBusy] = useState(false);

  const load = () => apiService.getEvent(eventId)
    .then((res) => setAssigned(res.data.speakers || []))
    .catch((error) => toast.error('Could not load event speakers: ' + error.message))
    .finally(() => setLoading(false));

  useEffect(() => {
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  const available = speakers.filter((speaker) => !assigned.some((item) => String(item.id) === String(speaker.id)));

  const handleAdd = async () => {
    if (!selected) return;
    setBusy(true);
    try {
      await apiService.addSpeakerToEvent(eventId, selected, role);
      setSelected('');
      await load();
      toast.success('Speaker added to event');
    } catch (error) {
      toast.error('Could not add speaker: ' + error.message);
    } finally {
      setBusy(false);
    }
  };

  const handleRemove = async (speaker) => {
    setBusy(true);
    try {
      await apiService.removeSpeakerFromEvent(eventId, speaker.id);
      await load();
      toast.success(`${speaker.name} removed from event`);
    } catch (error) {
      toast.error('Could not remove speaker: ' + error.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-6 border-t border-gray-200 pt-5">
      <h4 className="font-semibold text-gray-900">Speakers</h4>
      <p className="mb-3 text-xs text-gray-500">Changes here save immediately.</p>
      {loading ? (
        <p className="text-sm text-gray-500">Loading speakers…</p>
      ) : (
        <div className="mb-3 flex flex-wrap gap-2">
          {assigned.length === 0 && <p className="text-sm text-gray-500">No speakers linked yet.</p>}
          {assigned.map((speaker) => (
            <span key={speaker.id} className="inline-flex items-center gap-1 rounded-full bg-accent-soft py-1 pl-3 pr-1 text-sm text-accent">
              {speaker.name} <span className="text-accent/70">· {speaker.speaker_role}</span>
              <button type="button" onClick={() => handleRemove(speaker)} disabled={busy} className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-white disabled:opacity-50" aria-label={`Remove ${speaker.name}`}>×</button>
            </span>
          ))}
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        <select value={selected} onChange={(e) => setSelected(e.target.value)} className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent" aria-label="Speaker">
          <option value="">Choose a speaker…</option>
          {available.map((speaker) => <option key={speaker.id} value={speaker.id}>{speaker.name} — {speaker.company}</option>)}
        </select>
        <select value={role} onChange={(e) => setRole(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm capitalize focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent" aria-label="Role">
          {SPEAKER_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
        <button type="button" onClick={handleAdd} disabled={!selected || busy} className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-dark disabled:opacity-50">Add</button>
      </div>
    </div>
  );
};

export const EventsTab = ({ dashboardData, setDashboardData, onDataChanged, refreshData, loadError, openNewSignal, initialSearch }) => {
  const { toasts, toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    event_time: '',
    location: '',
    event_type: 'Workshop',
    status: 'upcoming',
    max_participants: '',
    registration_link: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;
      if (editingEvent) {
        response = await apiService.updateEvent(editingEvent.id, formData);
      } else {
        response = await apiService.createEvent(formData);
      }

      if (response.success) {
        const eventsResponse = await apiService.getEvents();
        if (eventsResponse.success) {
          setDashboardData(prev => ({
            ...prev,
            events: eventsResponse.data
          }));
        }
        resetForm();
        onDataChanged && onDataChanged();
        toast.success(editingEvent ? 'Event updated!' : 'Event created!');
      }
    } catch (error) {
      console.error('Error saving event:', error);
      toast.error('Error saving event: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      event_date: event.event_date,
      event_time: event.event_time,
      location: event.location,
      event_type: event.event_type,
      status: event.status,
      max_participants: event.max_participants || '',
      registration_link: event.registration_link || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const response = await apiService.deleteEvent(id);
        if (response.success) {
          const eventsResponse = await apiService.getEvents();
          if (eventsResponse.success) {
            setDashboardData(prev => ({
              ...prev,
              events: eventsResponse.data
            }));
            onDataChanged && onDataChanged();
          }
          toast.success('Event deleted!');
        }
      } catch (error) {
        console.error('Error deleting event:', error);
        toast.error('Error deleting event: ' + error.message);
      }
    }
  };

  const handleReorder = async (id, direction) => {
    if (reordering) return;
    setReordering(true);
    try {
      const response = await apiService.reorderEvent(id, direction);
      if (response.success) {
        const eventsResponse = await apiService.getEvents();
        if (eventsResponse.success) {
          setDashboardData(prev => ({ ...prev, events: eventsResponse.data }));
        }
        toast[response.moved === false ? 'info' : 'success'](response.message);
      }
    } catch (error) {
      console.error('Error reordering event:', error);
      toast.error('Error reordering event: ' + error.message);
    } finally {
      setReordering(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      event_date: '',
      event_time: '',
      location: '',
      event_type: 'Workshop',
      status: 'upcoming',
      max_participants: '',
      registration_link: ''
    });
    setEditingEvent(null);
    setShowForm(false);
  };

  const requestClose = useFormGuard('events', showForm, formData, resetForm);
  const [search, setSearch] = useState(initialSearch || '');
  // "New …" from the top bar / quick actions opens the create form
  useEffect(() => {
    if (openNewSignal) setShowForm(true);
  }, [openNewSignal]);
  const visibleEvents = dashboardData.events.filter((event) => matchesSearch(event, ['title', 'description', 'location', 'event_type', 'status'], search));

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Events Management</h2>
          <p className="text-gray-600">Manage club events and activities</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors shadow-sm font-semibold"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Event
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <Modal onClose={requestClose} label="Edit form">
            <h3 className="text-xl font-bold mb-4">
              {editingEvent ? 'Edit Event' : 'Add New Event'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
                  <select
                    value={formData.event_type}
                    onChange={(e) => setFormData({...formData, event_type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                  >
                    <option value="Workshop">Workshop</option>
                    <option value="Bootcamp">Bootcamp</option>
                    <option value="Seminar">Seminar</option>
                    <option value="Competition">Competition</option>
                    <option value="Hackathon">Hackathon</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                  rows="3"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={formData.event_date}
                    onChange={(e) => setFormData({...formData, event_date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                  {/* Free text: existing events use ranges like "09:00 AM - 04:30 PM" or "Online" */}
                  <input
                    type="text"
                    value={formData.event_time}
                    onChange={(e) => setFormData({...formData, event_time: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                    placeholder="10:00 AM - 12:00 PM"
                    maxLength={100}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Participants</label>
                  <input
                    type="number"
                    value={formData.max_participants}
                    onChange={(e) => setFormData({...formData, max_participants: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Registration Link</label>
                  <input
                    type="url"
                    value={formData.registration_link}
                    onChange={(e) => setFormData({...formData, registration_link: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                    placeholder="https://example.com/register"
                  />
                </div>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-accent text-white py-2 px-4 rounded-lg hover:bg-accent-dark font-semibold transition-colors disabled:opacity-50"
                >
                  {loading ? 'Saving...' : (editingEvent ? 'Update' : 'Add')} Event
                </button>
                <button
                  type="button"
                  onClick={requestClose}
                  className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          {editingEvent && <EventSpeakersEditor eventId={editingEvent.id} speakers={dashboardData.speakers} />}
        </Modal>
      )}

      {dashboardData.events.length > 0 && <SearchInput value={search} onChange={setSearch} placeholder="Search events" />}

      {/* Events table (order = order on the public site) */}
      {visibleEvents.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                <th className="w-20 px-4 py-3">Date</th>
                <th className="px-4 py-3">Event</th>
                <th className="hidden px-4 py-3 md:table-cell">Type</th>
                <th className="px-4 py-3">Status</th>
                <th className="w-44 px-4 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {visibleEvents.map((event) => (
                <tr key={event.id} className="border-b border-gray-100 transition-colors last:border-0 hover:bg-accent-soft/60">
                  <td className="px-4 py-3">
                    <span className="inline-flex w-12 flex-col items-center rounded-lg border border-gray-200 bg-white py-1 leading-tight">
                      <b className="text-base text-gray-900">{formatDay(event.event_date)}</b>
                      <small className="text-[10px] font-bold tracking-wide text-accent">{formatMonth(event.event_date)}</small>
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-gray-900">{event.title}</p>
                    <p className="mt-0.5 line-clamp-1 text-xs text-gray-500">{[event.event_time, event.location].filter(Boolean).join(' · ')}</p>
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">{event.event_type}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${EVENT_STATUS_STYLES[event.status] || 'bg-gray-100 text-gray-600'}`}>{event.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => handleReorder(event.id, 'up')} disabled={reordering || Boolean(search)} title="Move up" aria-label={`Move ${event.title} up`} className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 disabled:opacity-40"><Icon name="up" className="h-4 w-4" strokeWidth={2} /></button>
                      <button onClick={() => handleReorder(event.id, 'down')} disabled={reordering || Boolean(search)} title="Move down" aria-label={`Move ${event.title} down`} className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 disabled:opacity-40"><Icon name="down" className="h-4 w-4" strokeWidth={2} /></button>
                      <button onClick={() => handleEdit(event)} title="Edit" aria-label={`Edit ${event.title}`} className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"><Icon name="pencil" className="h-4 w-4" /></button>
                      <button onClick={() => handleDelete(event.id)} title="Delete" aria-label={`Delete ${event.title}`} className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"><Icon name="trash" className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {dashboardData.events.length > 0 && visibleEvents.length === 0 && <NoSearchResults query={search} />}
      {dashboardData.events.length === 0 && loadError && <LoadErrorState what="events" onRetry={refreshData} />}
      {dashboardData.events.length === 0 && !loadError && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📅</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No events yet</h3>
          <p className="text-gray-600 mb-4">Start by creating your first event!</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark font-semibold transition-colors"
          >
            Add First Event
          </button>
        </div>
      )}
      <ToastContainer toasts={toasts} />
    </div>
  );
};

export const TeamTab = ({ dashboardData, setDashboardData, onDataChanged, refreshData, loadError, openNewSignal, initialSearch }) => {
  const { toasts, toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    image_url: '',
    team_type: 'core',
    email: '',
    phone: '',
    github_url: '',
    linkedin_url: '',
    twitter_url: '',
    join_date: '',
    is_active: true,
    skills: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Skills are typed as "React, Python, ..." in the form
      const payload = { ...formData, skills: formData.skills.split(',').map((skill) => skill.trim()).filter(Boolean) };
      let response;
      if (editingMember) {
        response = await apiService.updateTeamMember(editingMember.id, payload);
      } else {
        response = await apiService.createTeamMember(payload);
      }

      if (response.success) {
        const teamResponse = await apiService.getTeamMembers({ is_active: 'all' });
        if (teamResponse.success) {
          setDashboardData(prev => ({
            ...prev,
            teamMembers: teamResponse.data
          }));
        }
        resetForm();
        onDataChanged && onDataChanged();
        toast.success(editingMember ? 'Team member updated!' : 'Team member added!');
      }
    } catch (error) {
      console.error('Error saving team member:', error);
      toast.error('Error saving team member: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      role: member.role,
      bio: member.bio || '',
      image_url: member.image_url || '',
      team_type: member.team_type,
      email: member.email || '',
      phone: member.phone || '',
      github_url: cleanUrl(member.github_url),
      linkedin_url: cleanUrl(member.linkedin_url),
      twitter_url: cleanUrl(member.twitter_url),
      join_date: member.join_date || '',
      is_active: member.is_active,
      skills: (member.skills || []).map((skill) => skill.skill_name).join(', ')
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this team member?')) {
      try {
        const response = await apiService.deleteTeamMember(id);
        if (response.success) {
          const teamResponse = await apiService.getTeamMembers({ is_active: 'all' });
          if (teamResponse.success) {
            setDashboardData(prev => ({
              ...prev,
              teamMembers: teamResponse.data
            }));
            onDataChanged && onDataChanged();
          }
          toast.success('Team member deleted!');
        }
      } catch (error) {
        console.error('Error deleting team member:', error);
        toast.error('Error deleting team member: ' + error.message);
      }
    }
  };

  const handleReorder = async (id, direction) => {
    if (reordering) return;
    setReordering(true);
    try {
      const response = await apiService.reorderTeamMember(id, direction);
      if (response.success) {
        if (response.moved !== false) {
          const teamResponse = await apiService.getTeamMembers({ is_active: 'all' });
          if (teamResponse.success) {
            setDashboardData(prev => ({
              ...prev,
              teamMembers: teamResponse.data
            }));
            onDataChanged && onDataChanged();
          }
        }
        toast[response.moved === false ? 'info' : 'success'](response.message);
      }
    } catch (error) {
      console.error('Error reordering team member:', error);
      toast.error('Error changing position: ' + error.message);
    } finally {
      setReordering(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      bio: '',
      image_url: '',
      team_type: 'core',
      email: '',
      phone: '',
      github_url: '',
      linkedin_url: '',
      twitter_url: '',
      join_date: '',
      is_active: true,
      skills: ''
    });
    setEditingMember(null);
    setShowForm(false);
  };

  const requestClose = useFormGuard('team', showForm, formData, resetForm);
  const [search, setSearch] = useState(initialSearch || '');
  // "New …" from the top bar / quick actions opens the create form
  useEffect(() => {
    if (openNewSignal) setShowForm(true);
  }, [openNewSignal]);
  const visibleMembers = dashboardData.teamMembers.filter((member) => matchesSearch(member, ['name', 'role', 'bio'], search));

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Team Management</h2>
          <p className="text-gray-600">Manage team members and their profiles</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors shadow-sm font-semibold"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Member
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <Modal onClose={requestClose} label="Edit form">
            <h3 className="text-xl font-bold mb-4">
              {editingMember ? 'Edit Team Member' : 'Add New Team Member'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData({...formData, skills: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                  placeholder="React, Python, Cloud — separated by commas"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Team Type</label>
                  <select
                    value={formData.team_type}
                    onChange={(e) => setFormData({...formData, team_type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                  >
                    <option value="leadership">Leadership</option>
                    <option value="core">Core Team</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Join Date</label>
                  <input
                    type="date"
                    value={formData.join_date}
                    onChange={(e) => setFormData({...formData, join_date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                  />
                </div>
              </div>
              <ImageUploadField
                label="Profile Image"
                value={formData.image_url}
                onChange={(imageUrl) => setFormData({...formData, image_url: imageUrl})}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">GitHub URL</label>
                  <input
                    type="url"
                    value={formData.github_url}
                    onChange={(e) => setFormData({...formData, github_url: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                    placeholder="https://github.com/username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
                  <input
                    type="url"
                    value={formData.linkedin_url}
                    onChange={(e) => setFormData({...formData, linkedin_url: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Twitter URL</label>
                  <input
                    type="url"
                    value={formData.twitter_url}
                    onChange={(e) => setFormData({...formData, twitter_url: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                    placeholder="https://twitter.com/username"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                  className="mr-2"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Active Member</label>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-accent text-white py-2 px-4 rounded-lg hover:bg-accent-dark font-semibold transition-colors disabled:opacity-50"
                >
                  {loading ? 'Saving...' : (editingMember ? 'Update' : 'Add')} Member
                </button>
                <button
                  type="button"
                  onClick={requestClose}
                  className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
        </Modal>
      )}

      {dashboardData.teamMembers.length > 0 && <SearchInput value={search} onChange={setSearch} placeholder="Search team members" />}

      {/* Team Members Grid — split by section, matching the public site and how reordering works */}
      {[
        { type: 'leadership', title: 'Leadership' },
        { type: 'core', title: 'Core Team' }
      ].map((section) => {
        const sectionMembers = visibleMembers.filter((member) =>
          section.type === 'leadership' ? member.team_type === 'leadership' : member.team_type !== 'leadership'
        );
        if (sectionMembers.length === 0) return null;

        return (
          <div key={section.type} className="mb-10">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {section.title} <span className="text-sm font-normal text-gray-500">({sectionMembers.length})</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {sectionMembers.map((member) => (
                <div key={member.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-16 h-16 flex-shrink-0 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                        {member.image_url ? (
                          <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-gray-400 text-2xl">👤</div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{member.name}</h3>
                        <p className="text-sm text-gray-600">{member.role}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            member.team_type === 'leadership' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {member.team_type}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            member.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {member.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                    {member.bio && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{member.bio}</p>
                    )}
                    <div className="mb-3 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleReorder(member.id, 'up')}
                        disabled={reordering}
                        className="border border-gray-200 bg-gray-50 text-gray-600 py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Move Up
                      </button>
                      <button
                        onClick={() => handleReorder(member.id, 'down')}
                        disabled={reordering}
                        className="border border-gray-200 bg-gray-50 text-gray-600 py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Move Down
                      </button>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(member)}
                        className="flex-1 border border-gray-200 bg-white text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="flex-1 border border-red-200 bg-white text-red-600 py-2 px-3 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {dashboardData.teamMembers.length > 0 && visibleMembers.length === 0 && <NoSearchResults query={search} />}
      {dashboardData.teamMembers.length === 0 && loadError && <LoadErrorState what="team members" onRetry={refreshData} />}
      {dashboardData.teamMembers.length === 0 && !loadError && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">👥</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No team members yet</h3>
          <p className="text-gray-600 mb-4">Start by adding your first team member!</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark font-semibold transition-colors"
          >
            Add First Member
          </button>
        </div>
      )}
      <ToastContainer toasts={toasts} />
    </div>
  );
};

export const SpeakersTab = ({ dashboardData, setDashboardData, onDataChanged, refreshData, loadError, openNewSignal, initialSearch }) => {
  const { toasts, toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingSpeaker, setEditingSpeaker] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    company: '',
    bio: '',
    image_url: '',
    email: '',
    phone: '',
    linkedin_url: '',
    twitter_url: '',
    website_url: '',
    is_available: true,
    expertise: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Expertise is typed as "Cloud, DevOps, ..."; keep any stored years of experience per area
      const years = Object.fromEntries((editingSpeaker?.expertise || []).map((item) => [item.area, item.years_experience || 0]));
      const speakerData = {
        ...formData,
        expertise: formData.expertise.split(',').map((area) => area.trim()).filter(Boolean)
          .map((area) => ({ area: area.slice(0, 100), years_experience: years[area] || 0 }))
      };

      let response;
      if (editingSpeaker) {
        response = await apiService.updateSpeaker(editingSpeaker.id, speakerData);
      } else {
        response = await apiService.createSpeaker(speakerData);
      }

      if (response.success) {
        const speakersResponse = await apiService.getSpeakers({ is_available: 'all' });
        if (speakersResponse.success) {
          setDashboardData(prev => ({
            ...prev,
            speakers: speakersResponse.data
          }));
        }
        resetForm();
        onDataChanged && onDataChanged();
        toast.success(editingSpeaker ? 'Speaker updated!' : 'Speaker added!');
      }
    } catch (error) {
      console.error('Error saving speaker:', error);
      toast.error('Error saving speaker: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (speaker) => {
    setEditingSpeaker(speaker);
    setFormData({
      name: speaker.name,
      title: speaker.title,
      company: speaker.company,
      bio: speaker.bio || '',
      image_url: speaker.image_url || '',
      email: speaker.email || '',
      phone: speaker.phone || '',
      linkedin_url: cleanUrl(speaker.linkedin_url),
      twitter_url: cleanUrl(speaker.twitter_url),
      website_url: cleanUrl(speaker.website_url),
      is_available: speaker.is_available,
      expertise: (speaker.expertise_areas || []).join(', ')
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this speaker?')) {
      try {
        const response = await apiService.deleteSpeaker(id);
        if (response.success) {
          const speakersResponse = await apiService.getSpeakers({ is_available: 'all' });
          if (speakersResponse.success) {
            setDashboardData(prev => ({
              ...prev,
              speakers: speakersResponse.data
            }));
            onDataChanged && onDataChanged();
          }
          toast.success('Speaker deleted!');
        }
      } catch (error) {
        console.error('Error deleting speaker:', error);
        toast.error('Error deleting speaker: ' + error.message);
      }
    }
  };

  const handleReorder = async (id, direction) => {
    if (reordering) return;
    setReordering(true);
    try {
      const response = await apiService.reorderSpeaker(id, direction);
      if (response.success) {
        const speakersResponse = await apiService.getSpeakers({ is_available: 'all' });
        if (speakersResponse.success) {
          setDashboardData(prev => ({ ...prev, speakers: speakersResponse.data }));
        }
        toast[response.moved === false ? 'info' : 'success'](response.message);
      }
    } catch (error) {
      console.error('Error reordering speaker:', error);
      toast.error('Error reordering speaker: ' + error.message);
    } finally {
      setReordering(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      title: '',
      company: '',
      bio: '',
      image_url: '',
      email: '',
      phone: '',
      linkedin_url: '',
      twitter_url: '',
      website_url: '',
      is_available: true,
      expertise: ''
    });
    setEditingSpeaker(null);
    setShowForm(false);
  };

  const requestClose = useFormGuard('speakers', showForm, formData, resetForm);
  const [search, setSearch] = useState(initialSearch || '');
  // "New …" from the top bar / quick actions opens the create form
  useEffect(() => {
    if (openNewSignal) setShowForm(true);
  }, [openNewSignal]);
  const visibleSpeakers = dashboardData.speakers.filter((speaker) => matchesSearch(speaker, ['name', 'title', 'company', 'bio'], search));

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Guest Speakers Management</h2>
          <p className="text-gray-600">Manage guest speakers and their profiles</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors shadow-sm font-semibold"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Speaker
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <Modal onClose={requestClose} label="Edit form">
            <h3 className="text-xl font-bold mb-4">
              {editingSpeaker ? 'Edit Speaker' : 'Add New Speaker'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expertise</label>
                <input
                  type="text"
                  value={formData.expertise}
                  onChange={(e) => setFormData({...formData, expertise: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                  placeholder="Cloud Architecture, DevOps — separated by commas"
                />
              </div>
              <ImageUploadField
                label="Profile Image"
                value={formData.image_url}
                onChange={(imageUrl) => setFormData({...formData, image_url: imageUrl})}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
                  <input
                    type="url"
                    value={formData.linkedin_url}
                    onChange={(e) => setFormData({...formData, linkedin_url: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Twitter URL</label>
                  <input
                    type="url"
                    value={formData.twitter_url}
                    onChange={(e) => setFormData({...formData, twitter_url: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                    placeholder="https://twitter.com/username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
                  <input
                    type="url"
                    value={formData.website_url}
                    onChange={(e) => setFormData({...formData, website_url: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_available"
                  checked={formData.is_available}
                  onChange={(e) => setFormData({...formData, is_available: e.target.checked})}
                  className="mr-2"
                />
                <label htmlFor="is_available" className="text-sm font-medium text-gray-700">Show on website <span className="font-normal text-gray-500">(untick to hide this speaker from the public site)</span></label>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-accent text-white py-2 px-4 rounded-lg hover:bg-accent-dark font-semibold transition-colors disabled:opacity-50"
                >
                  {loading ? 'Saving...' : (editingSpeaker ? 'Update' : 'Add')} Speaker
                </button>
                <button
                  type="button"
                  onClick={requestClose}
                  className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
        </Modal>
      )}

      {dashboardData.speakers.length > 0 && <SearchInput value={search} onChange={setSearch} placeholder="Search speakers" />}

      {/* Speakers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {visibleSpeakers.map((speaker) => (
          <div key={speaker.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 flex-shrink-0 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  {speaker.image_url ? (
                    <img src={speaker.image_url} alt={speaker.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-gray-400 text-2xl">🎤</div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{speaker.name}</h3>
                  <p className="text-sm text-gray-600">{speaker.title}</p>
                  <p className="text-sm text-gray-500">{speaker.company}</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                    speaker.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {speaker.is_available ? 'Visible' : 'Hidden'}
                  </span>
                </div>
              </div>
              {speaker.bio && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{speaker.bio}</p>
              )}
              <div className="grid grid-cols-2 gap-2 mb-2">
                <button
                  onClick={() => handleReorder(speaker.id, 'up')}
                  disabled={reordering}
                  className="border border-gray-200 bg-gray-50 text-gray-600 py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
                >
                  ▲ Up
                </button>
                <button
                  onClick={() => handleReorder(speaker.id, 'down')}
                  disabled={reordering}
                  className="border border-gray-200 bg-gray-50 text-gray-600 py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
                >
                  ▼ Down
                </button>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(speaker)}
                  className="flex-1 border border-gray-200 bg-white text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(speaker.id)}
                  className="flex-1 border border-red-200 bg-white text-red-600 py-2 px-3 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {dashboardData.speakers.length > 0 && visibleSpeakers.length === 0 && <NoSearchResults query={search} />}
      {dashboardData.speakers.length === 0 && loadError && <LoadErrorState what="speakers" onRetry={refreshData} />}
      {dashboardData.speakers.length === 0 && !loadError && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🎤</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No speakers yet</h3>
          <p className="text-gray-600 mb-4">Start by adding your first guest speaker!</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark font-semibold transition-colors"
          >
            Add First Speaker
          </button>
        </div>
      )}
      <ToastContainer toasts={toasts} />
    </div>
  );
};

// ─── Speaker Reviews Tab ───────────────────────────────────────────────────────
export const ReviewsTab = ({ openNewSignal, initialSearch }) => {
  const { toasts, toast } = useToast();
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    review: '',
    highlight: '',
    image_url: '',
    is_active: true
  });

  const loadReviews = async () => {
    try {
      setFetching(true);
      const res = await apiService.getReviews({ is_active: 'all' });
      if (res.success) setReviews(res.data);
    } catch (err) {
      toast.error('Failed to load reviews: ' + err.message);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    loadReviews();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        highlight: formData.highlight || null,
        image_url: formData.image_url || null
      };
      let res;
      if (editingReview) {
        res = await apiService.updateReview(editingReview.id, payload);
      } else {
        res = await apiService.createReview(payload);
      }
      if (res.success) {
        await loadReviews();
        resetForm();
        toast.success(editingReview ? 'Review updated!' : 'Review created!');
      }
    } catch (err) {
      toast.error('Error saving review: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setFormData({
      name: review.name,
      role: review.role,
      review: review.review,
      highlight: review.highlight || '',
      image_url: review.image_url || '',
      is_active: review.is_active
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      const res = await apiService.deleteReview(id);
      if (res.success) {
        await loadReviews();
        toast.success('Review deleted!');
      }
    } catch (err) {
      toast.error('Error deleting review: ' + err.message);
    }
  };

  // Order here = order of the carousel on the public site
  const [reordering, setReordering] = useState(false);
  const handleReorder = async (id, direction) => {
    if (reordering) return;
    setReordering(true);
    try {
      const res = await apiService.reorderReview(id, direction);
      if (res.moved !== false) await loadReviews();
      toast[res.moved === false ? 'info' : 'success'](res.message);
    } catch (err) {
      toast.error('Error moving review: ' + err.message);
    } finally {
      setReordering(false);
    }
  };

  const handleToggleStatus = async (review) => {
    try {
      await apiService.toggleReviewStatus(review.id);
      await loadReviews();
      toast.success(`Review ${review.is_active ? 'deactivated' : 'activated'}!`);
    } catch (err) {
      toast.error('Error toggling status: ' + err.message);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', role: '', review: '', highlight: '', image_url: '', is_active: true });
    setEditingReview(null);
    setShowForm(false);
  };

  const requestClose = useFormGuard('reviews', showForm, formData, resetForm);
  const [search, setSearch] = useState(initialSearch || '');
  // "New …" from the top bar / quick actions opens the create form
  useEffect(() => {
    if (openNewSignal) setShowForm(true);
  }, [openNewSignal]);
  const visibleReviews = reviews.filter((review) => matchesSearch(review, ['name', 'role', 'review', 'highlight'], search));

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Speaker Reviews</h2>
          <p className="text-gray-600">Manage testimonials shown in the public carousel</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors shadow-sm font-semibold"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Review
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <Modal onClose={requestClose} maxWidth="max-w-lg" label="Edit review">
            <h3 className="text-xl font-bold mb-4">{editingReview ? 'Edit Review' : 'Add Review'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Speaker Name</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role / Title</label>
                  <input type="text" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Review Text</label>
                <textarea value={formData.review} onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent" rows="4" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Highlight Label <span className="text-gray-400">(optional — shown as badge)</span></label>
                <input type="text" value={formData.highlight} onChange={(e) => setFormData({ ...formData, highlight: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                  placeholder="e.g. Keynote Speaker" />
              </div>
              <ImageUploadField
                label="Profile Photo (optional)"
                value={formData.image_url}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
                onError={(msg) => toast.error(msg)}
              />
              <div className="flex items-center gap-2">
                <input type="checkbox" id="review_active" checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} />
                <label htmlFor="review_active" className="text-sm font-medium text-gray-700">Show on public site</label>
              </div>
              <div className="flex space-x-3 pt-2">
                <button type="submit" disabled={loading}
                  className="flex-1 bg-accent text-white py-2 px-4 rounded-lg hover:bg-accent-dark font-semibold transition-colors disabled:opacity-50">
                  {loading ? 'Saving...' : editingReview ? 'Update' : 'Add'} Review
                </button>
                <button type="button" onClick={requestClose}
                  className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
        </Modal>
      )}

      {reviews.length > 0 && <SearchInput value={search} onChange={setSearch} placeholder="Search reviews" />}

      {/* Reviews list (same order as the public carousel) */}
      {fetching ? (
        <p className="text-gray-500 text-center py-8">Loading reviews…</p>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">💬</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
          <p className="text-gray-600 mb-4">Add the first speaker testimonial!</p>
          <button onClick={() => setShowForm(true)}
            className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark font-semibold transition-colors">
            Add First Review
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {visibleReviews.length === 0 && <NoSearchResults query={search} />}
          {visibleReviews.map((review) => (
            <div key={review.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold flex-shrink-0 overflow-hidden">
                  {review.image_url
                    ? <img src={review.image_url} alt={review.name} className="w-full h-full object-cover" />
                    : (review.name || '?').charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-semibold text-gray-900">{review.name}</span>
                    <span className="text-sm text-gray-500">{review.role}</span>
                    {review.highlight && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">{review.highlight}</span>
                    )}
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${review.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {review.is_active ? 'Active' : 'Hidden'}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-3">"{review.review}"</p>
                </div>
                {/* Actions */}
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <div className="flex gap-1">
                    <button onClick={() => handleReorder(review.id, 'up')} disabled={reordering || Boolean(search)} title="Move up"
                      className="flex-1 px-2 py-1 border border-gray-200 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 text-xs font-medium disabled:opacity-40">▲</button>
                    <button onClick={() => handleReorder(review.id, 'down')} disabled={reordering || Boolean(search)} title="Move down"
                      className="flex-1 px-2 py-1 border border-gray-200 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 text-xs font-medium disabled:opacity-40">▼</button>
                  </div>
                  <button onClick={() => handleEdit(review)}
                    className="px-3 py-1.5 border border-gray-200 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                    Edit
                  </button>
                  <button onClick={() => handleToggleStatus(review)}
                    className={`px-3 py-1.5 rounded-lg transition-colors text-sm font-medium ${review.is_active ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
                    {review.is_active ? 'Hide' : 'Show'}
                  </button>
                  <button onClick={() => handleDelete(review.id)}
                    className="px-3 py-1.5 border border-red-200 bg-white text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <ToastContainer toasts={toasts} />
    </div>
  );
};
