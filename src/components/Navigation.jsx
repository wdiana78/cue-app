import React from 'react';
import {
  Compass,
  Sparkles,
  Flame,
  BookOpen,
  FolderKanban,
  PenTool,
  User,
  MessageCircle,
} from 'lucide-react';

export const Navigation = ({
  activeTab,
  onTabChange,
  onOpenAiCompanion,
}) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Compass },
    { id: 'recommend', label: 'What Should I Do?', icon: Sparkles },
    { id: 'train', label: 'Train Your Cue', icon: Flame },
    { id: 'explore', label: 'My Life', icon: BookOpen },
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
              for Sparks
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                type="button"
                onClick={() => onTabChange(item.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-[#FFE5EF] text-[#FF2E79]'
                    : 'text-[#6B5E66] hover:text-[#2D262A] hover:bg-[#FFF2F7]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Ask Cue Button */}
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
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#F5E6EC] px-2 py-1.5 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`mobile-nav-${item.id}`}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center p-1.5 rounded-xl min-w-[44px] cursor-pointer transition-colors ${
                isActive ? 'text-[#FF2E79]' : 'text-[#8A7983]'
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span className="text-[9px] font-bold truncate max-w-[54px]">
                {item.id === 'recommend'
                  ? 'Decide'
                  : item.id === 'explore'
                  ? 'Life'
                  : item.label}
              </span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
