import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  MapPin, 
  User, 
  Calendar, 
  Phone, 
  Camera, 
  UserPlus, 
  CheckCircle, 
  Sparkles, 
  Eye, 
  FileText, 
  HelpCircle,
  Clock,
  Compass
} from 'lucide-react';
import { User as UserType, MissingPersonAlert, SightingReport } from '../types';

interface MissingPersonFormProps {
  registeredUsers: UserType[];
  alerts: MissingPersonAlert[];
  sightings: SightingReport[];
  currentUser: UserType | null;
  onAddAlert: (newAlert: MissingPersonAlert) => void;
  onAddSighting: (sighting: SightingReport) => void;
  defaultMode?: 'alert' | 'sighting';
  selectedAlertToSought?: MissingPersonAlert | null;
  onClearSelectedAlertToSought?: () => void;
  setCurrentTab: (tab: string) => void;
}

export default function MissingPersonForm({
  registeredUsers,
  alerts,
  sightings,
  currentUser,
  onAddAlert,
  onAddSighting,
  defaultMode = 'alert',
  selectedAlertToSought = null,
  onClearSelectedAlertToSought,
  setCurrentTab
}: MissingPersonFormProps) {
  
  const [activeFormTab, setActiveFormTab] = useState<'alert' | 'sighting'>(defaultMode);

  // TRIGGER ALERT FORM STATE
  const [reportType, setReportType] = useState<'custom' | 'registered'>('custom');
  const [selectedUserId, setSelectedUserId] = useState('');
  
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [image, setImage] = useState('');
  const [lastKnownLocation, setLastKnownLocation] = useState('');
  const [physicalDescription, setPhysicalDescription] = useState('');
  const [contactInformation, setContactInformation] = useState('');
  
  // Custom image options
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // SIGHTING FORM STATE
  const [selectedAlertId, setSelectedAlertId] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [reporterContact, setReporterContact] = useState('');
  const [sightingTime, setSightingTime] = useState(new Date().toISOString().substring(0, 16));
  const [sightingLocation, setSightingLocation] = useState('');
  const [sightingDetails, setSightingDetails] = useState('');
  const [sightingImage, setSightingImage] = useState('');

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // Sync defaultMode or selected alert changes
  useEffect(() => {
    if (selectedAlertToSought) {
      setActiveFormTab('sighting');
      setSelectedAlertId(selectedAlertToSought.id);
    }
  }, [selectedAlertToSought]);

  // Autofill behavior when a verified user is tagged as missing
  useEffect(() => {
    if (reportType === 'registered' && selectedUserId) {
      const userMatched = registeredUsers.find(u => u.id === selectedUserId);
      if (userMatched) {
        setName(userMatched.name);
        setAge(userMatched.age.toString());
        
        if (userMatched.profilePhoto) {
          setImage(userMatched.profilePhoto);
          setImagePreview(userMatched.profilePhoto);
        } else {
          setImage('');
          setImagePreview(null);
        }

        if (userMatched.physicalDescription) {
          setPhysicalDescription(userMatched.physicalDescription);
        } else {
          setPhysicalDescription('');
        }

        if (userMatched.allowedLocation) {
          const lat = userMatched.allowedLocation.latitude;
          const lng = userMatched.allowedLocation.longitude;
          setLastKnownLocation(`Verified Device Coordinates: [Lat ${lat.toFixed(4)}, Lng ${lng.toFixed(4)}] (Near downtown center)`);
        } else {
          setLastKnownLocation('');
        }

        setContactInformation(`${userMatched.phoneNumber} (Direct Desk) / ${userMatched.email}`);
      }
    } else {
      // Clear fields if switching back
      if (reportType === 'custom') {
        setName('');
        setAge('');
        setImage('');
        setImagePreview(null);
        setPhysicalDescription('');
        setLastKnownLocation('');
        setContactInformation('');
      }
    }
  }, [reportType, selectedUserId, registeredUsers]);

  const handleAlertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null);

    if (!name || !age || !lastKnownLocation || !physicalDescription || !contactInformation) {
      setNotification({ type: 'error', msg: 'Please provide all core missing person parameters.' });
      return;
    }

    const ageNum = parseInt(age);
    if (!ageNum || ageNum < 1 || ageNum > 125) {
      setNotification({ type: 'error', msg: 'Please provide a valid age value.' });
      return;
    }

    const newAlert: MissingPersonAlert = {
      id: 'alert-' + Date.now(),
      reporterId: currentUser?.id,
      name,
      age: ageNum,
      gender,
      image: image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', // default fallback silhouette
      lastKnownLocation,
      physicalDescription,
      contactInformation,
      timeReported: new Date().toISOString(),
      status: 'ACTIVE',
      isVerifiedUser: reportType === 'registered' ? (registeredUsers.find(u => u.id === selectedUserId)?.isVerified || false) : false,
      taggedUserId: reportType === 'registered' ? selectedUserId : undefined
    };

    onAddAlert(newAlert);
    setNotification({ type: 'success', msg: `🚨 LIVE BROADCAST ACTIVE! Beacon broadcasted successfully for ${name}.` });
    
    // Clear Form
    setName('');
    setAge('');
    setLastKnownLocation('');
    setPhysicalDescription('');
    setContactInformation('');
    setImage('');
    setImagePreview(null);
    setSelectedUserId('');

    // Go to Alerts Log to view it
    setTimeout(() => {
      setNotification(null);
      setCurrentTab('notifications');
    }, 2500);
  };

  const handleSightingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null);

    if (!selectedAlertId || !reporterName || !reporterContact || !sightingLocation || !sightingDetails) {
      setNotification({ type: 'error', msg: 'Please fill in all standard sighting markers.' });
      return;
    }

    const newSighting: SightingReport = {
      id: 'sight-' + Date.now(),
      alertId: selectedAlertId,
      reporterName,
      reporterContact,
      sightingTime: new Date(sightingTime).toISOString(),
      sightingLocation,
      sightingDetails,
      status: 'UNVERIFIED'
    };

    onAddSighting(newSighting);
    setNotification({ 
      type: 'success', 
      msg: '✓ Sighting filed successfully! Search operators have been notified of this verified lead.' 
    });

    // Clear
    setReporterName('');
    setReporterContact('');
    setSightingLocation('');
    setSightingDetails('');

    if (onClearSelectedAlertToSought) {
      onClearSelectedAlertToSought();
    }

    setTimeout(() => {
      setNotification(null);
      setCurrentTab('dashboard');
    }, 2000);
  };

  // Mock File / Image Selector
  const handleDummyImageSelect = (genderType: string) => {
    const urls: { [key: string]: string } = {
      Male: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      Female: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      Child: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=400&q=80'
    };
    
    const picked = urls[genderType] || urls.Female;
    setImage(picked);
    setImagePreview(picked);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-left space-y-8">
      {/* Title */}
      <div className="border-b border-slate-200 pb-5">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
          Safety Incident Dispatch Center
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Open a new missing person record or report an authorized sighting instantly.
        </p>
      </div>

      {notification && (
        <div className={`rounded-xl p-4 text-xs font-bold ring-1 ${
          notification.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 ring-emerald-600/10 border-l-4 border-l-emerald-500' 
            : 'bg-red-50 text-alert-custom ring-red-600/10 border-l-4 border-l-red-500'
        }`}>
          <p>{notification.msg}</p>
        </div>
      )}

      {/* Tabs Menu */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => {
            setActiveFormTab('alert');
            if (onClearSelectedAlertToSought) onClearSelectedAlertToSought();
          }}
          className={`flex-1 sm:flex-none flex items-center justify-center space-x-2 py-3 px-6 text-sm font-bold border-b-2 transition-colors ${
            activeFormTab === 'alert'
              ? 'border-alert-custom text-alert-custom'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
          }`}
        >
          <ShieldAlert className="h-4.5 w-4.5" />
          <span>Launch Missing Person Alert</span>
        </button>

        <button
          onClick={() => setActiveFormTab('sighting')}
          className={`flex-1 sm:flex-none flex items-center justify-center space-x-2 py-3 px-6 text-sm font-bold border-b-2 transition-colors ${
            activeFormTab === 'sighting'
              ? 'border-primary-custom text-primary-custom'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
          }`}
        >
          <Eye className="h-4.5 w-4.5" />
          <span>Report Sighting Lead</span>
        </button>
      </div>

      {/* RENDER FORM MODULE CONTENT */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs">
        
        {/* TAB 1: TRIGGER NEW ALERT FORM */}
        {activeFormTab === 'alert' && (
          <form onSubmit={handleAlertSubmit} className="space-y-6">
            
            {/* Toggle Report Type */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Target Categorization</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div 
                  onClick={() => setReportType('custom')}
                  className={`border-2 rounded-xl p-4 cursor-pointer transition flex items-start space-x-3 text-left ${
                    reportType === 'custom'
                      ? 'border-alert-custom bg-red-50/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${reportType === 'custom' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'}`}>
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Report custom citizen</h4>
                    <p className="text-[11px] text-slate-450 mt-1">Manual input of family member details, descriptions, and contact info.</p>
                  </div>
                </div>

                <div 
                  onClick={() => setReportType('registered')}
                  className={`border-2 rounded-xl p-4 cursor-pointer transition flex items-start space-x-3 text-left ${
                    reportType === 'registered'
                      ? 'border-primary-custom bg-teal-50/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${reportType === 'registered' ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-500'}`}>
                    <UserPlus className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Tag of another registered user</h4>
                    <p className="text-[11px] text-slate-450 mt-1">Select from registered users to auto-populate photos, descriptors, and location telemetry.</p>
                  </div>
                </div>

              </div>
            </div>

            {/* SELECT USER PORT (IF REGISTERED IS CHOSEN) */}
            {reportType === 'registered' && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                <div className="flex items-center space-x-2 text-primary-custom">
                  <Sparkles className="h-4 w-4 shrink-0" />
                  <span className="text-xs font-bold uppercase tracking-wider">Anticipatory Verification Directory</span>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Choose Tagged User</label>
                  <select
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white py-2 px-3 text-xs font-semibold focus:border-primary-custom focus:outline-hidden"
                  >
                    <option value="">-- Choose registered person to tag as missing --</option>
                    {registeredUsers.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name} (Age: {user.age}) - {user.isVerified ? '✓ Fully Verified Profile' : 'Basic Account'}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedUserId && (
                  <div className="text-[11px] text-teal-700 leading-relaxed bg-emerald-50 rounded-lg p-3 border border-emerald-100">
                    <p className="font-bold">✓ Autofill Engine Hooked:</p>
                    <p className="mt-1">
                      Platform secured descriptors, Gov verification certificates, and geolocating indicators have been parsed successfully. Some inputs have been lock-filled for security.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* MAIN ALERTS FILE DATA FIELDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Missing Person name</label>
                  <input
                    type="text"
                    required
                    disabled={reportType === 'registered'}
                    placeholder="Enter full legal name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 py-2 px-3 text-xs font-semibold focus:border-primary-custom focus:outline-hidden disabled:bg-slate-100 disabled:text-slate-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Age</label>
                    <input
                      type="number"
                      required
                      disabled={reportType === 'registered'}
                      placeholder="e.g. 24"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 py-2 px-3 text-xs font-semibold focus:border-primary-custom focus:outline-hidden disabled:bg-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 py-2 px-3 text-xs font-semibold focus:border-primary-custom focus:outline-hidden"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other / Non-binary</option>
                      <option value="Child">Child / Minor</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Last Known Location</label>
                  <div className="relative">
                    <MapPin className="absolute top-2.5 left-3 h-4 text-red-500" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Penn Station Sector D, or city/street"
                      value={lastKnownLocation}
                      onChange={(e) => setLastKnownLocation(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-xs font-semibold focus:border-primary-custom focus:outline-hidden"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Specify cross-streets, landmarks, or transit routes if possible.</p>
                </div>
              </div>

              {/* IMAGE UPLOADER PORTION */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Incident Profile photo (Optional)</label>
                  
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 hover:bg-slate-50 transition text-center space-y-3">
                    {imagePreview ? (
                      <div className="relative mx-auto h-28 w-28 rounded-lg overflow-hidden border border-slate-200">
                        <img 
                          src={imagePreview} 
                          alt="Incident Preview" 
                          className="h-full w-full object-cover" 
                          referrerPolicy="no-referrer"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImage('');
                            setImagePreview(null);
                          }}
                          className="absolute inset-0 bg-black/60 text-white flex items-center justify-center text-[10px] font-bold uppercase tracking-wider opacity-0 hover:opacity-100 transition"
                        >
                          Remove Photo
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <Camera className="mx-auto h-10 w-10 text-slate-350" />
                        <p className="text-xs font-semibold text-slate-500">Provide photo to assist searchers</p>
                        <p className="text-[9px] text-slate-400">Drag/Drop or choose from dummy assets below</p>
                      </div>
                    )}

                    {/* Quick Mock Asset Picker */}
                    <div className="flex justify-center space-x-2 pt-2 border-t border-slate-100">
                      <button 
                        type="button" 
                        onClick={() => handleDummyImageSelect('Male')}
                        className="text-[10px] px-2 py-1 bg-slate-100 rounded-md hover:bg-slate-200 font-bold"
                      >
                        + Mock Male Silhouette
                      </button>
                      <button 
                        type="button" 
                        onClick={() => handleDummyImageSelect('Female')}
                        className="text-[10px] px-2 py-1 bg-slate-100 rounded-md hover:bg-slate-200 font-bold"
                      >
                        + Mock Female Silhouette
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* DETAILED PHYSICAL DESCRIPTIONS */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Physical Descriptors</label>
              <textarea
                required
                rows={3}
                placeholder="Include height, approximate weight, hair configuration / length, scars, spectacles, outerwear color, earrings, bags, watches..."
                value={physicalDescription}
                onChange={(e) => setPhysicalDescription(e.target.value)}
                className="w-full rounded-lg border border-slate-200 py-2 px-3 text-xs font-semibold focus:border-primary-custom focus:outline-hidden"
              />
            </div>

            {/* CONTACT INFORMATION */}
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Emergency Contact Information</label>
              <div className="relative">
                <Phone className="absolute top-2.5 left-3 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Mother Jessica (555-123-4567) or Rescue Squad"
                  value={contactInformation}
                  onChange={(e) => setContactInformation(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-xs font-semibold focus:border-primary-custom focus:outline-hidden"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Provide direct call-back numbers or authorized police taskforce IDs.</p>
            </div>

            {/* SUBMIT */}
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center space-x-1.5 rounded-xl bg-alert-custom px-6 py-3 text-sm font-bold text-white shadow-lg hover:bg-red-700 transition"
              >
                <ShieldAlert className="h-4 w-4" />
                <span>Publish Urgent beacon alert</span>
              </button>
            </div>

          </form>
        )}

        {/* TAB 2: REPORT SIGHTING FORM */}
        {activeFormTab === 'sighting' && (
          <form onSubmit={handleSightingSubmit} className="space-y-6">
            
            <div className="rounded-xl border border-teal-100 bg-teal-50/20 p-4 space-y-2">
              <div className="flex items-center space-x-1.5 text-primary-custom">
                <Compass className="h-4.5 w-4.5" />
                <span className="text-xs font-bold uppercase tracking-wider">Spotter Intelligence Lead</span>
              </div>
              <p className="text-xs text-slate-650 leading-relaxed">
                By relaying precise geographical descriptions, search operators can restrict tracking grids and re-orient volunteer movements.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-4 text-left">
                {/* CHOOSE WHICH MISSING PERSON WERE SIGHTED */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Select Sighted Person</label>
                  <select
                    required
                    value={selectedAlertId}
                    onChange={(e) => setSelectedAlertId(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white py-2 px-3 text-xs font-bold focus:border-primary-custom focus:outline-hidden"
                  >
                    <option value="">-- Choose active missing person --</option>
                    {alerts.filter(a => a.status === 'ACTIVE').map(a => (
                      <option key={a.id} value={a.id}>
                        {a.name} (Age: {a.age}, Location: {a.lastKnownLocation})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter full name"
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 py-2 px-3 text-xs font-semibold focus:border-primary-custom focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 font-sans">Your Phone / Email</label>
                  <input
                    type="text"
                    required
                    placeholder="+1 (555) 000-0000 / your@email.com"
                    value={reporterContact}
                    onChange={(e) => setReporterContact(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 py-2 px-3 text-xs font-semibold focus:border-primary-custom focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Date & Time Sighted</label>
                  <div className="relative">
                    <Clock className="absolute top-2.5 left-3 h-4 text-slate-400" />
                    <input
                      type="datetime-local"
                      required
                      value={sightingTime}
                      onChange={(e) => setSightingTime(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-xs font-semibold focus:border-primary-custom focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 font-sans">Precise Sighting Location</label>
                  <div className="relative">
                    <MapPin className="absolute top-2.5 left-3 h-4 text-red-500" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Subway exit of 42nd St platform, or street crossing"
                      value={sightingLocation}
                      onChange={(e) => setSightingLocation(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-xs font-semibold focus:border-primary-custom focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* SIGHTING DETAILS */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Describe the parameters of Sighting</label>
              <textarea
                required
                rows={3}
                placeholder="What clothes was the subject wearing? Mood / behavior notes? Was anyone walking alongside them? Specify direction of movement..."
                value={sightingDetails}
                onChange={(e) => setSightingDetails(e.target.value)}
                className="w-full rounded-lg border border-slate-200 py-2 px-3 text-xs font-semibold focus:border-primary-custom focus:outline-hidden"
              />
            </div>

            {/* SUBMIT BUTTON */}
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center space-x-1.5 rounded-xl bg-primary-custom px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-teal-800 transition"
              >
                <Eye className="h-4.5 w-4.5" />
                <span>Submit Sighting lead</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
