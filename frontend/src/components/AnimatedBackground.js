import { useEffect, useState, useMemo } from 'react';

// Hero Section Animated Background (Enhanced)
export const HeroAnimatedBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/8 via-purple-900/4 to-indigo-900/8"></div>

      {/* Clean geometric shapes only */}
      <div className="absolute top-20 right-1/4 w-40 h-40 bg-blue-500/5 rounded-full animate-float"></div>
      <div className="absolute bottom-32 left-1/3 w-36 h-36 bg-purple-500/5 rounded-lg animate-float-reverse"></div>
      <div className="absolute top-1/3 right-16 w-32 h-32 bg-indigo-500/5 rounded-full animate-pulse"></div>
      <div className="absolute bottom-1/4 left-1/4 w-28 h-28 bg-pink-500/5 rounded-lg animate-float-diagonal"></div>
      <div className="absolute top-1/2 left-16 w-24 h-24 bg-cyan-500/5 rounded-full animate-float"></div>

      {/* Subtle dots for tech feel */}
      <div className="absolute top-10 left-10 w-2 h-2 bg-blue-400/20 rounded-full animate-pulse"></div>
      <div className="absolute top-16 left-20 w-1 h-1 bg-purple-400/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-10 right-10 w-2 h-2 bg-indigo-400/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-16 right-20 w-1 h-1 bg-cyan-400/20 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
    </div>
  );
};

// About Section Animated Background
export const AboutAnimatedBackground = () => {
  const [particles, setParticles] = useState([]);

  const aboutIcons = useMemo(() => [
    { content: '🎓', color: 'text-blue-400' },
    { content: '👥', color: 'text-green-400' },
    { content: '🏆', color: 'text-purple-400' },
    { content: '💡', color: 'text-orange-400' },
    { content: '📚', color: 'text-indigo-400' },
    { content: '🔬', color: 'text-cyan-400' },
    { content: '⚛️', color: 'text-blue-400' },
    { content: '🚀', color: 'text-red-400' },
    { content: '💻', color: 'text-gray-400' },
    { content: '⚡', color: 'text-yellow-400' },
    { content: '🌐', color: 'text-cyan-400' },
    { content: '🔥', color: 'text-orange-400' },
  ], []);

  useEffect(() => {
    const newParticles = [];
    for (let i = 0; i < 25; i++) {
      const icon = aboutIcons[Math.floor(Math.random() * aboutIcons.length)];
      newParticles.push({
        id: i,
        icon: icon,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 20 + 20,
        duration: Math.random() * 8 + 6,
        delay: Math.random() * 4,
        opacity: Math.random() * 0.3 + 0.1,
      });
    }
    setParticles(newParticles);
  }, [aboutIcons]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-float"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            opacity: particle.opacity,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
            fontSize: `${particle.size}px`,
          }}
        >
          <span className={particle.icon.color}>{particle.icon.content}</span>
        </div>
      ))}

      <div className="absolute top-10 right-10 w-24 h-24 bg-blue-100/30 rounded-full animate-float"></div>
      <div className="absolute bottom-20 left-16 w-20 h-20 bg-green-100/30 rounded-lg animate-float-reverse"></div>
      <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-purple-100/30 rounded-full animate-pulse"></div>
    </div>
  );
};

// Team Section Animated Background
export const TeamAnimatedBackground = () => {
  const [particles, setParticles] = useState([]);

  const teamIcons = useMemo(() => [
    { content: '👨‍💻', color: 'text-indigo-400' },
    { content: '👩‍💻', color: 'text-purple-400' },
    { content: '🤝', color: 'text-blue-400' },
    { content: '⭐', color: 'text-yellow-400' },
    { content: '🎯', color: 'text-red-400' },
    { content: '🔥', color: 'text-orange-400' },
    { content: '💡', color: 'text-yellow-300' },
    { content: '✨', color: 'text-blue-300' },
    { content: '🔮', color: 'text-purple-400' },
    { content: '⚛️', color: 'text-blue-400' },
    { content: '🚀', color: 'text-red-400' },
    { content: '💻', color: 'text-gray-400' },
  ], []);

  useEffect(() => {
    const newParticles = [];
    for (let i = 0; i < 30; i++) {
      const icon = teamIcons[Math.floor(Math.random() * teamIcons.length)];
      newParticles.push({
        id: i,
        icon: icon,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 18 + 16,
        duration: Math.random() * 10 + 8,
        delay: Math.random() * 6,
        opacity: Math.random() * 0.25 + 0.1,
        animationType: Math.floor(Math.random() * 3),
      });
    }
    setParticles(newParticles);
  }, [teamIcons]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => {
        const getAnimationClass = () => {
          switch (particle.animationType) {
            case 0: return 'animate-float';
            case 1: return 'animate-float-reverse';
            case 2: return 'animate-float-diagonal';
            default: return 'animate-float';
          }
        };

        return (
          <div
            key={particle.id}
            className={`absolute ${getAnimationClass()}`}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              opacity: particle.opacity,
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.delay}s`,
              fontSize: `${particle.size}px`,
            }}
          >
            <span className={particle.icon.color}>{particle.icon.content}</span>
          </div>
        );
      })}

      <div className="absolute top-16 left-12 w-28 h-28 bg-gradient-to-br from-indigo-200/20 to-purple-200/20 rounded-full animate-float"></div>
      <div className="absolute bottom-24 right-20 w-24 h-24 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-lg animate-float-reverse"></div>
      <div className="absolute top-1/3 left-1/4 w-20 h-20 bg-gradient-to-br from-blue-200/20 to-indigo-200/20 rounded-full animate-float-diagonal"></div>
    </div>
  );
};

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white/30 to-indigo-50/50"></div>
    </div>
  );
};

export default AnimatedBackground;
// Club Memories Section Animated Background
export const ClubMemoriesAnimatedBackground = () => {
  const [particles, setParticles] = useState([]);

  const memoryIcons = useMemo(() => [
    { content: '📸', color: 'text-pink-400' },
    { content: '🎉', color: 'text-yellow-400' },
    { content: '🏆', color: 'text-amber-400' },
    { content: '🎊', color: 'text-purple-400' },
    { content: '✨', color: 'text-blue-400' },
    { content: '🌟', color: 'text-orange-400' },
    { content: '💫', color: 'text-indigo-400' },
    { content: '🎭', color: 'text-red-400' },
    { content: '🎪', color: 'text-green-400' },
    { content: '🎨', color: 'text-cyan-400' },
    { content: '⚛️', color: 'text-blue-400' },
    { content: '🚀', color: 'text-red-400' },
    { content: '💻', color: 'text-gray-400' },
    { content: '⚡', color: 'text-yellow-400' },
    { content: '🌐', color: 'text-cyan-400' },
    { content: '🔥', color: 'text-orange-400' },
  ], []);

  useEffect(() => {
    const newParticles = [];
    for (let i = 0; i < 25; i++) {
      const icon = memoryIcons[Math.floor(Math.random() * memoryIcons.length)];
      newParticles.push({
        id: i,
        icon: icon,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 22 + 18,
        duration: Math.random() * 15 + 10,
        delay: Math.random() * 8,
        opacity: Math.random() * 0.4 + 0.2,
        animationType: Math.floor(Math.random() * 4),
      });
    }
    setParticles(newParticles);
  }, [memoryIcons]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => {
        const getAnimationClass = () => {
          switch (particle.animationType) {
            case 0: return 'animate-float';
            case 1: return 'animate-float-reverse';
            case 2: return 'animate-float-diagonal';
            case 3: return 'animate-float-circular';
            default: return 'animate-float';
          }
        };

        return (
          <div
            key={particle.id}
            className={`absolute ${getAnimationClass()}`}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              opacity: particle.opacity,
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.delay}s`,
              fontSize: `${particle.size}px`,
            }}
          >
            <span className={particle.icon.color}>{particle.icon.content}</span>
          </div>
        );
      })}

      {/* Memory-themed geometric shapes */}
      <div className="absolute top-20 left-16 w-36 h-36 bg-gradient-to-br from-pink-200/20 to-purple-200/20 rounded-full animate-float"></div>
      <div className="absolute bottom-32 right-24 w-32 h-32 bg-gradient-to-br from-yellow-200/20 to-orange-200/20 rounded-lg animate-float-reverse"></div>
      <div className="absolute top-1/2 left-1/4 w-28 h-28 bg-gradient-to-br from-blue-200/20 to-cyan-200/20 rounded-full animate-float-diagonal"></div>
      <div className="absolute bottom-1/4 right-1/3 w-24 h-24 bg-gradient-to-br from-green-200/20 to-emerald-200/20 rounded-lg animate-pulse"></div>
    </div>
  );
};

// Events Section Animated Background (Enhanced)
export const EventsAnimatedBackground = () => {
  const [particles, setParticles] = useState([]);

  const eventIcons = useMemo(() => [
    { content: '🎪', color: 'text-pink-400' },
    { content: '🎭', color: 'text-purple-400' },
    { content: '🎨', color: 'text-blue-400' },
    { content: '🎯', color: 'text-red-400' },
    { content: '🎊', color: 'text-yellow-400' },
    { content: '🎉', color: 'text-green-400' },
    { content: '🎵', color: 'text-indigo-400' },
    { content: '🎤', color: 'text-orange-400' },
    { content: '🎬', color: 'text-cyan-400' },
    { content: '🎮', color: 'text-rose-400' },
    { content: '🏆', color: 'text-amber-400' },
    { content: '🎓', color: 'text-emerald-400' },
    { content: '⚛️', color: 'text-blue-400' },
    { content: '🚀', color: 'text-red-400' },
    { content: '💻', color: 'text-gray-400' },
    { content: '⚡', color: 'text-yellow-400' },
    { content: '🌐', color: 'text-cyan-400' },
    { content: '🔥', color: 'text-orange-400' },
    { content: '💡', color: 'text-yellow-300' },
    { content: '✨', color: 'text-blue-300' },
  ], []);

  useEffect(() => {
    const newParticles = [];
    for (let i = 0; i < 30; i++) {
      const icon = eventIcons[Math.floor(Math.random() * eventIcons.length)];
      newParticles.push({
        id: i,
        icon: icon,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 20 + 16,
        duration: Math.random() * 12 + 8,
        delay: Math.random() * 6,
        opacity: Math.random() * 0.35 + 0.15,
        animationType: Math.floor(Math.random() * 4),
      });
    }
    setParticles(newParticles);
  }, [eventIcons]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => {
        const getAnimationClass = () => {
          switch (particle.animationType) {
            case 0: return 'animate-float';
            case 1: return 'animate-float-reverse';
            case 2: return 'animate-float-diagonal';
            case 3: return 'animate-float-circular';
            default: return 'animate-float';
          }
        };

        return (
          <div
            key={particle.id}
            className={`absolute ${getAnimationClass()}`}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              opacity: particle.opacity,
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.delay}s`,
              fontSize: `${particle.size}px`,
            }}
          >
            <span className={particle.icon.color}>{particle.icon.content}</span>
          </div>
        );
      })}

      {/* Event-themed geometric shapes */}
      <div className="absolute top-20 right-16 w-40 h-40 bg-gradient-to-br from-pink-200/15 to-purple-200/15 rounded-full animate-float"></div>
      <div className="absolute bottom-32 left-24 w-36 h-36 bg-gradient-to-br from-yellow-200/15 to-orange-200/15 rounded-lg animate-float-reverse"></div>
      <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-gradient-to-br from-blue-200/15 to-cyan-200/15 rounded-full animate-pulse"></div>
      <div className="absolute bottom-1/4 left-1/3 w-28 h-28 bg-gradient-to-br from-green-200/15 to-emerald-200/15 rounded-lg animate-float-diagonal"></div>
    </div>
  );
};

// Speakers Section Animated Background
export const SpeakersAnimatedBackground = () => {
  const [particles, setParticles] = useState([]);

  const speakerIcons = [
    { content: '🎤', color: 'text-blue-400' },
    { content: '🎙️', color: 'text-purple-400' },
    { content: '💡', color: 'text-yellow-400' },
    { content: '🧠', color: 'text-indigo-400' },
    { content: '📢', color: 'text-orange-400' },
    { content: '🌟', color: 'text-cyan-400' },
    { content: '✨', color: 'text-rose-400' },
    { content: '🎓', color: 'text-emerald-400' },
    { content: '🏆', color: 'text-amber-400' },
    { content: '⚛️', color: 'text-blue-400' },
    { content: '💻', color: 'text-gray-400' },
    { content: '⚡', color: 'text-yellow-400' },
    { content: '🌐', color: 'text-cyan-400' },
    { content: '🔥', color: 'text-orange-400' },
  ];

  useEffect(() => {
    const newParticles = [];
    for (let i = 0; i < 30; i++) {
      const icon = speakerIcons[Math.floor(Math.random() * speakerIcons.length)];
      newParticles.push({
        id: i,
        icon: icon,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 20 + 16,
        duration: Math.random() * 12 + 8,
        delay: Math.random() * 7,
        opacity: Math.random() * 0.4 + 0.2,
        animationType: Math.floor(Math.random() * 4),
      });
    }
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => {
        const getAnimationClass = () => {
          switch (particle.animationType) {
            case 0: return 'animate-float';
            case 1: return 'animate-float-reverse';
            case 2: return 'animate-float-diagonal';
            case 3: return 'animate-float-circular';
            default: return 'animate-float';
          }
        };

        return (
          <div
            key={particle.id}
            className={`absolute ${getAnimationClass()}`}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              opacity: particle.opacity,
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.delay}s`,
              fontSize: `${particle.size}px`,
            }}
          >
            <span className={particle.icon.color}>{particle.icon.content}</span>
          </div>
        );
      })}

      {/* Speaker-themed geometric shapes */}
      <div className="absolute top-24 left-20 w-34 h-34 bg-gradient-to-br from-blue-200/20 to-indigo-200/20 rounded-full animate-float"></div>
      <div className="absolute bottom-28 right-16 w-30 h-30 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-lg animate-float-reverse"></div>
      <div className="absolute top-1/3 right-1/4 w-26 h-26 bg-gradient-to-br from-green-200/20 to-emerald-200/20 rounded-full animate-pulse"></div>
    </div>
  );
};

// Contact Section Animated Background (Enhanced)
export const ContactAnimatedBackground = () => {
  const [particles, setParticles] = useState([]);

  const contactIcons = [
    { content: '📧', color: 'text-blue-400' },
    { content: '📱', color: 'text-green-400' },
    { content: '🌐', color: 'text-purple-400' },
    { content: '💬', color: 'text-indigo-400' },
    { content: '📍', color: 'text-red-400' },
    { content: '🔗', color: 'text-cyan-400' },
    { content: '📞', color: 'text-orange-400' },
    { content: '✉️', color: 'text-pink-400' },
    { content: '🗨️', color: 'text-yellow-400' },
    { content: '📬', color: 'text-emerald-400' },
    { content: '📮', color: 'text-rose-400' },
    { content: '📡', color: 'text-amber-400' },
    { content: '⚛️', color: 'text-blue-400' },
    { content: '🚀', color: 'text-red-400' },
    { content: '💻', color: 'text-gray-400' },
    { content: '⚡', color: 'text-yellow-400' },
    { content: '💡', color: 'text-yellow-300' },
    { content: '✨', color: 'text-blue-300' },
  ];

  useEffect(() => {
    const newParticles = [];
    for (let i = 0; i < 25; i++) {
      const icon = contactIcons[Math.floor(Math.random() * contactIcons.length)];
      newParticles.push({
        id: i,
        icon: icon,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 22 + 18,
        duration: Math.random() * 12 + 8,
        delay: Math.random() * 5,
        opacity: Math.random() * 0.4 + 0.2,
        animationType: Math.floor(Math.random() * 4),
      });
    }
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => {
        const getAnimationClass = () => {
          switch (particle.animationType) {
            case 0: return 'animate-float';
            case 1: return 'animate-float-reverse';
            case 2: return 'animate-float-diagonal';
            case 3: return 'animate-float-circular';
            default: return 'animate-float';
          }
        };

        return (
          <div
            key={particle.id}
            className={`absolute ${getAnimationClass()}`}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              opacity: particle.opacity,
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.delay}s`,
              fontSize: `${particle.size}px`,
            }}
          >
            <span className={particle.icon.color}>{particle.icon.content}</span>
          </div>
        );
      })}

      {/* Contact-themed geometric shapes */}
      <div className="absolute top-16 left-20 w-28 h-28 bg-blue-100/25 rounded-full animate-float"></div>
      <div className="absolute bottom-24 right-16 w-32 h-32 bg-green-100/25 rounded-lg animate-float-reverse"></div>
      <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-purple-100/25 rounded-full animate-pulse"></div>
      <div className="absolute bottom-1/3 right-1/4 w-20 h-20 bg-orange-100/25 rounded-lg animate-float-diagonal"></div>
    </div>
  );
};

// Speaker Review Section Animated Background
export const SpeakerReviewAnimatedBackground = () => {
  const [particles, setParticles] = useState([]);

  const speakerReviewIcons = [
    { content: '🎤', color: 'text-blue-400' },
    { content: '🗣️', color: 'text-purple-400' },
    { content: '💬', color: 'text-green-400' },
    { content: '⭐', color: 'text-yellow-400' },
    { content: '👏', color: 'text-pink-400' },
    { content: '🎯', color: 'text-red-400' },
    { content: '💡', color: 'text-orange-400' },
    { content: '🌟', color: 'text-cyan-400' },
    { content: '✨', color: 'text-indigo-400' },
    { content: '🎙️', color: 'text-purple-300' },
    { content: '📢', color: 'text-orange-300' },
    { content: '👨‍🏫', color: 'text-blue-300' },
    { content: '👩‍🏫', color: 'text-pink-300' },
    { content: '🏆', color: 'text-amber-400' },
    { content: '🎓', color: 'text-emerald-400' },
    { content: '💭', color: 'text-gray-400' },
    { content: '🔥', color: 'text-red-300' },
    { content: '⚡', color: 'text-yellow-300' },
    { content: '🚀', color: 'text-blue-500' },
    { content: '💻', color: 'text-gray-300' },
  ];

  useEffect(() => {
    const newParticles = [];
    for (let i = 0; i < 30; i++) {
      const icon = speakerReviewIcons[Math.floor(Math.random() * speakerReviewIcons.length)];
      newParticles.push({
        id: i,
        icon: icon,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 22 + 16,
        duration: Math.random() * 16 + 12,
        delay: Math.random() * 8,
        opacity: Math.random() * 0.3 + 0.15,
        animationType: Math.floor(Math.random() * 4),
      });
    }
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => {
        const getAnimationClass = () => {
          switch (particle.animationType) {
            case 0: return 'animate-float';
            case 1: return 'animate-float-reverse';
            case 2: return 'animate-float-diagonal';
            case 3: return 'animate-float-circular';
            default: return 'animate-float';
          }
        };

        return (
          <div
            key={particle.id}
            className={`absolute ${getAnimationClass()}`}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              opacity: particle.opacity,
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.delay}s`,
              fontSize: `${particle.size}px`,
            }}
          >
            <span className={particle.icon.color}>{particle.icon.content}</span>
          </div>
        );
      })}

      {/* Speaker review themed geometric shapes */}
      <div className="absolute top-20 left-16 w-32 h-32 bg-gradient-to-br from-blue-200/15 to-purple-200/15 rounded-full animate-float"></div>
      <div className="absolute bottom-32 right-20 w-28 h-28 bg-gradient-to-br from-yellow-200/15 to-orange-200/15 rounded-lg animate-float-reverse"></div>
      <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-gradient-to-br from-green-200/15 to-emerald-200/15 rounded-full animate-pulse"></div>
      <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-gradient-to-br from-pink-200/15 to-rose-200/15 rounded-lg animate-float-diagonal"></div>
    </div>
  );
};