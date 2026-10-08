import { useState, useEffect, useCallback, useRef } from 'react';
import {
  MemoriesTab, EventsTab, TeamTab, SpeakersTab, ReviewsTab, ActivityLogModal,
  useToast, ToastContainer, ToastContext, UnsavedChangesContext, Modal
} from './AdminDashboardTabs';
import HomeTab from './admin/HomeTab';
import OverviewTab from './admin/OverviewTab';
import Icon from './admin/icons';
import apiService from '../services/apiService';

const UNSAVED_PROMPT = 'You have unsaved changes. Leave without saving?';

const NAV_GROUPS = [
  { items: [{ id: 'overview', name: 'Overview', icon: 'overview' }] },
  {
    title: 'Website',
    items: [
      { id: 'home', name: 'Home page', icon: 'home' },
      { id: 'memories', name: 'Club memories', icon: 'photo', count: 'clubMemories' },
      { id: 'events', name: 'Events', icon: 'calendar', count: 'events' },
      { id: 'team', name: 'Team', icon: 'users', count: 'teamMembers' },
      { id: 'speakers', name: 'Speakers', icon: 'microphone', count: 'speakers' },
      { id: 'reviews', name: 'Speaker reviews', icon: 'chat', count: 'reviews' }
    ]
  }
];

const NEW_ITEMS = [
  { tab: 'events', label: 'Event', icon: 'calendar' },
  { tab: 'memories', label: 'Memory', icon: 'photo' },
  { tab: 'team', label: 'Team member', icon: 'userPlus' },
  { tab: 'speakers', label: 'Speaker', icon: 'microphone' },
  { tab: 'reviews', label: 'Speaker review', icon: 'chat' }
];

const lastLoginLabel = (iso) => {
  if (!iso) return 'Welcome back';
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days <= 0) return 'Last login · today';
  if (days === 1) return 'Last login · yesterday';
  return `Last login · ${days} days ago`;
};

// Top-bar search across loaded content; picking a result opens that section filtered to it
const GlobalSearch = ({ dashboardData, onPick }) => {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  const q = query.trim().toLowerCase();
  const has = (...values) => values.some((value) => String(value || '').toLowerCase().includes(q));
  const results = q.length < 2 ? [] : [
    ...dashboardData.events.filter((e) => has(e.title, e.location)).map((e) => ({ tab: 'events', label: e.title, kind: 'Event', query: e.title })),
    ...dashboardData.clubMemories.filter((m) => has(m.title)).map((m) => ({ tab: 'memories', label: m.title, kind: 'Memory', query: m.title })),
    ...dashboardData.teamMembers.filter((m) => has(m.name, m.role)).map((m) => ({ tab: 'team', label: m.name, kind: `Team · ${m.role}`, query: m.name })),
    ...dashboardData.speakers.filter((s) => has(s.name, s.company)).map((s) => ({ tab: 'speakers', label: s.name, kind: `Speaker · ${s.company}`, query: s.name }))
  ].slice(0, 8);

  const pick = (result) => {
    onPick(result.tab, result.query);
    setQuery('');
    setOpen(false);
    inputRef.current?.blur();
  };

  return (
    <div className="relative min-w-0 flex-1 sm:max-w-md">
      <label className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-500 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20">
        <Icon name="search" className="h-4 w-4 flex-shrink-0" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && results[0]) pick(results[0]);
            if (e.key === 'Escape') { setQuery(''); inputRef.current?.blur(); }
          }}
          placeholder="Search events, members, speakers…"
          aria-label="Search all content"
          className="min-w-0 flex-1 bg-transparent text-gray-900 outline-none placeholder:text-gray-400"
        />
        <kbd className="hidden rounded border border-gray-200 px-1.5 text-[11px] text-gray-400 sm:inline">⌘K</kbd>
      </label>
      {open && q.length >= 2 && (
        <div className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
          {results.length === 0 && <p className="px-4 py-3 text-sm text-gray-500">No matches for “{query}”.</p>}
          {results.map((result, index) => (
            <button
              key={`${result.tab}-${result.label}-${index}`}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => pick(result)}
              className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm hover:bg-accent-soft"
            >
              <span className="truncate font-medium text-gray-900">{result.label}</span>
              <span className="flex-shrink-0 text-xs text-gray-500">{result.kind}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ChangePasswordModal = ({ onClose, toast }) => {
  const [form, setForm] = useState({ current: '', next: '', confirm: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.next.length < 6) return setError('The new password must be at least 6 characters.');
    if (form.next !== form.confirm) return setError("The new passwords don't match.");
    setSaving(true);
    try {
      await apiService.changePassword(form.current, form.next);
      toast.success('Password changed');
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent';
  return (
    <Modal onClose={onClose} maxWidth="max-w-md" label="Change password">
      <h3 className="text-xl font-bold mb-4">Change password</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="pw-current">Current password</label>
          <input id="pw-current" type="password" autoComplete="current-password" value={form.current} onChange={set('current')} className={inputClass} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="pw-new">New password</label>
          <input id="pw-new" type="password" autoComplete="new-password" value={form.next} onChange={set('next')} className={inputClass} minLength={6} maxLength={72} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="pw-confirm">Confirm new password</label>
          <input id="pw-confirm" type="password" autoComplete="new-password" value={form.confirm} onChange={set('confirm')} className={inputClass} required />
        </div>
        {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
        <div className="flex space-x-3 pt-2">
          <button type="submit" disabled={saving} className="flex-1 bg-accent text-white py-2 px-4 rounded-lg hover:bg-accent-dark font-semibold transition-colors disabled:opacity-50">
            {saving ? 'Saving…' : 'Change password'}
          </button>
          <button type="button" onClick={onClose} className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  // Per-navigation options for the opened tab: open its "New" form and/or start with a search
  const [tabSignal, setTabSignal] = useState({ key: 0, openNew: null, search: '' });
  const [refreshVersion, setRefreshVersion] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newMenuOpen, setNewMenuOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showActivityLog, setShowActivityLog] = useState(false);
  const [reviewCount, setReviewCount] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    clubMemories: [],
    events: [],
    teamMembers: [],
    speakers: []
  });

  // One toast list for the whole dashboard, so messages survive switching tabs
  const { toasts, toast } = useToast();

  // Forms report unsaved edits here (see useReportUnsaved); we ask before discarding them
  const unsavedSources = useRef(new Set());
  const setDirty = useCallback((source, isDirty) => {
    if (isDirty) unsavedSources.current.add(source);
    else unsavedSources.current.delete(source);
  }, []);
  const confirmLeave = () => unsavedSources.current.size === 0 || window.confirm(UNSAVED_PROMPT);

  useEffect(() => {
    const warnOnUnload = (e) => {
      if (unsavedSources.current.size === 0) return;
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', warnOnUnload);
    return () => window.removeEventListener('beforeunload', warnOnUnload);
  }, []);

  // Read stored admin user once on mount — avoids re-parsing localStorage on every render
  const [storedUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('adminUser') || '{}'); } catch (_) { return {}; }
  });

  const [loadError, setLoadError] = useState('');

  const loadDashboardData = useCallback(async () => {
    try {
      const [memoriesRes, eventsRes, teamRes, speakersRes] = await Promise.all([
        apiService.getMemories(),
        apiService.getEvents(),
        apiService.getTeamMembers({ is_active: 'all' }),
        apiService.getSpeakers({ is_available: 'all' })
      ]);

      setDashboardData({
        clubMemories: memoriesRes.success ? memoriesRes.data : [],
        events: eventsRes.success ? eventsRes.data : [],
        teamMembers: teamRes.success ? teamRes.data : [],
        speakers: speakersRes.success ? speakersRes.data : []
      });
      setLoadError('');
      setLoaded(true);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setLoadError(error.message);
      // Re-throw so callers (Refresh / Try again) can report it
      throw error;
    }
  }, []);

  // Load data on component mount
  useEffect(() => {
    loadDashboardData().catch(() => {}); // error is shown via loadError
  }, [loadDashboardData]);

  // Review count for the sidebar (reviews aren't part of dashboardData)
  useEffect(() => {
    apiService.getReviews({ is_active: 'all', limit: 1 })
      .then((res) => setReviewCount(res.pagination?.total ?? null))
      .catch(() => setReviewCount(null));
  }, [refreshVersion]);

  // Switch section; `options.openNew` opens its create form, `options.search` pre-fills its search
  const navigate = (tabId, options = {}) => {
    const hasOptions = Boolean(options.openNew || options.search);
    if (tabId === activeTab && !hasOptions) return;
    if (!confirmLeave()) return;
    setActiveTab(tabId);
    setTabSignal({ key: Date.now(), openNew: options.openNew ? Date.now() : null, search: options.search || '' });
    setSidebarOpen(false);
    setNewMenuOpen(false);
    window.scrollTo({ top: 0 });
  };

  const handleLogout = async () => {
    if (!confirmLeave()) return;
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    // Clear any auth tokens/session data
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = '/';
  };

  const handleDataRefresh = async () => {
    setRefreshing(true);
    try {
      await loadDashboardData();
      setRefreshVersion((prev) => prev + 1); // also reloads the Overview activity and review count
      toast.success('Data refreshed');
    } catch (error) {
      toast.error('Refresh failed: ' + error.message);
    } finally {
      setRefreshing(false);
    }
  };

  const handleDataExport = async () => {
    try {
      const response = await apiService.exportData();
      if (response.success) {
        const dataStr = JSON.stringify(response.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `devityclub_data_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success('Export downloaded');
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Export failed: ' + error.message);
    }
  };

  const handleDataChanged = () => {
    setRefreshVersion(prev => prev + 1);
  };

  const counts = {
    clubMemories: dashboardData.clubMemories.length,
    events: dashboardData.events.length,
    teamMembers: dashboardData.teamMembers.length,
    speakers: dashboardData.speakers.length,
    reviews: reviewCount
  };

  const tabProps = {
    dashboardData, setDashboardData, onDataChanged: handleDataChanged, refreshData: loadDashboardData, loadError,
    openNewSignal: tabSignal.openNew, initialSearch: tabSignal.search
  };
  const tabKey = `${activeTab}-${tabSignal.key}`; // remount so a new search/"New" action applies cleanly

  const navButton = (item) => (
    <button
      key={item.id}
      type="button"
      onClick={() => navigate(item.id)}
      aria-current={activeTab === item.id ? 'page' : undefined}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${activeTab === item.id
        ? 'bg-accent-soft font-semibold text-accent'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
    >
      <Icon name={item.icon} className="h-5 w-5" />
      <span className="flex-1 text-left">{item.name}</span>
      {item.count && loaded && counts[item.count] !== null && (
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-500">{counts[item.count]}</span>
      )}
    </button>
  );

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 px-2 pb-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-xs font-extrabold text-white">DC</div>
        <div className="leading-tight">
          <p className="font-bold text-gray-900">Devity Admin</p>
          <p className="text-xs text-gray-500">Content dashboard</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto" aria-label="Admin sections">
        {NAV_GROUPS.map((group, index) => (
          <div key={group.title || index} className="space-y-1">
            {group.title && <p className="px-3 pb-1 pt-4 text-[11px] font-semibold uppercase tracking-wider text-gray-400">{group.title}</p>}
            {group.items.map(navButton)}
          </div>
        ))}
        <p className="px-3 pb-1 pt-4 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Account</p>
        <button type="button" onClick={() => { setShowActivityLog(true); setSidebarOpen(false); }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900">
          <Icon name="clock" className="h-5 w-5" /> Activity log
        </button>
        <button type="button" onClick={() => { setShowPasswordModal(true); setSidebarOpen(false); }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900">
          <Icon name="key" className="h-5 w-5" /> Change password
        </button>
      </nav>
      <div className="mt-4 flex items-center gap-2.5 border-t border-gray-200 px-2 pt-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-soft text-sm font-bold text-accent">
          {(storedUser.username || 'A').charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-sm font-semibold text-gray-900">{storedUser.username || 'Admin'}</p>
          <p className="text-xs text-gray-500">{lastLoginLabel(storedUser.last_login)}</p>
        </div>
        <button type="button" onClick={handleLogout} title="Log out" aria-label="Log out" className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600">
          <Icon name="logout" className="h-5 w-5" />
        </button>
      </div>
    </div>
  );

  return (
    <ToastContext.Provider value={toast}>
    <UnsavedChangesContext.Provider value={setDirty}>
    <div className="min-h-screen bg-[#f6f7f9] lg:grid lg:grid-cols-[248px_1fr]">
      {/* Sidebar: fixed column on desktop, slide-in panel on small screens */}
      <aside className="sticky top-0 hidden h-screen border-r border-gray-200 bg-white px-3.5 py-5 lg:block">{sidebar}</aside>
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 animate-fade-in bg-slate-950/40" onClick={() => setSidebarOpen(false)} aria-hidden="true" />
          <aside className="relative h-full w-[268px] animate-fade-in bg-white px-3.5 py-5 shadow-xl">{sidebar}</aside>
        </div>
      )}

      <div className="min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex flex-wrap items-center gap-2 border-b border-gray-200 bg-[#f6f7f9]/85 px-4 py-3 backdrop-blur sm:gap-3 sm:px-8 sm:py-4">
          <button type="button" onClick={() => setSidebarOpen(true)} className="rounded-lg p-2 text-gray-600 hover:bg-gray-200 lg:hidden" aria-label="Open menu">
            <Icon name="menu" className="h-5 w-5" />
          </button>
          <GlobalSearch dashboardData={dashboardData} onPick={(tab, query) => navigate(tab, { search: query })} />
          <div className="ml-auto flex items-center gap-2">
            <a href="/" target="_blank" rel="noopener noreferrer" title="View site" className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200">
              <Icon name="external" className="h-4 w-4" /><span className="hidden md:inline">View site</span>
            </a>
            <button type="button" onClick={handleDataRefresh} disabled={refreshing} title="Reload all content" aria-label="Refresh" className="rounded-lg border border-gray-200 bg-white p-2 text-gray-700 hover:bg-gray-50 disabled:opacity-60">
              <Icon name="refresh" className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <button type="button" onClick={handleDataExport} title="Export all content" className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
              <Icon name="download" className="h-4 w-4" /><span className="hidden md:inline">Export</span>
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={() => setNewMenuOpen((value) => !value)}
                onBlur={() => setTimeout(() => setNewMenuOpen(false), 150)}
                aria-expanded={newMenuOpen}
                className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-accent-dark sm:px-4"
              >
                <Icon name="plus" className="h-4 w-4" strokeWidth={2} /> New
              </button>
              {newMenuOpen && (
                <div className="absolute right-0 top-full z-40 mt-2 w-52 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
                  {NEW_ITEMS.map((item) => (
                    <button
                      key={item.tab}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => navigate(item.tab, { openNew: true })}
                      className="flex w-full items-center gap-2.5 px-4 py-2 text-left text-sm text-gray-700 hover:bg-accent-soft hover:text-accent"
                    >
                      <Icon name={item.icon} className="h-4 w-4" /> {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-8 sm:py-7">
          {loadError && (
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
              <span>Unable to load dashboard data: {loadError}</span>
              <button onClick={handleDataRefresh} className="font-semibold underline">Try again</button>
            </div>
          )}

          <div key={tabKey}>
            {activeTab === 'overview' && (
              <OverviewTab dashboardData={dashboardData} loaded={loaded} refreshKey={refreshVersion} username={storedUser.username} onNavigate={navigate} />
            )}
            {activeTab === 'home'     && <HomeTab />}
            {activeTab === 'memories' && <MemoriesTab {...tabProps} />}
            {activeTab === 'events'   && <EventsTab {...tabProps} />}
            {activeTab === 'team'     && <TeamTab {...tabProps} />}
            {activeTab === 'speakers' && <SpeakersTab {...tabProps} />}
            {activeTab === 'reviews'  && <ReviewsTab openNewSignal={tabSignal.openNew} initialSearch={tabSignal.search} />}
          </div>
        </main>
      </div>

      {showPasswordModal && <ChangePasswordModal onClose={() => setShowPasswordModal(false)} toast={toast} />}
      {showActivityLog && <ActivityLogModal onClose={() => setShowActivityLog(false)} />}
      <ToastContainer toasts={toasts} />
    </div>
    </UnsavedChangesContext.Provider>
    </ToastContext.Provider>
  );
};

export default AdminDashboard;
