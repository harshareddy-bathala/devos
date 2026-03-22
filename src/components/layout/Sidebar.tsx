import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderKanban, Hexagon, BookOpen, Clock, Settings, LucideIcon } from 'lucide-react';
import styles from './Sidebar.module.css';

interface NavItem {
  path: string;
  label: string;
  icon: LucideIcon;
  shortcut: string;
}

const navItems: NavItem[] = [
  { path: '/projects', label: 'Projects', icon: FolderKanban, shortcut: '1' },
  { path: '/stack', label: 'Stack', icon: Hexagon, shortcut: '2' },
  { path: '/courses', label: 'Courses', icon: BookOpen, shortcut: '3' },
  { path: '/timetable', label: 'Timetable', icon: Clock, shortcut: '4' },
];

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCompact, setIsCompact] = useState(() => window.innerWidth < 980);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onResize = () => {
      setIsCompact(window.innerWidth < 980);
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (isCompact && isExpanded) {
      setIsExpanded(false);
    }
  }, [isCompact, isExpanded]);

  const isActive = (path: string) => {
    if (path === '/projects' && location.pathname === '/') return true;
    return location.pathname === path;
  };

  return (
    <motion.aside
      className={styles.sidebar}
      onMouseEnter={() => !isCompact && setIsExpanded(true)}
      onMouseLeave={() => !isCompact && setIsExpanded(false)}
      animate={{ width: isCompact ? 56 : isExpanded ? 188 : 56 }}
      transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
    >
      <nav className={styles.nav}>
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <button
              key={item.path}
              className={`${styles.navItem} ${active ? styles.active : ''}`}
              onClick={() => navigate(item.path)}
              title={item.label}
            >
              <span className={styles.iconWrapper}>
                <Icon size={20} strokeWidth={1.75} />
                {active && (
                  <motion.span
                    className={styles.activeIndicator}
                    layoutId="activeIndicator"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </span>

              <AnimatePresence>
                {isExpanded && (
                  <motion.span
                    className={styles.label}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{
                      duration: 0.18,
                      delay: index * 0.03,
                    }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </nav>

      <div className={styles.footer}>
        <button
          className={styles.navItem}
          onClick={() => navigate('/settings')}
          title="Settings"
        >
          <span className={styles.iconWrapper}>
            <Settings size={20} strokeWidth={1.75} />
          </span>
          <AnimatePresence>
            {isExpanded && (
              <motion.span
                className={styles.label}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.18 }}
              >
                Settings
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
}
