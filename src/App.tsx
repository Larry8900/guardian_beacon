import React, { useState, useEffect } from 'react';
import { 
  MOCK_ALERTS, 
  MOCK_REGISTERED_USERS, 
  MOCK_NOTIFICATIONS, 
  MOCK_SIGHTINGS 
} from './mockData';
import { User, MissingPersonAlert, SightingReport, AlertNotification } from './types';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import MissingPersonForm from './components/MissingPersonForm';
import ProfilePage from './components/ProfilePage';
import NotificationsPage from './components/NotificationsPage';
import { 
  X, 
  MapPin, 
  Phone, 
  User as UserIcon, 
  ShieldCheck, 
  Sparkles, 
  Eye, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  RefreshCw
} from 'lucide-react';

export default function App() {
  
  // Shared state initialized with local storage persistence or mock fallbacks
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('guardianbeacon_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [registeredUsers, setRegisteredUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('guardianbeacon_registered_users');
    return saved ? JSON.parse(saved) : MOCK_REGISTERED_USERS;
  });

  const [alerts, setAlerts] = useState<MissingPersonAlert[]>(() => {
    const saved = localStorage.getItem('guardianbeacon_alerts');
    return saved ? JSON.parse(saved) : MOCK_ALERTS;
  });

  const [sightings, setSightings] = useState<SightingReport[]>(() => {
    const saved = localStorage.getItem('guardianbeacon_sightings');
    return saved ? JSON.parse(saved) : MOCK_SIGHTINGS;
  });

  const [notifications, setNotifications] = useState<AlertNotification[]>(() => {
    const saved = localStorage.getItem('guardianbeacon_notifications');
    return saved ? JSON.parse(saved) : MOCK_NOTIFICATIONS;
  });

  // Active navigation tab state
  const [currentTab, setCurrentTab] = useState<string>('landing');
  
  // Inspection panel state for individual alert card clicks
  const [inspectingAlert, setInspectingAlert] = useState<MissingPersonAlert | null>(null);
  
  // Selected alert pointer when switching from critical dashboard directly to filing sighting
  const [selectedAlertToSought, setSelectedAlertToSought] = useState<MissingPersonAlert | null>(null);

  // AI intelligence states
  const [aiTacticalAdvice, setAiTacticalAdvice] = useState<string>('');
  const [isGeneratingAiAdvice, setIsGeneratingAiAdvice] = useState<boolean>(false);

  // Sighting AI analyzer states
  const [analyzedSightingId, setAnalyzedSightingId] = useState<string | null>(null);
  const [sightingAnalysisResult, setSightingAnalysisResult] = useState<string>('');
  const [isAnalyzingSighting, setIsAnalyzingSighting] = useState<boolean>(false);

  // Reset advisory on inspection switch
  useEffect(() => {
    setAiTacticalAdvice('');
    setAnalyzedSightingId(null);
    setSightingAnalysisResult('');
  }, [inspectingAlert]);

  // Load database from full-stack Express dynamic store on mount
  useEffect(() => {
    fetch('/api/users')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.length > 0) setRegisteredUsers(data);
      })
      .catch(err => console.warn("Fallback to client users store:", err));

    fetch('/api/alerts')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.length > 0) setAlerts(data);
      })
      .catch(err => console.warn("Fallback to client alerts store:", err));

    fetch('/api/sightings')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.length > 0) setSightings(data);
      })
      .catch(err => console.warn("Fallback to client sightings store:", err));

    fetch('/api/notifications')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.length > 0) setNotifications(data);
      })
      .catch(err => console.warn("Fallback to client notifications store:", err));
  }, []);

  // Synchronize state with Local Storage for authentic persistent backup
  useEffect(() => {
    localStorage.setItem('guardianbeacon_current_user', currentUser ? JSON.stringify(currentUser) : '');
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('guardianbeacon_registered_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    localStorage.setItem('guardianbeacon_alerts', JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem('guardianbeacon_sightings', JSON.stringify(sightings));
  }, [sightings]);

  useEffect(() => {
    localStorage.setItem('guardianbeacon_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Handle new alert additions
  const handleAddAlert = (newAlert: MissingPersonAlert) => {
    fetch('/api/alerts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAlert)
    })
    .then(res => res.ok ? res.json() : Promise.reject(res))
    .then(savedAlert => {
      setAlerts(prev => [savedAlert, ...prev]);
      // Sync notifications
      fetch('/api/notifications')
        .then(res => res.json())
        .then(data => setNotifications(data));
    })
    .catch(err => {
      console.error("Backend alert trigger error, saving locally:", err);
      setAlerts(prev => [newAlert, ...prev]);
    });
  };

  // Handle sight notifications
  const handleAddSighting = (newSighting: SightingReport) => {
    fetch('/api/sightings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSighting)
    })
    .then(res => res.ok ? res.json() : Promise.reject(res))
    .then(savedSighting => {
      setSightings(prev => [savedSighting, ...prev]);
      // Refetch alerts and notifications to get matching status counts
      fetch('/api/alerts')
        .then(res => res.json())
        .then(data => setAlerts(data));
      fetch('/api/notifications')
        .then(res => res.json())
        .then(data => setNotifications(data));
    })
    .catch(err => {
      console.error("Backend sighting list error, saving locally:", err);
      setSightings(prev => [newSighting, ...prev]);
    });
  };

  // Run Gemini analysis through express full-stack endpoint
  const handleGenerateAiAdvice = () => {
    if (!inspectingAlert) return;
    setIsGeneratingAiAdvice(true);
    setAiTacticalAdvice('');
    
    fetch('/api/ai/optimize-search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: inspectingAlert.name,
        age: inspectingAlert.age,
        physicalDescription: inspectingAlert.physicalDescription,
        lastKnownLocation: inspectingAlert.lastKnownLocation
      })
    })
    .then(res => res.ok ? res.json() : Promise.reject(res))
    .then(data => {
      setAiTacticalAdvice(data.optimization || 'Advisory details returned null.');
    })
    .catch(err => {
      console.error("AI intelligence sensor unreachable:", err);
      setAiTacticalAdvice('### Offline Advisory Mode\nCould not contact server-side Gemini intelligence models. Establish physical safety coordination grids immediately.');
    })
    .finally(() => {
      setIsGeneratingAiAdvice(false);
    });
  };

  // Run Gemini sighting analysis through express full-stack endpoint
  const handleAnalyzeSighting = (sightingId: string, details: string, lastLoc: string, name: string) => {
    setAnalyzedSightingId(sightingId);
    setSightingAnalysisResult("");
    setIsAnalyzingSighting(true);

    fetch("/api/ai/analyze-sighting", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sightingDetails: details,
        lastKnownLocation: lastLoc,
        subjectName: name
      })
    })
    .then(res => res.ok ? res.json() : Promise.reject(res))
    .then(data => {
      setSightingAnalysisResult(data.advice || "No advice returned for this sighting log.");
    })
    .catch(err => {
      console.error("Failed to analyze sighting:", err);
      setSightingAnalysisResult("Could not contact Gemini Analysis pipeline. Verify search integrity manually.");
    })
    .finally(() => {
      setIsAnalyzingSighting(false);
    });
  };

  // Case resolution endpoint trigger
  const handleResolveAlert = (alertId: string) => {
    fetch(`/api/alerts/${alertId}/resolve`, {
      method: "POST"
    })
    .then(res => res.ok ? res.json() : Promise.reject(res))
    .then(() => {
      setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: "RESOLVED" } : a));
      setInspectingAlert(null);
      // Sync from database
      fetch("/api/alerts")
        .then(res => res.json())
        .then(data => setAlerts(data));
      fetch("/api/notifications")
        .then(res => res.json())
        .then(data => setNotifications(data));
    })
    .catch(err => {
      console.error("Backend validation resolution state error:", err);
      // fallback
      setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: "RESOLVED" } : a));
      setInspectingAlert(null);
    });
  };

  // Sign out
  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentTab('landing');
  };

  // Sign in or registration complete mapping
  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    if (user.isVerified) {
      setCurrentTab('dashboard');
    } else {
      setCurrentTab('profile');
    }
  };

  const handleUpdateCurrentUser = (updatedUser: User) => {
    fetch('/api/auth/update-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedUser)
    })
    .then(res => res.ok ? res.json() : Promise.reject(res))
    .then(savedProfile => {
      setCurrentUser(savedProfile);
      setRegisteredUsers(prev => prev.map(u => u.id === savedProfile.id ? savedProfile : u));
    })
    .catch(err => {
      console.error("Profile sync error, saving locally:", err);
      setCurrentUser(updatedUser);
      setRegisteredUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    });
  };

  const handleRegisterUser = (newUser: User) => {
    fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    })
    .then(res => res.ok ? res.json() : Promise.reject(res))
    .then(savedUser => {
      setRegisteredUsers(prev => [savedUser, ...prev]);
    })
    .catch(err => {
      console.error("Member registration failed, updating locally:", err);
      setRegisteredUsers(prev => [newUser, ...prev]);
    });
  };

  // Quick helper to fetch unread bulletins
  const unreadCount = notifications.length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      {/* Sleek Top Navigation Banner */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          // Auto close modal if changing context
          setInspectingAlert(null);
        }}
        currentUser={currentUser}
        onLogout={handleLogout}
        activeAlertsCount={alerts.filter(a => a.status === 'ACTIVE').length}
        unreadNotificationsCount={unreadCount}
      />

      {/* Main Viewport Grid Wrapper */}
      <main className="flex-1 w-full flex flex-col">
        {currentTab === 'landing' && (
          <div className="animate-fade-in">
            <LandingPage
              alerts={alerts}
              onTriggerAlert={() => {
                // If logged in, go straight to report form, else register first
                setCurrentTab(currentUser ? 'report' : 'auth');
              }}
              onGoToAuth={() => setCurrentTab('auth')}
              onGoToProfile={() => setCurrentTab('profile')}
              onSelectAlert={(alert) => setInspectingAlert(alert)}
              onGoToNotifications={() => setCurrentTab('notifications')}
              currentUser={currentUser}
            />
          </div>
        )}

        {currentTab === 'auth' && (
          <div className="animate-fade-in p-2 sm:p-4">
            <AuthPage
              onAuthSuccess={handleAuthSuccess}
              registeredUsers={registeredUsers}
              onRegisterUser={handleRegisterUser}
            />
          </div>
        )}

        {currentUser && currentTab === 'dashboard' && (
          <div className="animate-fade-in">
            <Dashboard
              currentUser={currentUser}
              alerts={alerts}
              sightings={sightings}
              onTriggerAlert={() => setCurrentTab('report')}
              onGoToProfile={() => setCurrentTab('profile')}
              onSelectAlert={(alert) => setInspectingAlert(alert)}
              onGoToNotifications={() => setCurrentTab('notifications')}
            />
          </div>
        )}

        {currentTab === 'report' && (
          <div className="animate-fade-in">
            <MissingPersonForm
              registeredUsers={registeredUsers}
              alerts={alerts}
              sightings={sightings}
              currentUser={currentUser}
              onAddAlert={handleAddAlert}
              onAddSighting={handleAddSighting}
              defaultMode={selectedAlertToSought ? 'sighting' : 'alert'}
              selectedAlertToSought={selectedAlertToSought}
              onClearSelectedAlertToSought={() => setSelectedAlertToSought(null)}
              setCurrentTab={setCurrentTab}
            />
          </div>
        )}

        {currentUser && currentTab === 'profile' && (
          <div className="animate-fade-in">
            <ProfilePage
              currentUser={currentUser}
              onUpdateCurrentUser={handleUpdateCurrentUser}
            />
          </div>
        )}

        {currentTab === 'notifications' && (
          <div className="animate-fade-in">
            <NotificationsPage
              notifications={notifications}
              alerts={alerts}
              sightings={sightings}
              onSelectAlert={(alert) => setInspectingAlert(alert)}
              onClearUnread={() => {
                // Wipe mock alerts ticker or mark off triggers
                setNotifications([]);
              }}
            />
          </div>
        )}
      </main>

      {/* COMPREHENSIVE FLOATING INSPECTOR DRAWER/MODAL FOR ACTIVE ALERTS */}
      {inspectingAlert && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white border border-slate-200 p-6 shadow-2xl space-y-6 text-left max-h-[90vh] overflow-y-auto animate-fade-in">
            
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <span className="inline-flex items-center space-x-1 bg-red-50 text-alert-custom px-2 text-[10px] font-bold rounded-sm uppercase tracking-wider">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-ping"></span>
                  <span>Active Broadcast Status</span>
                </span>
                <h3 className="font-display font-black text-slate-900 text-xl sm:text-2xl mt-1.5">
                  {inspectingAlert.name}
                </h3>
              </div>
              <button 
                onClick={() => setInspectingAlert(null)}
                className="h-8 w-8 rounded-full border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-500 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Profile split */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              
              {/* Left pic */}
              <div className="sm:col-span-1 space-y-3">
                <div className="aspect-square rounded-xl bg-slate-100 overflow-hidden border border-slate-200 relative">
                  {inspectingAlert.image ? (
                    <img 
                      src={inspectingAlert.image} 
                      alt={inspectingAlert.name} 
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-400 font-display font-extrabold text-3xl bg-slate-50">
                      {inspectingAlert.name.charAt(0)}
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 bg-red-650 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {inspectingAlert.age} Years Old
                  </div>
                </div>

                <div className="text-center text-xs space-y-1 bg-slate-50 border border-slate-100 rounded-lg p-2.5">
                  <span className="text-slate-400 font-medium">Gender Classification:</span>
                  <p className="font-bold text-slate-800">{inspectingAlert.gender}</p>
                </div>
              </div>

              {/* Right descriptors */}
              <div className="sm:col-span-2 space-y-4">
                
                {inspectingAlert.isVerifiedUser && (
                  <div className="inline-flex items-center space-x-1.5 bg-emerald-50 border border-emerald-100 rounded-md py-1 px-2.5 text-xs text-emerald-800">
                    <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold">✓ Anticipative Safety Verified Token Profile loaded</span>
                  </div>
                )}

                <div className="space-y-1 text-xs">
                  <span className="text-slate-450 font-bold uppercase tracking-wider text-[10px]">Last Known Location Geographic coordinates</span>
                  <p className="text-slate-800 font-bold flex items-start space-x-1 pt-0.5">
                    <MapPin className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                    <span>{inspectingAlert.lastKnownLocation}</span>
                  </p>
                </div>

                <div className="space-y-1 text-xs">
                  <span className="text-slate-450 font-bold uppercase tracking-wider text-[10px]">Physical Description indicators</span>
                  <p className="text-slate-650 bg-slate-50 rounded-lg p-3 border border-slate-100 font-medium leading-relaxed">
                    {inspectingAlert.physicalDescription}
                  </p>
                </div>

                <div className="space-y-1 text-xs">
                  <span className="text-slate-450 font-bold uppercase tracking-wider text-[10px]">Emergency contact channels</span>
                  <p className="text-slate-800 font-semibold flex items-center space-x-1">
                    <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>{inspectingAlert.contactInformation}</span>
                  </p>
                </div>

              </div>

            </div>

            {/* Gemini AI Dispatch Tactics Assistant */}
            <div className="border-t border-slate-100 pt-5 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <h4 className="font-display font-extrabold text-slate-800 flex items-center space-x-1.5">
                  <Sparkles className="h-4.5 w-4.5 text-teal-600 shrink-0" />
                  <span>Gemini Search Intelligence Optimizer</span>
                </h4>
                {!aiTacticalAdvice && !isGeneratingAiAdvice && (
                  <button
                    type="button"
                    onClick={handleGenerateAiAdvice}
                    className="text-[10px] font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg border border-teal-200 transition"
                  >
                    Generate Tactical Plan
                  </button>
                )}
              </div>

              {isGeneratingAiAdvice && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center space-y-2 animate-pulse">
                  <RefreshCw className="h-5 w-5 animate-spin mx-auto text-teal-600" />
                  <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                    Assembling geo-grid parameters & matching descriptor heuristics...
                  </p>
                </div>
              )}

              {aiTacticalAdvice && (
                <div className="bg-gradient-to-br from-teal-50/40 to-white border border-teal-100 rounded-xl p-4.5 space-y-3 text-left">
                  <div className="flex items-center justify-between border-b border-teal-50 pb-2">
                    <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider">AI Strategy Dispatch</span>
                    <button
                      type="button"
                      disabled={isGeneratingAiAdvice}
                      onClick={handleGenerateAiAdvice}
                      className="text-[9px] font-bold text-slate-400 hover:text-slate-600 flex items-center space-x-1"
                    >
                      <RefreshCw className="h-3 w-3" />
                      <span>Refresh Plan</span>
                    </button>
                  </div>
                  <div className="prose prose-sm max-h-56 overflow-y-auto pr-1 text-slate-700 leading-relaxed text-[11.5px] whitespace-pre-wrap font-sans">
                    {aiTacticalAdvice}
                  </div>
                  <p className="text-[9px] text-slate-400 italic">
                    ⚠ Disclaimer: Tactical plans are synthesized from descriptive landmarks to optimize localized volunteer routes. Maintain immediate alignment with civic alert procedures.
                  </p>
                </div>
              )}
            </div>

            {/* Sighting reports log specific to this individual active alert */}
            <div className="border-t border-slate-100 pt-5 space-y-3 text-xs">
              <h4 className="font-display font-extrabold text-slate-800 flex items-center space-x-1">
                <Clock className="h-4 w-4 text-primary-custom" />
                <span>Localized Spotter reports logged ({sightings.filter(s => s.alertId === inspectingAlert.id).length})</span>
              </h4>

              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {sightings.filter(s => s.alertId === inspectingAlert.id).length > 0 ? (
                  sightings.filter(s => s.alertId === inspectingAlert.id).map(s => (
                    <div key={s.id} className="bg-slate-50/70 p-3.5 rounded-lg border border-slate-150 flex flex-col space-y-2 text-[11.5px] text-slate-800 transition">
                      <div className="flex items-center justify-between text-slate-500">
                        <span className="font-bold text-slate-700">Location: {s.sightingLocation}</span>
                        <span className="text-[10px]">{new Date(s.sightingTime).toLocaleString()}</span>
                      </div>
                      <p className="text-slate-600 italic">"{s.sightingDetails}"</p>
                      <div className="text-[10px] text-slate-400 font-medium pt-1 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                        <span>Reporter: {s.reporterName} • Status: <span className="text-orange-600 font-bold uppercase">{s.status}</span></span>
                        
                        {analyzedSightingId === s.id ? (
                          <span className="text-[9px] font-bold text-teal-700 uppercase">Analysis Loaded</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleAnalyzeSighting(s.id, s.sightingDetails, inspectingAlert.lastKnownLocation, inspectingAlert.name)}
                            className="text-[9px] font-bold text-teal-800 hover:text-teal-900 bg-teal-50 px-2 py-0.5 rounded border border-teal-150 hover:bg-teal-100 transition inline-flex items-center space-x-1"
                          >
                            <Sparkles className="h-2.5 w-2.5" />
                            <span>Analyze Lead</span>
                          </button>
                        )}
                      </div>

                      {/* Analysis Outcome Panel inside the card */}
                      {analyzedSightingId === s.id && (
                        <div className="mt-2 bg-white rounded-md p-2.5 border border-teal-105 text-[10.5px] leading-relaxed text-slate-700 font-sans shadow-xs space-y-1.5 animate-fade-in justify-start text-left">
                          <p className="font-bold text-teal-850 flex items-center space-x-1">
                            <Sparkles className="h-3 w-3 shrink-0 text-teal-700" />
                            <span>Gemini Sighting Assessment:</span>
                          </p>
                          {isAnalyzingSighting ? (
                            <p className="italic text-slate-400 animate-pulse">Running advanced text matching AI, please wait...</p>
                          ) : (
                            <div className="whitespace-pre-wrap text-slate-600 mt-1">{sightingAnalysisResult}</div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 italic">No community sightings logged for this broadcast. Stay alert.</p>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="border-t border-slate-100 pt-5 flex items-center justify-between gap-3 flex-wrap">
              <p className="text-[10px] text-slate-400 font-mono">
                System Broadcast ID: {inspectingAlert.id}
              </p>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                {inspectingAlert.status === 'ACTIVE' && (
                  <button
                    type="button"
                    onClick={() => handleResolveAlert(inspectingAlert.id)}
                    className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-bold text-alert-custom hover:bg-rose-100 transition"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Resolve Case (Mark Found)</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setSelectedAlertToSought(inspectingAlert);
                    setInspectingAlert(null);
                    setCurrentTab('report');
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 rounded-xl bg-primary-custom px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-teal-800 transition"
                >
                  <Eye className="h-4 w-4" />
                  <span>Report Sighting of this Person</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
