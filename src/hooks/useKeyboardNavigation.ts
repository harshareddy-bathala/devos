import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NAVIGATION_KEYS: Record<string, string> = {
  '1': '/projects',
  '2': '/stack',
  '3': '/courses',
  '4': '/timetable',
};

export function useKeyboardNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      // Ignore if meta/ctrl keys are pressed (except for settings shortcut)
      if (e.altKey) return;

      // Cmd/Ctrl + , for Settings
      if ((e.metaKey || e.ctrlKey) && e.key === ',') {
        e.preventDefault();
        navigate('/settings');
        return;
      }

      // Don't process other shortcuts if meta/ctrl is pressed
      if (e.metaKey || e.ctrlKey) return;

      // Number keys for navigation
      const path = NAVIGATION_KEYS[e.key];
      if (path && location.pathname !== path) {
        e.preventDefault();
        navigate(path);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, location.pathname]);
}
