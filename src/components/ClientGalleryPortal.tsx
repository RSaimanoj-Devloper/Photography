import React, { useState } from 'react';
import {
  Lock,
  Fingerprint,
  Download,
  CheckCircle2,
  Calendar,
  Layers,
  Heart,
  MessageSquare,
  Shield,
  KeyRound,
  RefreshCw,
} from 'lucide-react';
import { ClientGallery, ClientGalleryPhoto } from '../types';
import { verifyBiometricPasskey, registerBiometricPasskey } from '../utils/webAuthn';
import { downloadSingleImage } from '../utils/downloadHelper';

interface ClientGalleryPortalProps {
  galleries: ClientGallery[];
  onProofingSubmitted: (galleryTitle: string, selectedCount: number) => void;
  onGalleryDownloaded: (galleryTitle: string) => void;
}

export const ClientGalleryPortal: React.FC<ClientGalleryPortalProps> = ({
  galleries,
  onProofingSubmitted,
  onGalleryDownloaded,
}) => {
  const [selectedGalleryId, setSelectedGalleryId] = useState<string>('gallery-sarah-david');
  const [pinInput, setPinInput] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [activeGallery, setActiveGallery] = useState<ClientGallery>(galleries[0]);

  // Gallery state after unlocking
  const [photosState, setPhotosState] = useState<ClientGalleryPhoto[]>(galleries[0].photos);
  const [watermarkEnabled, setWatermarkEnabled] = useState<boolean>(false);
  const [batchDownloadProgress, setBatchDownloadProgress] = useState<number | null>(null);
  const [proofingFeedbackSent, setProofingFeedbackSent] = useState<boolean>(false);
  const [biometricRegisterMsg, setBiometricRegisterMsg] = useState<string | null>(null);

  const currentGallery = galleries.find((g) => g.id === selectedGalleryId) || galleries[0];

  const handleSelectGallery = (gallery: ClientGallery) => {
    setSelectedGalleryId(gallery.id);
    setActiveGallery(gallery);
    setPhotosState(gallery.photos);
    setIsAuthenticated(false);
    setPinInput('');
    setAuthError(null);
    setProofingFeedbackSent(false);
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (pinInput.trim().toUpperCase() === currentGallery.accessPin.toUpperCase()) {
      setIsAuthenticated(true);
    } else {
      setAuthError('Incorrect gallery PIN code. Please verify the code from your delivery email.');
    }
  };

  const handleBiometricAuth = async () => {
    setAuthLoading(true);
    setAuthError(null);

    const result = await verifyBiometricPasskey(currentGallery.clientEmail);
    setAuthLoading(false);

    if (result.success) {
      setIsAuthenticated(true);
    } else {
      setAuthError(result.message);
    }
  };

  const handleRegisterPasskey = async () => {
    setAuthLoading(true);
    const result = await registerBiometricPasskey(
      currentGallery.clientEmail,
      currentGallery.clientName
    );
    setAuthLoading(false);
    setBiometricRegisterMsg(result.message);
    setTimeout(() => setBiometricRegisterMsg(null), 4000);
  };

  const handleToggleFavorite = (photoId: string) => {
    setPhotosState((prev) =>
      prev.map((p) => (p.id === photoId ? { ...p, isFavorite: !p.isFavorite } : p))
    );
  };

  const handleUpdateProofingStatus = (photoId: string, status: 'approved' | 'retouch_requested') => {
    setPhotosState((prev) =>
      prev.map((p) => (p.id === photoId ? { ...p, proofingStatus: status } : p))
    );
  };

  const handleBatchDownload = () => {
    setBatchDownloadProgress(10);
    const interval = setInterval(() => {
      setBatchDownloadProgress((prev) => {
        if (prev === null) return 100;
        if (prev >= 90) {
          clearInterval(interval);
          setTimeout(() => {
            setBatchDownloadProgress(null);
            onGalleryDownloaded(activeGallery.title);
            // Trigger sample first file download
            if (photosState.length > 0) {
              downloadSingleImage(
                photosState[0].imageUrl,
                `${activeGallery.clientName.replace(/\s+/g, '_')}_Master_01`,
                watermarkEnabled
              );
            }
          }, 600);
          return 100;
        }
        return prev + 25;
      });
    }, 300);
  };

  const approvedCount = photosState.filter((p) => p.proofingStatus === 'approved').length;

  const handleSubmitProofing = () => {
    onProofingSubmitted(activeGallery.title, approvedCount);
    setProofingFeedbackSent(true);
    setTimeout(() => setProofingFeedbackSent(false), 5000);
  };

  return (
    <div className="w-full py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Client Portal Header */}
      <div className="mb-10 pb-6 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest font-semibold text-neutral-500 dark:text-neutral-400 mb-2">
              Private Client Gateway
            </div>
            <h1 className="text-3xl sm:text-4xl font-editorial font-light text-neutral-900 dark:text-neutral-100 tracking-tight">
              Secure Monograph & Proofing Portal
            </h1>
          </div>

          {/* Quick Demo Gallery Switcher */}
          <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
            <span>Select Active Client:</span>
            <select
              value={selectedGalleryId}
              onChange={(e) => {
                const found = galleries.find((g) => g.id === e.target.value);
                if (found) handleSelectGallery(found);
              }}
              className="bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded px-2.5 py-1.5 text-xs text-neutral-900 dark:text-neutral-100 cursor-pointer font-medium"
            >
              {galleries.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.clientName} ({g.accessPin})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {!isAuthenticated ? (
        /* Authentication Screen: Biometrics + PIN */
        <div className="max-w-xl mx-auto my-8 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 sm:p-10 shadow-lg text-center">
          <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-800 dark:text-neutral-200">
            <Lock className="w-6 h-6" />
          </div>

          <h2 className="text-2xl font-editorial font-light text-neutral-900 dark:text-neutral-100 mb-2">
            {currentGallery.title}
          </h2>

          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-8 max-w-md mx-auto">
            This private client collection is encrypted. Authenticate using your registered Biometric Passkey (Touch ID / Face ID) or your 4-letter session PIN.
          </p>

          {/* Biometric Passkey / WebAuthn Button */}
          <div className="mb-6">
            <button
              onClick={handleBiometricAuth}
              disabled={authLoading}
              className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-white bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-950 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors cursor-pointer shadow-sm disabled:opacity-50"
            >
              <Fingerprint className="w-4 h-4" />
              {authLoading ? 'Verifying Credentials...' : 'Unlock with Biometric Passkey / Touch ID'}
            </button>
          </div>

          <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-neutral-200 dark:border-neutral-800" />
            <span className="flex-shrink mx-4 text-xs uppercase tracking-wider text-neutral-400">
              or enter access pin
            </span>
            <div className="flex-grow border-t border-neutral-200 dark:border-neutral-800" />
          </div>

          {/* PIN Code Entry */}
          <form onSubmit={handlePinSubmit} className="mt-4">
            <div className="flex items-center gap-2 max-w-xs mx-auto mb-4">
              <div className="relative flex-1">
                <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value.toUpperCase())}
                  placeholder={`e.g. ${currentGallery.accessPin}`}
                  className="w-full pl-9 pr-3 py-2.5 text-sm tracking-widest text-center font-mono border border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-400 uppercase"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-semibold tracking-wider uppercase text-white bg-neutral-800 dark:bg-neutral-200 dark:text-neutral-950 rounded-lg hover:bg-neutral-700 dark:hover:bg-white transition-colors cursor-pointer"
              >
                Unlock
              </button>
            </div>

            {authError && (
              <p className="text-xs text-rose-500 mt-2 font-medium">
                {authError}
              </p>
            )}

            <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800/60 text-xs text-neutral-400 flex items-center justify-center gap-1.5">
              <span>Demo PIN for this gallery:</span>
              <button
                type="button"
                onClick={() => setPinInput(currentGallery.accessPin)}
                className="font-mono font-semibold text-neutral-900 dark:text-neutral-100 underline cursor-pointer"
              >
                {currentGallery.accessPin}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Unlocked Secure Client Gallery */
        <div>
          {/* Welcome Monograph Card */}
          <div className="relative rounded-2xl overflow-hidden bg-neutral-900 text-white mb-10 p-8 sm:p-10 border border-neutral-800">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono mb-2">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Biometric Verified Session</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeGallery.sessionType}</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-editorial font-light text-white mb-2">
                  {activeGallery.title}
                </h2>

                <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-300 font-mono mt-3">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {activeGallery.sessionDate}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    {photosState.length} Master Plates ({activeGallery.totalSizeMb} MB)
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>Expires: {activeGallery.downloadExpiry}</span>
                </div>
              </div>

              {/* Top Controls: Batch Download & Passkey Registration */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={handleBatchDownload}
                  disabled={batchDownloadProgress !== null}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-black bg-white rounded-lg hover:bg-neutral-200 transition-colors cursor-pointer shadow-md disabled:opacity-50 whitespace-nowrap"
                >
                  <Download className="w-4 h-4" />
                  {batchDownloadProgress !== null
                    ? `Packaging Masters (${batchDownloadProgress}%)...`
                    : 'Download All Masters (ZIP)'}
                </button>

                <button
                  onClick={handleRegisterPasskey}
                  disabled={authLoading}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-3 text-xs font-medium text-neutral-300 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                  title="Store a platform biometric passkey on this device"
                >
                  <Fingerprint className="w-3.5 h-3.5" />
                  Register Device Passkey
                </button>
              </div>
            </div>

            {/* Notification alert for passkey */}
            {biometricRegisterMsg && (
              <div className="mt-4 p-3 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs">
                {biometricRegisterMsg}
              </div>
            )}
          </div>

          {/* Proofing Bar & Watermark Control */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 mb-8">
            <div className="flex items-center gap-3 text-xs text-neutral-700 dark:text-neutral-300">
              <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                Album Proofing Selection:
              </span>
              <span>
                <strong className="tabular-nums font-mono">{approvedCount}</strong> of{' '}
                <strong className="tabular-nums font-mono">{photosState.length}</strong> plates approved
              </span>
            </div>

            <div className="flex items-center gap-4">
              {/* Watermark preview toggle */}
              <label className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={watermarkEnabled}
                  onChange={(e) => setWatermarkEnabled(e.target.checked)}
                  className="rounded border-neutral-300 text-neutral-900 focus:ring-0 cursor-pointer"
                />
                <span>Watermark Overlay Preview</span>
              </label>

              {/* Submit Proofing to Studio */}
              <button
                onClick={handleSubmitProofing}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-950 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Submit Selections to Studio
              </button>
            </div>
          </div>

          {proofingFeedbackSent && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>
                Your proofing selections have been synchronized to the studio database. The master book layout will be updated accordingly!
              </span>
            </div>
          )}

          {/* Client Photos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {photosState.map((photo) => (
              <div
                key={photo.id}
                className="rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden bg-white dark:bg-neutral-900 shadow-sm"
              >
                {/* Photo Viewer Frame */}
                <div className="relative aspect-[4/3] bg-neutral-950 overflow-hidden">
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />

                  {/* Optional Watermark Overlay */}
                  {watermarkEnabled && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none bg-black/10">
                      <span className="text-xl sm:text-2xl font-editorial font-light tracking-widest text-white/40 uppercase rotate-[-15deg] border border-white/30 px-6 py-2">
                        PROOF PREVIEW · LUMEN STUDIO
                      </span>
                    </div>
                  )}

                  {/* Favorite Badge */}
                  <button
                    onClick={() => handleToggleFavorite(photo.id)}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md cursor-pointer transition-colors ${
                      photo.isFavorite
                        ? 'bg-rose-500 text-white'
                        : 'bg-black/40 hover:bg-black/60 text-white'
                    }`}
                    title={photo.isFavorite ? 'Saved as favorite' : 'Add to favorites'}
                  >
                    <Heart className={`w-4 h-4 ${photo.isFavorite ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Photo Details & Proofing Actions */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-editorial text-lg text-neutral-900 dark:text-neutral-100 font-normal">
                      {photo.title}
                    </h3>
                    <span className="text-xs text-neutral-500 font-mono tabular-nums">
                      {photo.fileSizeMb} MB
                    </span>
                  </div>

                  <div className="text-xs text-neutral-500 dark:text-neutral-400 font-mono mb-4">
                    Master Resolution: {photo.resolution}
                  </div>

                  {photo.clientNotes && (
                    <div className="text-xs italic bg-neutral-50 dark:bg-neutral-950 p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 mb-4 flex items-start gap-2">
                      <MessageSquare className="w-3.5 h-3.5 shrink-0 mt-0.5 text-neutral-400" />
                      <span>{photo.clientNotes}</span>
                    </div>
                  )}

                  {/* Proofing State Switcher & Individual Download */}
                  <div className="flex items-center justify-between gap-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleUpdateProofingStatus(photo.id, 'approved')}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                          photo.proofingStatus === 'approved'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200'
                        }`}
                      >
                        ✓ Approved
                      </button>
                      <button
                        onClick={() => handleUpdateProofingStatus(photo.id, 'retouch_requested')}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                          photo.proofingStatus === 'retouch_requested'
                            ? 'bg-amber-600 text-white'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200'
                        }`}
                      >
                        Retouch Notes
                      </button>
                    </div>

                    <button
                      onClick={() =>
                        downloadSingleImage(
                          photo.imageUrl,
                          `${photo.title.replace(/\s+/g, '_')}_Master`,
                          watermarkEnabled
                        )
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-900 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-md transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download High-Res
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
