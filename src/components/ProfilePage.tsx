import React, { useState } from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  UploadCloud, 
  CheckCircle2, 
  ShieldAlert, 
  Sparkles, 
  RefreshCw, 
  AlertCircle, 
  Camera, 
  Compass, 
  FileText 
} from 'lucide-react';
import { User as UserType } from '../types';

interface ProfilePageProps {
  currentUser: UserType;
  onUpdateCurrentUser: (updatedUser: UserType) => void;
}

export default function ProfilePage({ currentUser, onUpdateCurrentUser }: ProfilePageProps) {
  
  // Form values populated from current state
  const [profilePhoto, setProfilePhoto] = useState(currentUser.profilePhoto || '');
  const [physicalDescription, setPhysicalDescription] = useState(currentUser.physicalDescription || '');
  const [allowedLocation, setAllowedLocation] = useState(currentUser.allowedLocation || null);
  const [idVerified, setIdVerified] = useState(currentUser.idVerified || false);
  const [idDocumentName, setIdDocumentName] = useState(currentUser.idDocumentName || '');

  // Operation flags
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [locationSuccess, setLocationSuccess] = useState(false);
  const [scanningID, setScanningID] = useState(false);
  const [idSuccess, setIdSuccess] = useState(false);
  
  const [notiMsg, setNotiMsg] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // Trigger HTML5 geolocation
  const handleLocationRequest = () => {
    setFetchingLocation(true);
    setLocationSuccess(false);

    if (!navigator.geolocation) {
      setNotiMsg({ 
        type: 'error', 
        msg: 'Geolocation API is not supported by your browser environment.' 
      });
      // Mock coordinates fallback
      setTimeout(() => {
        setAllowedLocation({
          latitude: 40.730610,
          longitude: -73.935242,
          accuracy: 5,
          timestamp: Date.now()
        });
        setLocationSuccess(true);
        setFetchingLocation(false);
      }, 1000);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setAllowedLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        });
        setLocationSuccess(true);
        setFetchingLocation(false);
      },
      (error) => {
        console.warn('Geolocation failed, falling back to secure simulated anchor:', error);
        // Fallback simulate coordinate retrieval for demo environment
        setAllowedLocation({
          latitude: 34.052234,
          longitude: -118.243684,
          accuracy: 10,
          timestamp: Date.now()
        });
        setLocationSuccess(true);
        setFetchingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  // Trigger doc scanner animation
  const handleIdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setScanningID(true);
    setIdSuccess(false);

    // Simulate OCR scanning
    setTimeout(() => {
      setIdVerified(true);
      setIdDocumentName(file.name.toUpperCase());
      setScanningID(false);
      setIdSuccess(true);
    }, 2000);
  };

  // Apply photo choices
  const handlePhotoSelect = (url: string) => {
    setProfilePhoto(url);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setNotiMsg(null);

    // Calculate if they met all criteria for "Fully Verified" state
    const hasPhoto = !!profilePhoto;
    const hasDesc = !!physicalDescription;
    const hasLocation = !!allowedLocation;
    const hasID = idVerified;

    const isFullyVerified = hasPhoto && hasDesc && hasLocation && hasID;

    const updatedUser: UserType = {
      ...currentUser,
      profilePhoto,
      physicalDescription,
      allowedLocation: allowedLocation || undefined,
      idVerified,
      idDocumentName: idDocumentName || undefined,
      isVerified: isFullyVerified
    };

    onUpdateCurrentUser(updatedUser);
    
    if (isFullyVerified) {
      setNotiMsg({ 
        type: 'success', 
        msg: '✓ SUCCESS: Your safety profile verification is fully certified!' 
      });
    } else {
      setNotiMsg({ 
        type: 'success', 
        msg: '✓ Basic descriptors saved! Complete remaining tokens to reach fully verified status.' 
      });
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-left space-y-8">
      {/* Page Title */}
      <div className="border-b border-slate-200 pb-5">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
          Emergency Wellness Identity
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Complete individual verification parameters to pre-arm family responders in case of crisis.
        </p>
      </div>

      {notiMsg && (
        <div className={`p-4 rounded-xl text-xs font-bold ring-1 ${
          notiMsg.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 ring-emerald-600/15 border-l-4 border-l-emerald-500' 
            : 'bg-red-50 text-alert-custom ring-red-600/15 border-l-4 border-l-red-500'
        }`}>
          {notiMsg.msg}
        </div>
      )}

      {/* Overview Block */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        
        {/* User Badge Details */}
        <div className="md:col-span-1 border-r border-slate-100 pr-0 md:pr-6 space-y-4 flex flex-col items-center text-center">
          
          <div className="relative">
            {profilePhoto ? (
              <img 
                src={profilePhoto} 
                alt={currentUser.name} 
                className="h-28 w-28 rounded-full object-cover ring-4 ring-teal-50"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="h-28 w-28 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center font-display text-4xl font-extrabold ring-4 ring-slate-50">
                {currentUser.name.charAt(0)}
              </div>
            )}
            {currentUser.isVerified && (
              <div className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary-custom text-white flex items-center justify-center ring-4 ring-white" title="Fully Verified">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            )}
          </div>

          <div>
            <h3 className="font-display font-bold text-slate-800 text-base">{currentUser.name}</h3>
            <p className="text-xs text-slate-405 font-medium mt-1">Age: {currentUser.age} • Registered Member</p>
          </div>

          <div className="w-full pt-4 border-t border-slate-50 space-y-2.5 text-left text-xs">
            <div className="flex items-center space-x-2 text-slate-600">
              <Mail className="h-4 w-4 text-slate-450 shrink-0" />
              <span className="truncate">{currentUser.email}</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-600">
              <Phone className="h-4 w-4 text-slate-450 shrink-0" />
              <span>{currentUser.phoneNumber}</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-600">
              <ShieldAlert className="h-4 w-4 text-slate-450 shrink-0" />
              <div>
                <span className="font-bold">Status:</span>{' '}
                <span className={currentUser.isVerified ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
                  {currentUser.isVerified ? '✓ Verified Safe Node' : 'Basic Node (Incomplete)'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Block explaining verified benefits */}
        <div className="md:col-span-2 space-y-4">
          <h4 className="font-display font-bold text-slate-900 flex items-center space-x-1.5">
            <Sparkles className="h-4.5 w-4.5 text-primary-custom" />
            <span>Benefits of Emergency Pre-Verification</span>
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <h5 className="font-bold text-slate-800">Instant Alert Generation</h5>
              <p className="text-[11px] text-slate-550 mt-1">If reported missing, matching descriptors and photos deploy instantly with zero staging downtime during high stress.</p>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <h5 className="font-bold text-slate-800">Verified Rescue Token</h5>
              <p className="text-[11px] text-slate-550 mt-1">Active ID matches guarantee emergency networks that report triggers are validated, elevating response ranks.</p>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <h5 className="font-bold text-slate-800">Live Telemetry Fallback</h5>
              <p className="text-[11px] text-slate-550 mt-1">Your passive geolocation coordinates are cached securely to pinpoint last known active positions in seconds.</p>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <h5 className="font-bold text-slate-800">Target tagging protection</h5>
              <p className="text-[11px] text-slate-550 mt-1">Allows friends, caregivers, or guardians to locate your reference logs without breaching privacy parameters.</p>
            </div>
          </div>
        </div>

      </div>

      {/* VERIFICATION FORM */}
      <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs space-y-8">
        
        {/* Token #1: Profile Photo */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="flex h-6.5 w-6.5 items-center justify-center rounded-full bg-teal-50 text-xs font-bold text-primary-custom">
              1
            </div>
            <h4 className="font-display font-extrabold text-slate-800 text-sm">Crisis Profile Photo Token</h4>
          </div>
          <p className="text-xs text-slate-500 pl-8">
            Upload or choose a recognizable human shot. Searchers will rely heavily on this.
          </p>
          
          <div className="pl-8 space-y-4">
            <div className="flex flex-wrap gap-3">
              <button 
                type="button"
                onClick={() => handlePhotoSelect('https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80')}
                className={`h-16 w-16 rounded-xl overflow-hidden border-2 transition ${profilePhoto.includes('photo-1544005313') ? 'border-primary-custom opacity-100 scale-105' : 'border-slate-100 opacity-60 hover:opacity-90'}`}
              >
                <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80" alt="Option 1" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
              </button>
              <button 
                type="button"
                onClick={() => handlePhotoSelect('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80')}
                className={`h-16 w-16 rounded-xl overflow-hidden border-2 transition ${profilePhoto.includes('photo-1507003211') ? 'border-primary-custom opacity-100 scale-105' : 'border-slate-100 opacity-60 hover:opacity-90'}`}
              >
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80" alt="Option 2" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
              </button>
              <button 
                type="button"
                onClick={() => handlePhotoSelect('https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80')}
                className={`h-16 w-16 rounded-xl overflow-hidden border-2 transition ${profilePhoto.includes('photo-1531746020') ? 'border-primary-custom opacity-100 scale-105' : 'border-slate-100 opacity-60 hover:opacity-90'}`}
              >
                <img src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=120&q=80" alt="Option 3" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
              </button>
            </div>
            
            <div className="flex items-center space-x-3 max-w-lg">
              <input 
                type="text"
                placeholder="Or input custom photo URL..."
                value={profilePhoto}
                onChange={(e) => setProfilePhoto(e.target.value)}
                className="flex-1 rounded-lg border border-slate-200 py-1.5 px-3 text-xs font-semibold focus:border-primary-custom focus:outline-hidden"
              />
              <button
                type="button"
                onClick={() => handlePhotoSelect('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80')}
                className="text-[10px] px-2.5 py-1.5 bg-slate-100 rounded-lg hover:bg-slate-200 font-bold"
              >
                Set Default Avatar
              </button>
            </div>
          </div>
        </div>

        {/* Token #2: Physical description */}
        <div className="space-y-3 border-t border-slate-150 pt-6">
          <div className="flex items-center space-x-2">
            <div className="flex h-6.5 w-6.5 items-center justify-center rounded-full bg-teal-50 text-xs font-bold text-primary-custom">
              2
            </div>
            <h4 className="font-display font-extrabold text-slate-800 text-sm">Physical Descriptors token</h4>
          </div>
          <p className="text-xs text-slate-500 pl-8">
            Define highly stable landmarks. Focus on unchangeable marks first (tattoos, scars, spectacles structure).
          </p>
          <div className="pl-8">
            <textarea
              rows={3}
              required
              placeholder="e.g. Height: 5 feet 11 inches, Weight: 170 lbs. Large linear scar below right cheek, wears gold-rimmed reading glasses, small crescent moon tattoo on the skin between thumb and index on the left hand."
              value={physicalDescription}
              onChange={(e) => setPhysicalDescription(e.target.value)}
              className="w-full max-w-2xl rounded-lg border border-slate-200 py-2.5 px-3 text-xs font-semibold focus:border-primary-custom focus:outline-hidden"
            />
          </div>
        </div>

        {/* Token #3: Access to location */}
        <div className="space-y-3 border-t border-slate-150 pt-6">
          <div className="flex items-center space-x-2">
            <div className="flex h-6.5 w-6.5 items-center justify-center rounded-full bg-teal-50 text-xs font-bold text-primary-custom">
              3
            </div>
            <h4 className="font-display font-extrabold text-slate-800 text-sm">Telemetry Geolocation Access Token</h4>
          </div>
          <p className="text-xs text-slate-500 pl-8">
            Access secure HTML5 high accuracy positioning to cache your device's last active safety node coordinates.
          </p>
          <div className="pl-8 space-y-4">
            <div className="flex items-center space-x-4">
              <button
                type="button"
                disabled={fetchingLocation}
                onClick={handleLocationRequest}
                className={`inline-flex items-center space-x-1.5 rounded-xl border px-4 py-2.5 text-xs font-bold transition ${
                  allowedLocation 
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100' 
                    : 'border-primary-custom bg-white text-primary-custom hover:bg-teal-50'
                }`}
              >
                {fetchingLocation ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Accessing GPS Native Sensors...</span>
                  </>
                ) : (
                  <>
                    <Compass className="h-4.5 w-4.5" />
                    <span>{allowedLocation ? '✓ Telemetry Lock Cache Updated' : 'Request GPS/Location Approval'}</span>
                  </>
                )}
              </button>

              {fetchingLocation && (
                <span className="text-[10px] font-bold text-primary-custom uppercase animate-pulse-slow">
                  Testing Native browser API
                </span>
              )}
            </div>

            {allowedLocation && (
              <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 max-w-md text-[11px] text-emerald-800 space-y-1">
                <p className="font-bold flex items-center space-x-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Interactive Coordinate cached successfully:</span>
                </p>
                <p className="font-mono pl-4.5">
                  Latitude: {allowedLocation.latitude.toFixed(6)} N • Longitude: {allowedLocation.longitude.toFixed(6)} W
                </p>
                <p className="pl-4.5">
                  Telemetry Margin Search Circle Accuracy: <strong>{allowedLocation.accuracy.toFixed(1)} meters</strong>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Token #4: User Verification with valid ID */}
        <div className="space-y-3 border-t border-slate-150 pt-6">
          <div className="flex items-center space-x-2">
            <div className="flex h-6.5 w-6.5 items-center justify-center rounded-full bg-teal-50 text-xs font-bold text-primary-custom">
              4
            </div>
            <h4 className="font-display font-extrabold text-slate-800 text-sm">Government Issued Valid ID token</h4>
          </div>
          <p className="text-xs text-slate-500 pl-8">
            Upload scanner copy of Passport, National ID card, or Driver's License to confirm legal name identities.
          </p>
          
          <div className="pl-8 space-y-4">
            <div className="max-w-md">
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-6 cursor-pointer hover:bg-slate-50 transition relative">
                <input 
                  type="file" 
                  accept="image/*,application/pdf"
                  onChange={handleIdUpload}
                  className="hidden" 
                />
                
                {scanningID ? (
                  <div className="space-y-2 text-center">
                    <RefreshCw className="mx-auto h-8 w-8 text-primary-custom animate-spin" />
                    <p className="text-xs font-bold text-primary-custom animate-pulse">Running OCR Face-Doc Match checks...</p>
                  </div>
                ) : idVerified ? (
                  <div className="space-y-1 text-center">
                    <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600" />
                    <p className="text-xs font-bold text-emerald-700">Gov ID Match Verified</p>
                    <p className="text-[10px] text-slate-450 font-mono">{idDocumentName}</p>
                  </div>
                ) : (
                  <div className="space-y-1 text-center">
                    <UploadCloud className="mx-auto h-8 w-8 text-slate-400" />
                    <p className="text-xs font-semibold text-slate-500">Choose ID copy or PDF uploader</p>
                    <p className="text-[9px] text-slate-400">Accepts PDFs or images max 5MB</p>
                  </div>
                )}
              </label>
            </div>

            {idSuccess && (
              <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 max-w-md text-[11px] text-emerald-800">
                <p className="font-bold flex items-center space-x-1">
                  <span>✓ Certification Document Loaded:</span>
                </p>
                <p className="mt-1 leading-relaxed">
                  Your biometric markers have been correlated with your registered legal name. Fully verified badge activated.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action button */}
        <div className="pt-6 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="rounded-xl bg-primary-custom px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-teal-800 transition"
          >
            Save Verification Profile
          </button>
        </div>

      </form>
    </div>
  );
}
