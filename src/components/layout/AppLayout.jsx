import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { LevelUpModal } from '../interactive/LevelUpModal';
import { DailyChallengeModal } from '../interactive/DailyChallengeModal';
import { LessonPlayerModal } from '../interactive/LessonPlayerModal';
import { SearchModal } from '../interactive/SearchModal';

export const AppLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Navigation */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Header Bar */}
        <TopBar setMobileOpen={setMobileOpen} />

        {/* Page Content View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Global Interactive Modals */}
      <LevelUpModal />
      <DailyChallengeModal />
      <LessonPlayerModal />
      <SearchModal />
    </div>
  );
};
