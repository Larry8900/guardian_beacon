import React from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  ShieldAlert, 
  UserCheck, 
  MapPin, 
  FileText, 
  Eye, 
  HelpCircle, 
  Compass, 
  CheckCircle2, 
  Activity,
  ChevronRight
} from 'lucide-react';
import { User, MissingPersonAlert, SightingReport } from '../types';

interface DashboardProps {
  currentUser: User;
  alerts: MissingPersonAlert[];
  sightings: SightingReport[];
  onTriggerAlert: () => void;
  onGoToProfile: () => void;
  onSelectAlert: (alert: MissingPersonAlert) => void;
  onGoToNotifications: () => void;
}

export default function Dashboard({
  currentUser,
  alerts,
  sightings,
  onTriggerAlert,
  onGoToProfile,
  onSelectAlert,
  onGoToNotifications
}: DashboardProps) {
  const activeAlerts = alerts.filter(a => a.status === 'ACTIVE');
  const resolvedAlerts = alerts.filter(a => a.status === 'RESOLVED');

  // Count sightings reported for active alerts
  const totalActiveSightings = sightings.filter(s => 
    activeAlerts.some(a => a.id === s.alertId)
  ).length;

  return (
    <div className="space-y-8 pb-12 text-left max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      {/* Dynamic Welcome Heading */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Welcome, {currentUser.name}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            GuardianBeacon Dashboard Node • Authorized client access
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-600/10">
            <span className="mr-1 h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            Online & Guarded
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            Node ID: {currentUser.id.substring(0, 10)}...
          </span>
        </div>
      </div>

      {/* Grid: 2-3 Column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: User Verification Card & Call-To-Actions (Spans 1 col on lg) */}
        <div className="space-y-6 lg:col-span-1">
          {/* Pre-Verification Summary Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs relative overflow-hidden">
            {/* Background accent */}
            <div className={`absolute top-0 inset-x-0 h-1.5 ${currentUser.isVerified ? 'bg-primary-custom' : 'bg-amber-500'}`} />
            
            <div className="flex items-center justify-between mb-4 mt-2">
              <h3 className="font-display font-bold text-slate-800 text-sm">Pre-Verification Token</h3>
              {currentUser.isVerified ? (
                <span className="inline-flex items-center space-x-0.5 rounded-md bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-primary-custom uppercase tracking-wider ring-1 ring-teal-600/20">
                  <ShieldCheck className="h-3 w-3 text-primary-custom" />
                  <span>Verified</span>
                </span>
              ) : (
                <span className="inline-flex items-center space-x-0.5 rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800 uppercase tracking-wider ring-1 ring-amber-600/25">
                  <AlertTriangle className="h-3 w-3 text-amber-600" />
                  <span>Action Needed</span>
                </span>
              )}
            </div>

            {/* Verification Items Checklist */}
            <div className="space-y-3.5">
              <p className="text-xs text-slate-500 font-sans leading-relaxed">
                Completing your safety tokens ensures that if you are ever reported missing, friends can trigger a highly detailed rescue dispatch in one click.
              </p>

              <div className="border-t border-slate-100 pt-3 space-y-2 text-xs">
                {/* 1. Profile photo */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Profile Photo Uploaded</span>
                  {currentUser.profilePhoto ? (
                    <span className="font-bold text-teal-600">✓ Active</span>
                  ) : (
                    <span className="text-slate-400">Not Uploaded</span>
                  )}
                </div>

                {/* 2. Physical Descriptors */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Physical Descriptors Filed</span>
                  {currentUser.physicalDescription ? (
                    <span className="font-bold text-teal-600">✓ Active</span>
                  ) : (
                    <span className="text-slate-400">Missing Descriptor</span>
                  )}
                </div>

                {/* 3. Secure Geolocation Access */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">HTML5 Geolocation Pin</span>
                  {currentUser.allowedLocation ? (
                    <span className="font-bold text-teal-600">✓ Connected</span>
                  ) : (
                    <span className="text-slate-400">No Access</span>
                  )}
                </div>

                {/* 4. Gov Valid ID Doc */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Gov ID Matching Verified</span>
                  {currentUser.idVerified ? (
                    <span className="font-bold text-teal-600">✓ Verified ({currentUser.idDocumentName?.substring(0, 10)}...)</span>
                  ) : (
                    <span className="text-slate-400 font-medium">Pending ID Doc</span>
                  )}
                </div>
              </div>

              {!currentUser.isVerified && (
                <button
                  onClick={onGoToProfile}
                  className="w-full inline-flex items-center justify-center space-x-1 rounded-xl bg-teal-50 px-4 py-2.5 text-xs font-bold text-primary-custom hover:bg-teal-100 transition mt-2"
                >
                  <UserCheck className="h-4 w-4" />
                  <span>Configure Safe Verification Tokens</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Trigger CTA Card */}
          <div className="rounded-2xl bg-gradient-to-br from-rose-50 to-red-50/50 border border-red-100 p-5 space-y-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white shadow-md">
              <ShieldAlert className="h-5.5 w-5.5" />
            </div>
            <div>
              <h4 className="font-display font-extrabold text-slate-900 text-base">Trigger Missing Alert</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                File a report immediately. You can trigger an alert for a custom person, or tag another pre-verified GuardianBeacon user to import their safety records.
              </p>
            </div>
            <button
              onClick={onTriggerAlert}
              className="w-full inline-flex items-center justify-center space-x-1.5 rounded-xl bg-red-600 py-3 text-xs font-extrabold text-white shadow-lg shadow-red-600/10 hover:bg-red-700 transition"
            >
              <AlertTriangle className="h-4.5 w-4.5 animate-pulse" />
              <span>Launch Critical Report</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Operations status, reports feed (Spans 2 cols on lg) */}
        <div className="space-y-8 lg:col-span-2 text-left">
          
          {/* Segment: Overview Stats */}
          <div className="grid grid-cols-2 xs:grid-cols-4 gap-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
              <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest text-[9px]">Active Beacons</p>
              <p className="text-2xl font-extrabold text-slate-900 font-display mt-1">{activeAlerts.length}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
              <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest text-[9px]">Recent Sightings</p>
              <p className="text-2xl font-extrabold text-slate-900 font-display mt-1">{totalActiveSightings}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
              <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest text-[9px]">Resolved Units</p>
              <p className="text-2xl font-extrabold text-primary-custom font-display mt-1">{resolvedAlerts.length}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
              <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest text-[9px]">Local Safety Index</p>
              <p className="text-2xl font-extrabold text-emerald-600 font-display mt-1">Secure</p>
            </div>
          </div>

          {/* Active Missing Person Broadcast List */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-extrabold text-slate-800 text-base">
                Community Broadcasts
              </h3>
              <button 
                onClick={onGoToNotifications}
                className="text-xs text-primary-custom hover:underline font-bold flex items-center space-x-0.5"
              >
                <span>Inspect All Log</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="space-y-4">
              {activeAlerts.length > 0 ? (
                activeAlerts.map(alert => (
                  <div 
                    key={alert.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition gap-4"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="h-14 w-14 rounded-lg bg-slate-200 overflow-hidden shrink-0">
                        {alert.image ? (
                          <img 
                            src={alert.image} 
                            alt={alert.name} 
                            className="h-full w-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-teal-100 text-teal-800 text-xs font-bold">
                            {alert.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <h4 className="font-bold text-slate-900 text-sm">{alert.name}</h4>
                          <span className="rounded-full bg-red-100 text-red-700 px-2 py-0.5 text-[9px] font-bold">
                            {alert.age} YRS
                          </span>
                          {alert.isVerifiedUser && (
                            <span className="rounded-md bg-emerald-50 text-emerald-600 px-1.5 py-0.5 text-[9px] font-bold border border-emerald-100">
                              ✓ Verified
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 flex items-center space-x-1 mt-1 font-sans">
                          <MapPin className="h-3.5 w-3.5 text-red-500" />
                          <span>Last Known: {alert.lastKnownLocation}</span>
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Reported: {new Date(alert.timeReported).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 w-full sm:w-auto">
                      <button
                        onClick={() => onSelectAlert(alert)}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                      >
                        <Eye className="h-4 w-4" />
                        <span>Inspect/Report Sighting</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-slate-400 text-xs">
                  <p>All active alert nodes have been resolved. Thank you for scanning.</p>
                </div>
              )}
            </div>
          </div>

          {/* Guidelines Banner (Explains "Accidental Sign-Up vs Smart Tagging") */}
          <div className="rounded-xl border border-teal-100 bg-teal-50/40 p-5 space-y-3">
            <h4 className="font-display font-extrabold text-primary-custom text-sm flex items-center space-x-1.5">
              <Compass className="h-4.5 w-4.5" />
              <span>Safety Operator Directives</span>
            </h4>
            <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
              <p>
                As an active system participant, you have access to two dispatch paradigms:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-500 text-[11px] pl-1">
                <li><strong className="text-slate-700">Self Guarding:</strong> Pre-verify yourself. Carry an emergency card, connect HTML5 Geo to fetch passive telemetry, and register physical marks.</li>
                <li><strong className="text-slate-700">Tagging Companions:</strong> Keep contact logs of friends, seniors, or kids. If they go off-course, trigger alerts referencing their phone or custom data easily.</li>
              </ul>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
