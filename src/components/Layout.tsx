import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function Layout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a' }}>
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
      />
      
      <main
        style={{
          minHeight: '100vh',
          padding: '32px',
          marginLeft: isSidebarCollapsed ? '80px' : '280px',
          transition: 'margin-left 0.3s ease',
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}
