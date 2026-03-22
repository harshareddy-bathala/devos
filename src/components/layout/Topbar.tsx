import { useLocation } from 'react-router-dom';
import XPChip from '@components/ui/XPChip';
import { useXPStore } from '@/stores/xp.store';
import styles from './Topbar.module.css';

const pageTitles: Record<string, string> = {
  '/': 'Projects',
  '/projects': 'Projects',
  '/stack': 'Stack Radar',
  '/courses': 'Courses',
  '/timetable': 'Timetable',
  '/settings': 'Settings',
};

export default function Topbar() {
  const location = useLocation();
  const { totalXP, levelName } = useXPStore();
  const title = pageTitles[location.pathname] || 'DevOS';

  return (
    <header className={styles.topbar}>
      <div className={styles.titleArea}>
        <h1 className={styles.title}>{title}</h1>
      </div>
      <div className={styles.actions}>
        <span className={styles.level}>{levelName}</span>
        <XPChip value={totalXP} />
      </div>
    </header>
  );
}
