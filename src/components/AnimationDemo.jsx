// AnimationDemo.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { FaBell, FaMoon, FaSun, FaBars, FaTimes, FaUser, FaChartLine, FaCalendarAlt, FaUsers, FaCog } from 'react-icons/fa';

// ------------------------------------------------------------
// 1. Smooth page transitions (fade + slide)
// 2. Scroll animations (fade-up)
// 3. Glassmorphism cards with hover lift
// 4. Sidebar open/close animation
// 5. Animated dashboard counters
// 6. Loading skeleton animations
// 7. Notification bell shake
// 8. Navbar blur on scroll
// 9. 3D tilt card effect
// 10. Cursor glow effect
// 11. Smooth dark/light mode transition
// 12. Apple-inspired motion design
// ------------------------------------------------------------

// ---------- Custom hooks ----------
const useScrollAnimation = () => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return { ref, isVisible };
};

// CountUp animation
const CountUp = ({ end, duration = 2, prefix = '' }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = end / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [end, duration]);
  return <span>{prefix}{count.toLocaleString()}</span>;
};

// Skeleton loader
const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton-line" style={{ width: '60%', height: '20px' }}></div>
    <div className="skeleton-line" style={{ width: '80%', height: '16px', marginTop: '12px' }}></div>
    <div className="skeleton-line" style={{ width: '40%', height: '16px', marginTop: '8px' }}></div>
  </div>
);

// Main Component
export default function AnimationDemo() {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ patients: 0, appointments: 0, revenue: 0 });
  const [glowPosition, setGlowPosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  const navbarOpacity = useTransform(scrollY, [0, 100], [0.95, 0.98]);
  const navbarBlur = useTransform(scrollY, [0, 100], ['blur(0px)', 'blur(8px)']);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1500);
    // Animate counters
    const timer = setTimeout(() => {
      setStats({ patients: 2847, appointments: 189, revenue: 45200 });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Toggle dark mode class on body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  // Cursor glow effect (moves with mouse)
  useEffect(() => {
    const handleMouseMove = (e) => {
      setGlowPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Sample data for cards
  const features = [
    { title: 'Patient Management', value: stats.patients, unit: 'patients', icon: <FaUsers />, color: '#4A90E2' },
    { title: 'Appointments', value: stats.appointments, unit: 'today', icon: <FaCalendarAlt />, color: '#28C76F' },
    { title: 'Revenue', value: stats.revenue, unit: 'revenue', icon: <FaChartLine />, color: '#FF9F43', prefix: '₹' },
  ];

  const recentActivity = [
    { id: 1, action: 'New patient registered', time: '2 min ago', user: 'John Doe' },
    { id: 2, action: 'Appointment confirmed', time: '15 min ago', user: 'Sarah Smith' },
    { id: 3, action: 'Prescription issued', time: '1 hour ago', user: 'Dr. Wilson' },
  ];

  return (
    <div className={`app-container ${darkMode ? 'dark' : 'light'}`}>
      {/* Custom cursor glow */}
      <div
        className="cursor-glow"
        style={{
          left: glowPosition.x,
          top: glowPosition.y,
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Navbar with blur on scroll */}
      <motion.nav
        className="navbar"
        style={{ opacity: navbarOpacity, backdropFilter: navbarBlur }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="nav-left">
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
          <h2 className="logo">CarePlus</h2>
        </div>
        <div className="nav-right">
          {/* Notification bell with shake animation */}
          <motion.div
            className="notification-icon"
            animate={showNotification ? { rotate: [0, -15, 15, -10, 10, 0] } : {}}
            transition={{ duration: 0.5 }}
            onClick={() => setShowNotification(false)}
          >
            <FaBell />
            {showNotification && <span className="notification-dot" />}
          </motion.div>
          <motion.button
            className="theme-toggle"
            whileTap={{ scale: 0.9 }}
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </motion.button>
          <div className="avatar">JD</div>
        </div>
      </motion.nav>

      {/* Sidebar with smooth open/close */}
      <motion.aside
        className="sidebar"
        initial={{ width: 260 }}
        animate={{ width: sidebarOpen ? 260 : 80 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="sidebar-menu">
          {['Dashboard', 'Patients', 'Appointments', 'Analytics', 'Settings'].map((item, i) => (
            <motion.div
              key={item}
              className="sidebar-item"
              whileHover={{ x: 5 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              {i === 0 && <FaChartLine />}
              {i === 1 && <FaUsers />}
              {i === 2 && <FaCalendarAlt />}
              {i === 3 && <FaChartLine />}
              {i === 4 && <FaCog />}
              {sidebarOpen && <span>{item}</span>}
            </motion.div>
          ))}
        </div>
      </motion.aside>

      {/* Main content */}
      <main className="main-content" style={{ marginLeft: sidebarOpen ? 260 : 80 }}>
        <div className="content-wrapper">
          {/* Hero section with fade-in */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="hero"
          >
            <h1>Dashboard</h1>
            <p>Welcome back, Dr. John</p>
          </motion.div>

          {/* Animated Counters (Glassmorphism cards) */}
          <div className="stats-grid">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                className="glass-card stat-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, type: 'spring', stiffness: 200 }}
                whileHover={{ y: -8, scale: 1.02 }}
                style={{ borderTop: `3px solid ${feature.color}` }}
              >
                <div className="stat-icon" style={{ color: feature.color }}>
                  {feature.icon}
                </div>
                <div className="stat-info">
                  <h3>{feature.title}</h3>
                  <div className="stat-value">
                    {isLoading ? <SkeletonCard /> : <CountUp end={feature.value} duration={1.5} prefix={feature.prefix || ''} />}
                    <span className="stat-unit">{feature.unit}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* 3D Tilt Card Effect & Scroll Animations */}
          <div className="cards-grid">
            {recentActivity.map((activity, idx) => {
              const { ref, isVisible } = useScrollAnimation();
              return (
                <motion.div
                  key={activity.id}
                  ref={ref}
                  className="glass-card activity-card"
                  initial="hidden"
                  animate={isVisible ? "visible" : "hidden"}
                  variants={{
                    hidden: { opacity: 0, y: 40 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: idx * 0.1 } }
                  }}
                  whileHover={{ scale: 1.02, rotateX: 5, rotateY: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div className="activity-content">
                    <h4>{activity.action}</h4>
                    <p>{activity.user} • {activity.time}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Additional Glassmorphism Row with fade-up scroll animation */}
          <div className="analytics-row">
            <motion.div
              className="glass-card analytics-chart"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3>Appointment Trends</h3>
              <div className="chart-placeholder">📊 Chart goes here</div>
            </motion.div>
            <motion.div
              className="glass-card recent-patients"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3>Recent Patients</h3>
              <ul>
                <li>Emily Clarke • Checkup</li>
                <li>Michael Brown • Follow-up</li>
                <li>Jessica Lee • Consultation</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Global styles with keyframes and transitions */}
      <style jsx>{`
        /* Base styles */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          transition: background-color 0.3s ease, color 0.2s ease;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          overflow-x: hidden;
        }

        .app-container {
          min-height: 100vh;
          background: var(--bg-gradient);
          transition: background 0.3s ease;
        }

        /* Light / Dark mode variables */
        .light {
          --bg-gradient: linear-gradient(135deg, #f5f7fa 0%, #e9edf2 100%);
          --card-bg: rgba(255, 255, 255, 0.85);
          --text-primary: #1a1a2e;
          --text-secondary: #4a5568;
          --border: rgba(0, 0, 0, 0.05);
          --shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
          --navbar-bg: rgba(255, 255, 255, 0.9);
        }

        .dark {
          --bg-gradient: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          --card-bg: rgba(30, 30, 46, 0.85);
          --text-primary: #f0f0f0;
          --text-secondary: #a0a0b0;
          --border: rgba(255, 255, 255, 0.05);
          --shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          --navbar-bg: rgba(30, 30, 46, 0.9);
        }

        /* Navbar */
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 70px;
          background: var(--navbar-bg);
          backdrop-filter: blur(10px);
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 30px;
          z-index: 100;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          border-bottom: 1px solid var(--border);
        }

        .nav-left {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .sidebar-toggle {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: var(--text-primary);
        }

        .logo {
          font-size: 24px;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .notification-icon {
          position: relative;
          font-size: 22px;
          cursor: pointer;
          color: var(--text-primary);
        }

        .notification-dot {
          position: absolute;
          top: -4px;
          right: -4px;
          width: 10px;
          height: 10px;
          background: #ef4444;
          border-radius: 50%;
        }

        .theme-toggle, .sidebar-toggle {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: var(--text-primary);
        }

        .avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
        }

        /* Sidebar */
        .sidebar {
          position: fixed;
          left: 0;
          top: 70px;
          bottom: 0;
          background: var(--card-bg);
          backdrop-filter: blur(12px);
          border-right: 1px solid var(--border);
          overflow-x: hidden;
          z-index: 99;
          padding-top: 20px;
        }

        .sidebar-menu {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 0 16px;
        }

        .sidebar-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 12px 16px;
          border-radius: 12px;
          cursor: pointer;
          color: var(--text-secondary);
          transition: background 0.2s;
        }

        .sidebar-item:hover {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
        }

        /* Main content */
        .main-content {
          margin-top: 70px;
          transition: margin-left 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1);
          padding: 24px;
        }

        .content-wrapper {
          max-width: 1400px;
          margin: 0 auto;
        }

        /* Glassmorphism card */
        .glass-card {
          background: var(--card-bg);
          backdrop-filter: blur(12px);
          border-radius: 24px;
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
          padding: 24px;
          transition: all 0.3s ease;
        }

        /* Stats grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .stat-icon {
          font-size: 32px;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(102, 126, 234, 0.1);
          border-radius: 18px;
        }

        .stat-info h3 {
          font-size: 14px;
          font-weight: 500;
          color: var(--text-secondary);
          margin-bottom: 8px;
        }

        .stat-value {
          font-size: 28px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .stat-unit {
          font-size: 14px;
          font-weight: 400;
          margin-left: 4px;
          color: var(--text-secondary);
        }

        /* Activity cards grid */
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .activity-card {
          cursor: pointer;
        }

        .activity-content h4 {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .activity-content p {
          font-size: 13px;
          color: var(--text-secondary);
        }

        /* Analytics row */
        .analytics-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
        }

        .chart-placeholder {
          height: 200px;
          background: rgba(102, 126, 234, 0.1);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          margin-top: 16px;
        }

        .recent-patients ul {
          list-style: none;
          margin-top: 16px;
        }

        .recent-patients li {
          padding: 12px 0;
          border-bottom: 1px solid var(--border);
          color: var(--text-secondary);
          font-size: 14px;
        }

        /* Skeleton animation */
        .skeleton-card {
          width: 100%;
        }
        .skeleton-line {
          background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 8px;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .dark .skeleton-line {
          background: linear-gradient(90deg, #2d2d44 25%, #3a3a50 50%, #2d2d44 75%);
        }

        /* Cursor glow */
        .cursor-glow {
          position: fixed;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(102,126,234,0.15) 0%, rgba(102,126,234,0) 70%);
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          transition: transform 0.05s linear;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .sidebar {
            width: 80px;
          }
          .main-content {
            margin-left: 80px;
          }
          .stats-grid {
            grid-template-columns: 1fr;
          }
          .cursor-glow {
            display: none;
          }
        }

        .hero {
          margin-bottom: 32px;
        }
        .hero h1 {
          font-size: 32px;
          color: var(--text-primary);
        }
        .hero p {
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
}