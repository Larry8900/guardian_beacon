import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Users, 
  MapPin, 
  Search, 
  ArrowRight, 
  Clock, 
  Heart, 
  Smartphone, 
  Check, 
  Eye, 
  UserCheck 
} from 'lucide-react';
import { MissingPersonAlert } from '../types';

interface LandingPageProps {
  alerts: MissingPersonAlert[];
  onTriggerAlert: () => void;
  onGoToAuth: () => void;
  onGoToProfile: () => void;
  onSelectAlert: (alert: MissingPersonAlert) => void;
  onGoToNotifications: () => void;
  currentUser: any;
}

export default function LandingPage({
  alerts,
  onTriggerAlert,
  onGoToAuth,
  onGoToProfile,
  onSelectAlert,
  onGoToNotifications,
  currentUser
}: LandingPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const activeAlerts = alerts.filter(a => a.status === 'ACTIVE');

  // Filter alerts by name or location
  const filteredAlerts = activeAlerts.filter(a =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.lastKnownLocation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-55/60 to-slate-50 pt-16 pb-20 sm:pt-24 lg:pt-32">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-teal-200 to-emerald-400 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
            {/* Left Col - Context Pitch */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 rounded-full bg-teal-100/60 px-3 py-1 text-xs font-semibold text-primary-custom">
                <ShieldAlert className="h-4 w-4 text-primary-custom" />
                <span>Immediate Critical Safety Alert Network</span>
              </div>
              <h1 className="font-display text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-[1.1]">
                Every Second Counts. <br />
                <span className="text-primary-custom">Broadcast Instantly.</span>
              </h1>
              <p className="mx-auto lg:mx-0 max-w-2xl text-base sm:text-lg text-slate-600">
                GuardianBeacon bridges the gap between critical missing events and community action. Register a verified smart profile ahead of time to ensure vital descriptors and location logs can be deployed to rescue networks in seconds.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={onTriggerAlert}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 rounded-xl bg-alert-custom px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-600/20 hover:bg-red-700 transition"
                  id="cta-trigger-alert"
                >
                  <ShieldAlert className="h-5 w-5 animate-pulse" />
                  <span>Trigger Missing Alert Now</span>
                </button>
                {currentUser ? (
                  <button
                    onClick={onGoToProfile}
                    className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 rounded-xl bg-white border border-slate-200 px-6 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 shadow-xs transition"
                  >
                    <UserCheck className="h-5 w-5 text-primary-custom" />
                    <span>Complete Verification Profile</span>
                  </button>
                ) : (
                  <button
                    onClick={onGoToAuth}
                    className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 rounded-xl bg-white border border-slate-200 px-6 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 shadow-xs transition"
                  >
                    <Users className="h-5 w-5 text-primary-custom" />
                    <span>Register / Setup Safe Account</span>
                  </button>
                )}
              </div>

              {/* Verified Autofill Explainer Widget */}
              <div className="mt-6 border-t border-slate-200/80 pt-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-3 text-left">
                  <div className="h-8 w-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Check className="h-4.5 w-4.5 font-bold" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Anticipatory Safety pre-verification</h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-lg">
                      By adding physical tags (hair, birthmarks), device coordinate access, and valid ID verification during wellness, family members can auto-fill this data immediately if you are ever tagged missing, bypassing panic delays.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Col - High Contrast App Map Preview */}
            <div className="lg:col-span-5 mt-12 lg:mt-0">
              <div className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
                <div className="absolute top-3 right-3 text-[10px] font-bold tracking-widest text-slate-300 uppercase">Live Operations</div>
                
                <h3 className="font-display font-bold text-slate-800 flex items-center space-x-1.5 mb-4">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-red-600 animate-ping"></span>
                  <span>Active Broadcast Feeds</span>
                </h3>

                {/* Micro Ticker Search */}
                <div className="relative mb-4">
                  <Search className="absolute top-2.5 left-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by name, tags, state, city..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 py-1.5 pl-9 pr-4 text-xs font-medium focus:border-primary-custom focus:ring-1 focus:ring-primary-custom focus:outline-hidden"
                  />
                </div>

                {/* Display Feed */}
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {filteredAlerts.length > 0 ? (
                    filteredAlerts.map(alert => (
                      <div 
                        key={alert.id}
                        onClick={() => onSelectAlert(alert)}
                        className="group flex space-x-3 rounded-lg border border-slate-100 hover:border-red-100 p-3 bg-slate-50/50 hover:bg-slate-50 text-left transition cursor-pointer"
                      >
                        <div className="relative h-12 w-12 rounded-lg bg-slate-200 overflow-hidden shrink-0">
                          {alert.image ? (
                            <img 
                              src={alert.image} 
                              alt={alert.name} 
                              className="h-full w-full object-cover group-hover:scale-115 transition duration-300"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-teal-100 text-teal-800 text-xs font-bold">
                              {alert.name.charAt(0)}
                            </div>
                          )}
                          <div className="absolute bottom-0 inset-x-0 bg-red-600 text-[8px] text-center font-bold text-white py-0.5">
                            {alert.age} YRS
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-slate-900 group-hover:text-primary-custom truncate">
                              {alert.name}  
                              {alert.isVerifiedUser && <span className="ml-1 text-[10px] text-emerald-600 font-bold">✓ Verified</span>}
                            </h4>
                            <span className="text-[9px] text-slate-400 font-medium">
                              {new Date(alert.timeReported).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 flex items-center space-x-1 mt-1 truncate">
                            <MapPin className="h-3 w-3 shrink-0 text-red-500" />
                            <span>{alert.lastKnownLocation}</span>
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono mt-1 line-clamp-1">
                            {alert.physicalDescription}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-slate-400 text-xs flex flex-col items-center">
                      <p>No active alerts matching your search.</p>
                      <button 
                        onClick={() => setSearchTerm('')} 
                        className="text-primary-custom underline mt-2 font-semibold"
                      >
                        Reset Search
                      </button>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-primary-custom">
                  <span>{filteredAlerts.length} Active Incidents Listed</span>
                  <button onClick={onGoToNotifications} className="hover:underline flex items-center space-x-0.5">
                    <span>Explore Log</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Network Stats Bar */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-r from-teal-800 to-teal-900 text-white p-8 shadow-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <p className="font-display text-3xl sm:text-4xl font-extrabold text-secondary-custom">28 hrs</p>
              <p className="text-xs font-semibold text-teal-100 uppercase tracking-widest">Average Find Time</p>
            </div>
            <div className="space-y-1 border-l border-teal-700/60">
              <p className="font-display text-3xl sm:text-4xl font-extrabold text-white">100%</p>
              <p className="text-xs font-semibold text-teal-100 uppercase tracking-widest">Citizen Privacy Guarded</p>
            </div>
            <div className="space-y-1 border-t md:border-t-0 md:border-l border-teal-700/60 pt-6 md:pt-0">
              <p className="font-display text-3xl sm:text-4xl font-extrabold text-secondary-custom">14.2k</p>
              <p className="text-xs font-semibold text-teal-100 uppercase tracking-widest">Beacon Volunteers</p>
            </div>
            <div className="space-y-1 border-t md:border-t-0 border-l border-teal-700/60 pt-6 md:pt-0">
              <p className="font-display text-3xl sm:text-4xl font-extrabold text-white">418</p>
              <p className="text-xs font-semibold text-teal-100 uppercase tracking-widest">Reunited Families</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Overview Mode - Anticipatory Registration workflow */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Why Pre-Registration Profile Saves Valuable Time
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            In standard scenarios, families waste crucial initial hours collecting description logs, picking high-res pictures, and filing reports. Our "Pre-Verified Safety Token" changes this paradigm completely.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 hover:shadow-md transition text-left space-y-4">
            <div className="h-10 w-10 rounded-lg bg-teal-50 text-primary-custom flex items-center justify-center">
              <Smartphone className="h-5 w-5" />
            </div>
            <h3 className="font-display font-bold text-slate-800 text-base">1. Register Secure Wellness Node</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Create your account with fundamental information (name, age, phone). These are securely stored and encrypted under standard client data privacy metrics.
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 hover:shadow-md transition text-left space-y-4">
            <div className="h-10 w-10 rounded-lg bg-teal-50 text-primary-custom flex items-center justify-center">
              <UserCheck className="h-5 w-5" />
            </div>
            <h3 className="font-display font-bold text-slate-800 text-base">2. Complete Verified Attributes</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Define permanent indicators like scars, spectacles, tattoos, real-time geolocating device status permission, and upload a Gov ID to unlock verified emergency status.
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 hover:shadow-md transition text-left space-y-4 font-bold border-l-4 border-l-alert-custom">
            <div className="h-10 w-10 rounded-lg bg-rose-50 text-alert-custom flex items-center justify-center">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <h3 className="font-display font-bold text-slate-800 text-base">3. Instant Smart Alert Autofill</h3>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              If you or a tagged loved one goes off-grid, anyone authorized can activate the beacon. The system pulls verified metrics automatically and fires alerts, saving 100% of preparation time.
            </p>
          </div>
        </div>
      </section>

      {/* Community Sightings Section */}
      <section className="bg-slate-100 rounded-2xl mx-auto max-w-7xl px-6 py-12 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-8 text-left">
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center space-x-1 rounded-full bg-white px-3 py-1 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
            <Eye className="h-3.5 w-3.5 text-primary-custom" />
            <span>Active Spotters Network</span>
          </div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Sighted a missing person? Help families reunite.
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Every citizen with a smartphone is a beacon spotter. If you witness someone listed in our broadcasts, click "Report Sighting" on their alert card. Enter your location, description parameters, and snap a prompt image if possible. Your intelligence is piped to volunteers instantly.
          </p>
        </div>
        <div className="shrink-0">
          <button
            onClick={() => onGoToNotifications()}
            className="inline-flex items-center space-x-2 rounded-xl bg-primary-custom px-6 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-teal-800 transition"
          >
            <span>Inspect Alerts Feed to Report</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* Emergency Footer Support Message */}
      <footer className="pt-8 border-t border-slate-200 text-center text-slate-400 text-xs">
        <p>© 2026 GuardianBeacon Rescue Coordination Inc.</p>
        <p className="mt-1 text-[11px] text-slate-400">
          If you are in immediate personal danger or suspect a severe crime in action, please call your native national emergency number (e.g. 911 / 999 / 112) immediately.
        </p>
      </footer>
    </div>
  );
}
