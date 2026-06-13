import React, { useState } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  Filter, 
  ShieldAlert, 
  Eye, 
  Info,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { AlertNotification, MissingPersonAlert, SightingReport } from '../types';

interface NotificationsPageProps {
  notifications: AlertNotification[];
  alerts: MissingPersonAlert[];
  sightings: SightingReport[];
  onSelectAlert: (alert: MissingPersonAlert) => void;
  onClearUnread: () => void;
}

export default function NotificationsPage({
  notifications,
  alerts,
  sightings,
  onSelectAlert,
  onClearUnread
}: NotificationsPageProps) {
  
  const [filterType, setFilterType] = useState<'ALL' | 'CRITICAL' | 'UPDATE' | 'INFO'>('ALL');

  const filteredNotifs = notifications.filter(n => {
    if (filterType === 'ALL') return true;
    return n.type === filterType;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-left space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
            Emergency Communications Channel
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse official critical broadcasts, telemetry updates, and local search agency alerts.
          </p>
        </div>
        <button
          onClick={onClearUnread}
          className="self-start sm:self-auto text-xs font-bold text-primary-custom border border-teal-150 rounded-lg px-3.5 py-1.5 hover:bg-teal-50 transition"
        >
          Check-off Unread Alerts
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Filters, alert stats */}
        <div className="space-y-6 lg:col-span-1">
          {/* Filter Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs text-left space-y-4">
            <h3 className="font-display font-extrabold text-slate-800 text-sm flex items-center space-x-1.5">
              <Filter className="h-4.5 w-4.5 text-primary-custom" />
              <span>Broadcast filter</span>
            </h3>

            <div className="space-y-1 text-xs">
              <button
                onClick={() => setFilterType('ALL')}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg font-semibold transition ${
                  filterType === 'ALL' 
                    ? 'bg-primary-custom/10 text-primary-custom' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="flex items-center space-x-1.5">
                  <Layers className="h-4 w-4" />
                  <span>All Notifications</span>
                </span>
                <span className="bg-slate-200 px-1.5 py-0.5 text-[10px] rounded-sm font-bold text-slate-700">
                  {notifications.length}
                </span>
              </button>

              <button
                onClick={() => setFilterType('CRITICAL')}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg font-semibold transition ${
                  filterType === 'CRITICAL' 
                    ? 'bg-red-50 text-alert-custom font-bold border-l-4 border-l-alert-custom' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="flex items-center space-x-1.5">
                  <ShieldAlert className="h-4 w-4 text-alert-custom animate-pulse" />
                  <span>Critical Bulletins</span>
                </span>
                <span className="bg-red-100 px-1.5 py-0.5 text-[10px] rounded-sm font-bold text-alert-custom">
                  {notifications.filter(n => n.type === 'CRITICAL').length}
                </span>
              </button>

              <button
                onClick={() => setFilterType('UPDATE')}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg font-semibold transition ${
                  filterType === 'UPDATE' 
                    ? 'bg-teal-50 text-primary-custom font-bold' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="flex items-center space-x-1.5">
                  <Clock className="h-4 w-4" />
                  <span>Telemetry Updates</span>
                </span>
                <span className="bg-teal-100 px-1.5 py-0.5 text-[10px] rounded-sm font-bold text-primary-custom">
                  {notifications.filter(n => n.type === 'UPDATE').length}
                </span>
              </button>

              <button
                onClick={() => setFilterType('INFO')}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg font-semibold transition ${
                  filterType === 'INFO' 
                    ? 'bg-slate-100 text-slate-800 font-bold' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="flex items-center space-x-1.5">
                  <Info className="h-4 w-4 text-slate-500" />
                  <span>Informative Updates</span>
                </span>
                <span className="bg-slate-300 px-1.5 py-0.5 text-[10px] rounded-sm font-bold text-slate-800">
                  {notifications.filter(n => n.type === 'INFO').length}
                </span>
              </button>
            </div>
          </div>

          {/* Sighting Intelligence Feed Summary */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <h3 className="font-display font-extrabold text-slate-800 text-sm flex items-center space-x-1.5">
              <Sparkles className="h-4.5 w-4.5 text-secondary-custom" />
              <span>Intelligence Registry</span>
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Volunteer spotters have filed {sightings.length} verified coordinate reports. Sighting metrics undergo rapid investigation review.
            </p>

            <div className="space-y-2 border-t border-slate-105 pt-3">
              {sightings.map(sight => {
                const matchedAlert = alerts.find(a => a.id === sight.alertId);
                return (
                  <div key={sight.id} className="text-[11px] bg-slate-50 rounded-lg p-2.5 border border-slate-100">
                    <p className="font-bold text-slate-800 truncate">
                      Spotted near: {sight.sightingLocation}
                    </p>
                    <p className="text-slate-450 mt-0.5 line-clamp-1">
                      For: {matchedAlert ? matchedAlert.name : 'Unknown alert'}
                    </p>
                    <div className="flex items-center justify-between text-[10px] mt-1 text-slate-400">
                      <span className="font-mono">{new Date(sight.sightingTime).toLocaleDateString()}</span>
                      <span className="font-semibold px-1 rounded-sm bg-orange-100 text-orange-700">
                        {sight.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Chronological Communications Feed */}
        <div className="lg:col-span-2 space-y-4 text-left">
          {filteredNotifs.length > 0 ? (
            filteredNotifs.map(notif => {
              const matchedAlert = alerts.find(a => a.id === notif.alertId);
              
              // Style variables based on notification rank
              let accentColor = 'border-l-primary-custom hover:bg-slate-50/70';
              let badgeColor = 'bg-slate-100 text-slate-600';
              
              if (notif.type === 'CRITICAL') {
                accentColor = 'border-l-alert-custom bg-red-50/10 hover:bg-red-50/20';
                badgeColor = 'bg-red-100 text-alert-custom';
              } else if (notif.type === 'UPDATE') {
                accentColor = 'border-l-teal-600 bg-teal-50/10 hover:bg-teal-50/20';
                badgeColor = 'bg-teal-100 text-teal-800';
              }

              return (
                <div 
                  key={notif.id}
                  className={`p-5 rounded-xl border border-slate-200 border-l-4 ${accentColor} transition flex flex-col space-y-3.5`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                        <span className={`px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-wider ${badgeColor}`}>
                          {notif.type} BULLETIN
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(notif.timestamp).toLocaleTimeString()} • {new Date(notif.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="font-display font-extrabold text-slate-900 text-sm sm:text-base leading-tight pt-1">
                        {notif.title}
                      </h4>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    {notif.message}
                  </p>

                  {matchedAlert && (
                    <div className="bg-white rounded-lg p-3 border border-slate-100 flex items-center justify-between text-xs font-semibold">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded bg-slate-150 overflow-hidden shrink-0">
                          {matchedAlert.image ? (
                            <img src={matchedAlert.image} alt={matchedAlert.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-teal-150 text-[10px] font-bold text-slate-700">
                              {matchedAlert.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-slate-800">{matchedAlert.name} ({matchedAlert.age} Yrs)</p>
                          <p className="text-[10px] text-slate-450 flex items-center space-x-0.5">
                            <MapPin className="h-3 w-3 shrink-0 text-red-500" />
                            <span className="truncate max-w-[190px]">{matchedAlert.lastKnownLocation}</span>
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => onSelectAlert(matchedAlert)}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[11px] transition"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Inspect alert Card</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl text-slate-400 text-xs flex flex-col items-center justify-center">
              <Bell className="h-10 w-10 text-slate-305 animate-bounce mb-3" />
              <p>No communications broadcasted in this classification yet.</p>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
