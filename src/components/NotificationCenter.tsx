import React, { useState } from 'react';
import {
  Bell,
  X,
  Check,
  Smartphone,
  CheckCircle2,
  Download,
  Calendar,
  MessageSquare,
  Sparkles,
  Database,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
}) => {
  const [pushEnabled, setPushEnabled] = useState<boolean>(false);
  const [permissionStatus, setPermissionStatus] = useState<string>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  if (!isOpen) return null;

  const handleTogglePush = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      alert('Push notifications not supported in this browser.');
      return;
    }

    try {
      const perm = await Notification.requestPermission();
      setPermissionStatus(perm);
      if (perm === 'granted') {
        setPushEnabled(true);
        new Notification('LUMEN & MONOLITH Studio', {
          body: 'Cross-platform push alerts enabled for client milestones and bookings.',
          icon: '/favicon.ico',
        });
      } else {
        setPushEnabled(false);
      }
    } catch {
      // In sandboxed environments
      setPushEnabled((prev) => !prev);
    }
  };

  const getIconForType = (type: NotificationItem['type']) => {
    switch (type) {
      case 'download':
        return <Download className="w-4 h-4 text-emerald-500" />;
      case 'booking':
        return <Calendar className="w-4 h-4 text-blue-500" />;
      case 'proofing':
        return <MessageSquare className="w-4 h-4 text-amber-500" />;
      case 'milestone':
        return <Sparkles className="w-4 h-4 text-purple-500" />;
      case 'sync':
        return <Database className="w-4 h-4 text-cyan-500" />;
      default:
        return <Bell className="w-4 h-4 text-neutral-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-md h-full bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-neutral-800 dark:text-neutral-200" />
            <h3 className="font-editorial text-xl font-normal text-neutral-900 dark:text-neutral-100">
              Studio Milestone Alerts
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 rounded cursor-pointer"
              title={soundEnabled ? 'Mute Chimes' : 'Enable Chimes'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 rounded cursor-pointer"
              title="Close panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cross-Platform Push Notification Config Banner */}
        <div className="p-4 bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <Smartphone className="w-4 h-4 text-neutral-600 dark:text-neutral-400 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                  Cross-Platform Push Notifications
                </div>
                <div className="text-[11px] text-neutral-500 leading-tight">
                  Instant mobile notifications for iOS, Android, and Desktop.
                </div>
              </div>
            </div>

            <button
              onClick={handleTogglePush}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer shrink-0 ${
                pushEnabled || permissionStatus === 'granted'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 hover:opacity-90'
              }`}
            >
              {pushEnabled || permissionStatus === 'granted' ? 'Enabled' : 'Enable Push'}
            </button>
          </div>
        </div>

        {/* Action strip: Mark read / Clear */}
        <div className="px-5 py-2.5 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
          <span>{notifications.filter((n) => !n.read).length} unread milestones</span>
          <div className="flex items-center gap-3">
            <button
              onClick={onMarkAllAsRead}
              className="hover:text-neutral-900 dark:hover:text-neutral-200 cursor-pointer"
            >
              Mark all as read
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={onClearAll}
              className="hover:text-rose-500 cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Notification list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-16 text-xs text-neutral-400 font-mono">
              All caught up. No pending notifications.
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => onMarkAsRead(item.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  item.read
                    ? 'bg-white dark:bg-neutral-900 border-neutral-200/80 dark:border-neutral-800 opacity-70'
                    : 'bg-neutral-50 dark:bg-neutral-800/80 border-neutral-300 dark:border-neutral-700 shadow-xs'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 shrink-0">
                    {getIconForType(item.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                        {item.title}
                      </span>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        {item.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                      {item.message}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 text-center text-[11px] text-neutral-400 font-mono">
          Push alerts synchronized with Aiven Studio DB
        </div>
      </div>
    </div>
  );
};
