export type PhotoCategory = 'all' | 'editorial' | 'architecture' | 'portrait' | 'wedding';

export interface ExifData {
  camera: string;
  lens: string;
  focalLength: string;
  aperture: string;
  shutterSpeed: string;
  iso: number;
  location: string;
  year: number;
}

export interface Photo {
  id: string;
  title: string;
  category: 'editorial' | 'architecture' | 'portrait' | 'wedding';
  imageUrl: string;
  aspectRatio: '16:9' | '4:3' | '3:4' | '1:1';
  exif: ExifData;
  story: string;
  views: number;
  downloads: number;
  featured?: boolean;
}

export interface ClientGalleryPhoto {
  id: string;
  title: string;
  imageUrl: string;
  aspectRatio: string;
  resolution: string;
  fileSizeMb: number;
  isFavorite: boolean;
  proofingStatus?: 'pending' | 'approved' | 'retouch_requested';
  clientNotes?: string;
}

export interface ClientGallery {
  id: string;
  title: string;
  clientName: string;
  clientEmail: string;
  sessionType: string;
  sessionDate: string;
  accessPin: string;
  photos: ClientGalleryPhoto[];
  downloadExpiry: string;
  totalSizeMb: number;
  downloadCount: number;
  coverImage: string;
  passkeyRegistered?: boolean;
}

export interface BookingPackage {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  duration: string;
  features: string[];
  recommended?: boolean;
}

export interface BookingAddon {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface BookingInquiry {
  id: string;
  referenceNumber: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  packageId: string;
  packageName: string;
  requestedDate: string;
  requestedTime: string;
  selectedAddons: string[];
  totalPrice: number;
  location: string;
  visionNotes: string;
  status: 'new' | 'reviewing' | 'confirmed' | 'completed';
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  readTime: string;
  publishDate: string;
  category: string;
  coverImage: string;
  excerpt: string;
  content: string[];
  tags: string[];
  author: {
    name: string;
    role: string;
    avatar: string;
  };
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'booking' | 'download' | 'proofing' | 'milestone' | 'sync';
  read: boolean;
}

export interface AnalyticsData {
  totalViews: number;
  uniqueVisitors: number;
  totalDownloads: number;
  proofingApprovalRate: number;
  projectedRevenue: number;
  popularKeywords: { keyword: string; count: number }[];
  dailyTraffic: { date: string; views: number; inquiries: number }[];
}

export interface AivenSyncState {
  isConnected: boolean;
  host: string;
  database: string;
  replicaRegion: string;
  latencyMs: number;
  lastSyncedAt: string;
  syncStatus: 'synced' | 'syncing' | 'idle';
  recordsConsistent: number;
}
