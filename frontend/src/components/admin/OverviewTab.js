import { useEffect, useState } from 'react';
import apiService from '../../services/apiService';
import { ActivityItem, ActivityLogModal } from '../AdminDashboardTabs';
import Icon from './icons';

const greeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

const plural = (count, word) => `${count} ${word}${count === 1 ? '' : 's'}`;

// Content problems worth fixing, worked out from the loaded data
const findIssues = ({ clubMemories, events, teamMembers, speakers }) => {
  const issues = [];
  if (events.length > 0 && !events.some((event) => event.status === 'upcoming')) {
    issues.push({ icon: 'calendar', title: 'No upcoming events', detail: 'The "Upcoming events" part of the site is empty.', action: 'Create one', tab: 'events', openNew: true });
  }
  const membersWithoutPhoto = teamMembers.filter((member) => member.is_active && !member.image_url).length;
  if (membersWithoutPhoto > 0) {
    issues.push({ icon: 'photo', title: `${plural(membersWithoutPhoto, 'team member')} without a photo`, detail: 'They show an initial instead of a picture on the site.', action: 'Add photos', tab: 'team' });
  }
  const speakersWithoutPhoto = speakers.filter((speaker) => speaker.is_available && !speaker.image_url).length;
  if (speakersWithoutPhoto > 0) {
    issues.push({ icon: 'microphone', title: `${plural(speakersWithoutPhoto, 'speaker')} without a photo`, detail: 'Visible on the site with an initial instead of a picture.', action: 'Add photos', tab: 'speakers' });
  }
  const memoriesWithoutPhotos = clubMemories.filter((memory) => !(memory.image_urls || []).length).length;
  if (memoriesWithoutPhotos > 0) {
    issues.push({ icon: 'photo', title: `${memoriesWithoutPhotos} ${memoriesWithoutPhotos === 1 ? 'memory' : 'memories'} without photos`, detail: 'The site shows "Photos coming soon" for these events.', action: 'Upload photos', tab: 'memories' });
  }
  return issues;
};

const StatCard = ({ label, value, hint, icon, onClick, loaded }) => (
  <button
    type="button"
    onClick={onClick}
    className="rounded-2xl border border-gray-200 bg-white p-5 text-left transition-all hover:-translate-y-0.5 hover:border-accent hover:shadow-sm"
  >
    <div className="flex items-start justify-between gap-3">
      <span className="text-sm font-medium text-gray-500">{label}</span>
      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent"><Icon name={icon} /></span>
    </div>
    <p className="mt-2 text-3xl font-bold text-gray-900">{loaded ? value : '—'}</p>
    <p className="mt-1 text-xs text-gray-500">{loaded ? hint : 'Loading…'}</p>
  </button>
);

const OverviewTab = ({ dashboardData, loaded, refreshKey, username, onNavigate }) => {
  const [activities, setActivities] = useState([]);
  const [activityError, setActivityError] = useState('');
  const [showActivityLog, setShowActivityLog] = useState(false);

  useEffect(() => {
    apiService.getDashboardStats()
      .then((res) => { setActivities(res.data.recent_activities || []); setActivityError(''); })
      .catch((error) => setActivityError(error.message));
  }, [refreshKey]);

  const { clubMemories, events, teamMembers, speakers } = dashboardData;
  const activeMembers = teamMembers.filter((member) => member.is_active);
  const leadership = activeMembers.filter((member) => member.team_type === 'leadership').length;
  const visibleSpeakers = speakers.filter((speaker) => speaker.is_available).length;
  const issues = loaded ? findIssues(dashboardData) : [];

  const stats = [
    { label: 'Club memories', value: clubMemories.length, hint: `${clubMemories.filter((m) => (m.image_urls || []).length).length} with photos`, icon: 'photo', tab: 'memories' },
    { label: 'Upcoming events', value: events.filter((e) => e.status === 'upcoming').length, hint: `${plural(events.length, 'event')} in total`, icon: 'calendar', tab: 'events' },
    { label: 'Team members', value: activeMembers.length, hint: `${leadership} leadership · ${activeMembers.length - leadership} core`, icon: 'users', tab: 'team' },
    { label: 'Guest speakers', value: speakers.length, hint: visibleSpeakers === speakers.length ? 'all visible on site' : `${visibleSpeakers} visible on site`, icon: 'microphone', tab: 'speakers' }
  ];

  return (
    <div>
      <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">{greeting()}, {username || 'Admin'}</h2>
      <p className="mt-1.5 text-gray-500">Here's what's happening on devityclub.com.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => <StatCard key={stat.label} {...stat} loaded={loaded} onClick={() => onNavigate(stat.tab)} />)}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Needs attention</h3>
            {issues.length > 0 && <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">{issues.length}</span>}
          </div>
          {!loaded && <p className="text-sm text-gray-500">Checking your content…</p>}
          {loaded && issues.length === 0 && (
            <p className="flex items-center gap-2 text-sm text-green-700"><Icon name="check" className="h-5 w-5" /> Everything looks good.</p>
          )}
          <ul className="divide-y divide-gray-100">
            {issues.map((issue) => (
              <li key={issue.title} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                <Icon name={issue.icon} className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900">{issue.title}</p>
                  <p className="text-sm text-gray-500">{issue.detail}</p>
                </div>
                <button type="button" onClick={() => onNavigate(issue.tab, { openNew: issue.openNew })} className="whitespace-nowrap text-sm font-semibold text-accent hover:underline">
                  {issue.action} →
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Recent activity</h3>
            <button type="button" onClick={() => setShowActivityLog(true)} className="text-sm font-semibold text-accent hover:underline">View all</button>
          </div>
          {activityError && <p className="text-sm text-red-600">Couldn't load activity: {activityError}</p>}
          <div className="space-y-3">
            {activities.slice(0, 5).map((activity) => <ActivityItem key={activity.id} activity={activity} />)}
            {!activityError && activities.length === 0 && <p className="text-sm text-gray-500">No activity yet.</p>}
          </div>
        </section>
      </div>

      <section className="mt-4 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
        <h3 className="mb-4 font-semibold text-gray-900">Quick actions</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { label: 'New event', icon: 'calendar', tab: 'events' },
            { label: 'Add team member', icon: 'userPlus', tab: 'team' },
            { label: 'Upload memory', icon: 'photo', tab: 'memories' }
          ].map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={() => onNavigate(action.tab, { openNew: true })}
              className="flex flex-col items-start gap-2 rounded-xl border border-dashed border-gray-300 p-4 text-left text-sm font-semibold text-gray-900 transition-colors hover:border-accent hover:bg-accent-soft"
            >
              <Icon name={action.icon} className="h-5 w-5 text-accent" />
              {action.label}
            </button>
          ))}
        </div>
      </section>

      {showActivityLog && <ActivityLogModal onClose={() => setShowActivityLog(false)} />}
    </div>
  );
};

export default OverviewTab;
