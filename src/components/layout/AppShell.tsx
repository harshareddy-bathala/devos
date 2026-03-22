import { ReactNode } from 'react';
import Titlebar from './Titlebar';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import AmbientOrbs from './AmbientOrbs';
import styles from './AppShell.module.css';

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className={styles.shell}>
      <AmbientOrbs />
      <Titlebar />
      <div className={styles.body}>
        <Sidebar />
        <div className={styles.main}>
          <Topbar />
          <main className={styles.content}>{children}</main>
        </div>
      </div>
    </div>
  );
}
