import React, { useState, useEffect } from 'react';
import {
  Compass,
  Sparkles,
  Flame,
  BookOpen,
  FolderKanban,
  PenTool,
  User,
  MessageCircle,
  Calendar,
  LogOut,
} from 'lucide-react';
import { StorageService } from '../services/storage.js';
import { AuthService } from '../services/auth.js';

export const Navigation = ({
  activeTab,
  onTabChange,
  onOpenAiCompanion,
  currentUser,
  onLogout,
}) => {
  const [plans, setPlans] = useState([]);

  const loadPlans = () => {
    setPlans(StorageService.getPlans());
  };

  useEffect(() => {
    loadPlans();
    return StorageService.subscribe(loadPlans);
  }, []);

  const activePlansCount = plans.filter((p) => p.status === 'pending' || p.status === 'in_progress').length;

  const navItems = [
    { id: 'home', label: 'Home', icon: Compass },
    { id: 'recommend', label: 'What Should I Do?', icon: Sparkles },
    { id: 'my_plan', label: 'My Plan', icon: Calendar, badgeCount: activePlansCount },
    { id: 'explore', label: 'My Life', icon: BookOpen },
    { id: 'train', label: 'Train My Cue', icon: Flame },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'reflect', label: 'Reflect', icon: PenTool },
    { id: 'my_cue', label: 'My Cue', icon: User },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FFFDFE]/90 backdrop-blur-md border-b border-[#F5E6EC]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          id="nav-brand-logo"
          type="button"
          onClick={() => onTabChange('home')}
          className="flex items-center gap-2.5 group cursor-pointer focus:outline-hidden"
        >
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#FF2E79] to-[#FFA07A] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 fill-white" />
          </div>
          <div className="text-left">
            <span className="font-display font-black text-xl tracking-tight text-[#2D262A] group-hover:text-[#FF2E79] transition-colors">
              Cue
            </span>
            <span className="hidden sm:inline-block ml-2 text-[11px] font-semibold text-[#8A7983]">
              for {currentUser?.name || 'Sparks'}
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                type="button"
                onClick={() => onTabChange(item.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer relative ${
                  isActive
                    ? 'bg-[#FFE5EF] text-[#FF2E79]'
                    : 'text-[#6B5E66] hover:text-[#2D262A] hover:bg-[#FFF2F7]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.badgeCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-[#FF2E79] text-white text-[10px] font-black leading-none">
                    {item.badgeCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Medium Screen Navigation (md to lg) */}
        <nav className="hidden md:flex lg:hidden items-center gap-1">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-md-${item.id}`}
                type="button"
                onClick={() => onTabChange(item.id)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer relative ${
                  isActive
                    ? 'bg-[#FFE5EF] text-[#FF2E79]'
                    : 'text-[#6B5E66] hover:text-[#2D262A] hover:bg-[#FFF2F7]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label === 'What Should I Do?' ? 'Decide' : item.label}</span>
                {item.badgeCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-[#FF2E79]"></span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Header Controls: Ask Cue & Profile / Logout */}
        <div className="flex items-center gap-2">
          <button
            id="nav-ask-cue-btn"
            type="button"
            onClick={onOpenAiCompanion}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#FAD2E1] bg-white text-xs font-bold text-[#6B5E66] hover:text-[#FF2E79] hover:bg-[#FFE5EF] transition-all cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#FF2E79]" />
            <span>Ask Cue</span>
          </button>

          {onLogout && (
            <button
              id="nav-logout-btn"
              type="button"
              onClick={onLogout}
              className="p-2 rounded-xl text-[#8A7983] hover:text-[#21181D] hover:bg-[#F5EDF0] transition-colors cursor-pointer"
              title="Sign Out / Switch Session"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#F5E6EC] px-2 py-1.5 flex items-center justify-around">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-mobile-${item.id}`}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-bold transition-all relative ${
                isActive ? 'text-[#FF2E79]' : 'text-[#8A7983]'
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span>{item.label === 'What Should I Do?' ? 'Decide' : item.label}</span>
              {item.badgeCount > 0 && (
                <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-[#FF2E79]"></span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};
