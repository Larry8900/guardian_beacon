import React, { useState } from 'react';
import { Megaphone, Bell, User, LogOut, Home, LayoutDashboard, PlusCircle, AlertTriangle, Menu, X } from 'lucide-react';
import { User as UserType } from '../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentUser: UserType | null;
  onLogout: () => void;
  activeAlertsCount: number;
  unreadNotificationsCount: number;
}

export default function Navbar({
  currentTab,
  setCurrentTab,
  currentUser,
  onLogout,
  activeAlertsCount,
  unreadNotificationsCount
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-rose-100 bg-white shadow-xs">
      {/* Red Alert News Ticker */}
      {activeAlertsCount > 0 && (
        <div className="bg-alert-custom text-white text-xs py-1.5 px-4 font-medium flex items-center justify-between overflow-hidden">
          <div className="flex items-center space-x-2 overflow-hidden">
            <span className="inline-block h-2 w-2 rounded-full bg-white shrink-0 animate-pulse"></span>
            <span className="font-semibold tracking-wider uppercase text-[10px] shrink-0">Critical Broadcast:</span>
            <span className="truncate pr-2">{activeAlertsCount} active missing person alerts currently broadcasted. Stay vigilant.</span>
          </div>
          <button 
            onClick={() => {
              setCurrentTab('notifications');
              setMobileMenuOpen(false);
            }}
            className="hidden sm:inline-block text-[11px] underline hover:text-white/90 font-semibold shrink-0"
          >
            View Live Alerts Feed
          </button>
        </div>
      )}

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div 
          onClick={() => {
            setCurrentTab('landing');
            setMobileMenuOpen(false);
          }} 
          className="flex cursor-pointer items-center space-x-2.5 transition-transform hover:scale-[1.02]"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-custom text-white shadow-md">
            <Megaphone className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
              Guardian<span className="text-secondary-custom">Beacon</span>
            </h1>
            <p className="hidden xs:block text-[9px] font-medium tracking-wide uppercase text-slate-400">
              Crisis Alert Network
            </p>
          </div>
        </div>

        {/* Navigation Menus (Desktop only) */}
        <nav className="hidden md:flex items-center space-x-1.5">
          <button
            onClick={() => setCurrentTab('landing')}
            className={`flex items-center space-x-1 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentTab === 'landing'
                ? 'bg-primary-custom/10 text-primary-custom'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </button>

          {currentUser && (
            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`flex items-center space-x-1 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'dashboard'
                  ? 'bg-primary-custom/10 text-primary-custom'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </button>
          )}

          <button
            onClick={() => setCurrentTab('report')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
              currentTab === 'report'
                ? 'bg-alert-custom/10 text-alert-custom border border-alert-custom/20'
                : 'bg-alert-custom text-white hover:bg-red-700 shadow-sm'
            }`}
          >
            <AlertTriangle className="h-4 w-4" />
            <span>Trigger Alert</span>
          </button>

          <button
            onClick={() => setCurrentTab('notifications')}
            className={`relative flex items-center space-x-1 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentTab === 'notifications'
                ? 'bg-primary-custom/10 text-primary-custom'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Bell className="h-4 w-4" />
            <span>Alerts Feed</span>
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1.5 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-alert-custom text-[10px] font-bold text-white ring-2 ring-white">
                {unreadNotificationsCount}
              </span>
            )}
          </button>
        </nav>

        {/* User profile / Auth Trigger section (Desktop only) */}
        <div className="hidden md:flex items-center space-x-3">
          {currentUser ? (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentTab('profile')}
                className={`flex items-center space-x-2 rounded-full border border-slate-200 bg-slate-50 p-1.5 pr-3.5 text-left text-xs transition-all hover:bg-slate-100 ${
                  currentTab === 'profile' ? 'ring-2 ring-primary-custom/45 border-transparent' : ''
                }`}
              >
                {currentUser.profilePhoto ? (
                  <img
                    src={currentUser.profilePhoto}
                    alt={currentUser.name}
                    className="h-7 w-7 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-custom text-xs font-bold text-white">
                    {currentUser.name.charAt(0)}
                  </div>
                )}
                <div className="hidden xs:block">
                  <p className="font-semibold text-slate-800 line-clamp-1 max-w-[90px]">{currentUser.name}</p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {currentUser.isVerified ? '✓ Verified Account' : 'Guest Account'}
                  </p>
                </div>
              </button>

              <button
                onClick={onLogout}
                title="Log Out"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setCurrentTab('auth')}
              className="flex items-center space-x-1.5 rounded-lg bg-primary-custom px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-teal-800 transition-colors"
            >
              <User className="h-4 w-4" />
              <span>Sign In / Sign Up</span>
            </button>
          )}
        </div>

        {/* Mobile controls section (Mobile only) */}
        <div className="md:hidden flex items-center space-x-2">
          {unreadNotificationsCount > 0 && (
            <button
              onClick={() => {
                setCurrentTab('notifications');
                setMobileMenuOpen(false);
              }}
              className="relative p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition"
              title="Alerts Feed"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-alert-custom text-[8px] font-bold text-white">
                {unreadNotificationsCount}
              </span>
            </button>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg text-slate-605 hover:bg-slate-100 transition border border-slate-200"
            aria-label="Toggle Mobile Menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5 text-slate-700" />
            ) : (
              <Menu className="h-5 w-5 text-slate-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Collapse Navigation Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white py-3 px-4 shadow-lg space-y-2 animate-fade-in divide-y divide-slate-100">
          <div className="space-y-1 pb-3">
            <button
              onClick={() => {
                setCurrentTab('landing');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                currentTab === 'landing'
                  ? 'bg-primary-custom/10 text-primary-custom'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Home className="h-4 w-4" />
              <span>Home Feed</span>
            </button>

            {currentUser && (
              <button
                onClick={() => {
                  setCurrentTab('dashboard');
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                  currentTab === 'dashboard'
                    ? 'bg-primary-custom/10 text-primary-custom'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard Center</span>
              </button>
            )}

            <button
              onClick={() => {
                setCurrentTab('report');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                currentTab === 'report'
                  ? 'bg-alert-custom/10 text-alert-custom font-bold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <PlusCircle className="h-4 w-4 text-alert-custom" />
              <span>Launch Critical Alert</span>
            </button>

            <button
              onClick={() => {
                setCurrentTab('notifications');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                currentTab === 'notifications'
                  ? 'bg-primary-custom/10 text-primary-custom font-bold'
                  : 'text-slate-605 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Bell className="h-4 w-4" />
                <span>Alerts Bulletin Feed</span>
              </div>
              {unreadNotificationsCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-alert-custom text-[10px] font-bold text-white">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>
          </div>

          <div className="pt-3">
            {currentUser ? (
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setCurrentTab('profile');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 rounded-xl border border-slate-100 bg-slate-50/70 p-2 text-left transition-all hover:bg-slate-100 ${
                    currentTab === 'profile' ? 'ring-2 ring-primary-custom/40' : ''
                  }`}
                >
                  {currentUser.profilePhoto ? (
                    <img
                      src={currentUser.profilePhoto}
                      alt={currentUser.name}
                      className="h-8 w-8 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-custom text-xs font-bold text-white">
                      {currentUser.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-bold text-slate-800 leading-none">{currentUser.name}</p>
                    <p className="text-[10px] text-slate-500 mt-1">
                      {currentUser.isVerified ? '✓ Verified Safe Identity' : 'Guest Account Profile'}
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log Out Safety Node</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setCurrentTab('auth');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center space-x-2 rounded-xl bg-primary-custom py-2.5 text-xs font-bold text-white shadow-md hover:bg-teal-800 transition-colors"
              >
                <User className="h-4 w-4" />
                <span>Sign In / Sign Up Operations</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
