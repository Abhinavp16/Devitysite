// Data Service for Admin Dashboard
// Handles data persistence using localStorage

const STORAGE_KEYS = {
  CLUB_MEMORIES: 'devityclub_memories',
  EVENTS: 'devityclub_events',
  TEAM_MEMBERS: 'devityclub_team',
  SPEAKERS: 'devityclub_speakers'
};

// Default data
const DEFAULT_DATA = {
  clubMemories: [
    { id: 1, title: "Hackathon 2024", description: "Annual coding competition", image: "#", date: "2024-03-15" },
    { id: 2, title: "Tech Workshop", description: "Web development workshop", image: "#", date: "2024-03-10" },
    { id: 3, title: "Guest Lecture Event", description: "Industry expert session", image: "#", date: "2024-03-05" }
  ],
  events: [
    { 
      id: 1, 
      title: "AI & Machine Learning Workshop", 
      date: "2024-03-15", 
      time: "2:00 PM - 5:00 PM", 
      location: "Tech Hub, Room 101", 
      type: "Workshop", 
      description: "Hands-on workshop covering AI and ML fundamentals", 
      status: "upcoming" 
    },
    { 
      id: 2, 
      title: "Web Development Bootcamp", 
      date: "2024-03-22", 
      time: "10:00 AM - 4:00 PM", 
      location: "Innovation Center", 
      type: "Bootcamp", 
      description: "Full-day intensive bootcamp", 
      status: "upcoming" 
    }
  ],
  teamMembers: [
    { 
      id: 1, 
      name: "Mr. Aarekh Verma", 
      role: "President", 
      image: "#", 
      bio: "Full-stack developer with 3+ years experience", 
      skills: ["JavaScript", "Python", "AWS"], 
      type: "core",
      social: { github: "#", linkedin: "#" }
    },
    { 
      id: 2, 
      name: "Ms. Naina Sethia", 
      role: "Vice President", 
      image: "#", 
      bio: "Creative designer passionate about UX", 
      skills: ["Figma", "Design Systems"], 
      type: "core",
      social: { github: "#", linkedin: "#" }
    }
  ],
  speakers: [
    { 
      id: 1, 
      name: "Mr. Vikash Shrivastava", 
      title: "Senior Engineer Manager", 
      company: "Dell Technologies", 
      expertise: ["Ex-Google", "Ex-Cisco"], 
      image: "#" 
    },
    { 
      id: 2, 
      name: "Mr. Rohit Agarwal", 
      title: "Senior Data Engineering Lead", 
      company: "Optum", 
      expertise: ["Data Engineering", "Microservices"], 
      image: "#" 
    }
  ]
};

class DataService {
  // Load data from localStorage or return defaults
  static loadData() {
    try {
      const memories = JSON.parse(localStorage.getItem(STORAGE_KEYS.CLUB_MEMORIES)) || DEFAULT_DATA.clubMemories;
      const events = JSON.parse(localStorage.getItem(STORAGE_KEYS.EVENTS)) || DEFAULT_DATA.events;
      const teamMembers = JSON.parse(localStorage.getItem(STORAGE_KEYS.TEAM_MEMBERS)) || DEFAULT_DATA.teamMembers;
      const speakers = JSON.parse(localStorage.getItem(STORAGE_KEYS.SPEAKERS)) || DEFAULT_DATA.speakers;

      return {
        clubMemories: memories,
        events: events,
        teamMembers: teamMembers,
        speakers: speakers
      };
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      return DEFAULT_DATA;
    }
  }

  // Save data to localStorage
  static saveData(data) {
    try {
      localStorage.setItem(STORAGE_KEYS.CLUB_MEMORIES, JSON.stringify(data.clubMemories));
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(data.events));
      localStorage.setItem(STORAGE_KEYS.TEAM_MEMBERS, JSON.stringify(data.teamMembers));
      localStorage.setItem(STORAGE_KEYS.SPEAKERS, JSON.stringify(data.speakers));
      return true;
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
      return false;
    }
  }

  // Clear all data (useful for reset functionality)
  static clearData() {
    try {
      localStorage.removeItem(STORAGE_KEYS.CLUB_MEMORIES);
      localStorage.removeItem(STORAGE_KEYS.EVENTS);
      localStorage.removeItem(STORAGE_KEYS.TEAM_MEMBERS);
      localStorage.removeItem(STORAGE_KEYS.SPEAKERS);
      return true;
    } catch (error) {
      console.error('Error clearing data from localStorage:', error);
      return false;
    }
  }

  // Reset to default data
  static resetToDefaults() {
    this.clearData();
    this.saveData(DEFAULT_DATA);
    return DEFAULT_DATA;
  }

  // Export data as JSON
  static exportData() {
    const data = this.loadData();
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `devityclub_data_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Import data from JSON
  static importData(jsonData) {
    try {
      const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      
      // Validate data structure
      if (data.clubMemories && data.events && data.teamMembers && data.speakers) {
        this.saveData(data);
        return { success: true, data };
      } else {
        throw new Error('Invalid data structure');
      }
    } catch (error) {
      console.error('Error importing data:', error);
      return { success: false, error: error.message };
    }
  }
}

export default DataService;