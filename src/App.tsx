import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import AppShell from '@components/layout/AppShell';
import ToastContainer from '@components/ui/ToastContainer';
import ProjectsView from '@features/projects/ProjectsView';
import StackView from '@features/stack/StackView';
import CoursesView from '@features/courses/CoursesView';
import TimetableView from '@features/timetable/TimetableView';
import SettingsView from '@features/settings/SettingsView';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import { useProjectsStore } from '@/stores/projects.store';
import { useXPStore } from '@/stores/xp.store';

function AppContent() {
  useKeyboardNavigation();
  const loadProjects = useProjectsStore((state) => state.load);
  const refreshXP = useXPStore((state) => state.refresh);

  useEffect(() => {
    void loadProjects();
    void refreshXP();
  }, [loadProjects, refreshXP]);

  return (
    <>
      <AppShell>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<ProjectsView />} />
            <Route path="/projects" element={<ProjectsView />} />
            <Route path="/stack" element={<StackView />} />
            <Route path="/courses" element={<CoursesView />} />
            <Route path="/timetable" element={<TimetableView />} />
            <Route path="/settings" element={<SettingsView />} />
          </Routes>
        </AnimatePresence>
      </AppShell>
      <ToastContainer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
