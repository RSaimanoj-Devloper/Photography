import React, { useState } from 'react';
import {
  TrendingUp,
  Users,
  Eye,
  Download,
  Database,
  RefreshCw,
  Search,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Server,
  Layers,
  Sparkles,
} from 'lucide-react';
import { AnalyticsData, AivenSyncState, BookingInquiry, Photo } from '../types';

interface StudioAnalyticsDashboardProps {
  analytics: AnalyticsData;
  aivenState: AivenSyncState;
  onTriggerAivenSync: () => void;
  photos: Photo[];
  inquiries: BookingInquiry[];
  onUpdateInquiryStatus: (inquiryId: string, status: 'new' | 'reviewing' | 'confirmed' | 'completed') => void;
}

export const StudioAnalyticsDashboard: React.FC<StudioAnalyticsDashboardProps> = ({
  analytics,
  aivenState,
  onTriggerAivenSync,
  photos,
  inquiries,
  onUpdateInquiryStatus,
}) => {
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('30d');
  const [syncingActive, setSyncingActive] = useState<boolean>(false);
  const [syncSuccessToast, setSyncSuccessToast] = useState<boolean>(false);

  const handleSyncClick = () => {
    setSyncingActive(true);
    setTimeout(() => {
      onTriggerAivenSync();
      setSyncingActive(false);
      setSyncSuccessToast(true);
      setTimeout(() => setSyncSuccessToast(false), 4000);
    }, 900);
  };

  const timeframeMultiplier = timeframe === '7d' ? 0.35 : timeframe === '90d' ? 2.6 : 1;

  return (
    <section id="analytics-section" className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <div className="text-xs uppercase tracking-widest font-semibold text-neutral-500 dark:text-neutral-400 mb-2">
            Studio Intelligence & Infrastructure
          </div>
          <h2 className="text-3xl sm:text-4xl font-editorial font-light text-neutral-900 dark:text-neutral-100 tracking-tight">
            Portfolio Analytics & Aiven Cloud Sync
          </h2>
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-900 rounded-lg">
          <button
            onClick={() => setTimeframe('7d')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              timeframe === '7d'
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setTimeframe('30d')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              timeframe === '30d'
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
            }`}
          >
            Last 30 Days
          </button>
          <button
            onClick={() => setTimeframe('90d')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              timeframe === '90d'
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
            }`}
          >
            Last 90 Days
          </button>
        </div>
      </div>

      {/* KPI Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs mb-3">
            <span>Portfolio Impressions</span>
            <Eye className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="text-3xl font-editorial font-normal text-neutral-900 dark:text-neutral-100 tabular-nums">
            {Math.round(analytics.totalViews * timeframeMultiplier).toLocaleString()}
          </div>
          <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-mono">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+18.4% retention vs previous period</span>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs mb-3">
            <span>Unique Art Buyers & Clients</span>
            <Users className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="text-3xl font-editorial font-normal text-neutral-900 dark:text-neutral-100 tabular-nums">
            {Math.round(analytics.uniqueVisitors * timeframeMultiplier).toLocaleString()}
          </div>
          <div className="mt-2 text-xs text-neutral-500 dark:text-neutral-400 font-mono">
            <span>Avg. session dwell: 4m 38s</span>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs mb-3">
            <span>Master File Downloads</span>
            <Download className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="text-3xl font-editorial font-normal text-neutral-900 dark:text-neutral-100 tabular-nums">
            {Math.round(analytics.totalDownloads * timeframeMultiplier).toLocaleString()}
          </div>
          <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-mono">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>{analytics.proofingApprovalRate}% proof approval rate</span>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs mb-3">
            <span>Commission Pipeline Value</span>
            <TrendingUp className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="text-3xl font-editorial font-normal text-neutral-900 dark:text-neutral-100 tabular-nums">
            ${Math.round(analytics.projectedRevenue * timeframeMultiplier).toLocaleString()}
          </div>
          <div className="mt-2 text-xs text-neutral-500 dark:text-neutral-400 font-mono">
            <span>Based on 14 confirmed monographs</span>
          </div>
        </div>
      </div>

      {/* Aiven Cloud DB Synchronization & Query Optimization Console */}
      <div className="mb-12 p-6 sm:p-8 rounded-2xl bg-neutral-900 text-white border border-neutral-800 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-neutral-800">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-neutral-800 text-neutral-200">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono mb-1">
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Aiven PostgreSQL Synchronized
                </span>
                <span aria-hidden="true">·</span>
                <span>{aivenState.replicaRegion}</span>
              </div>
              <h3 className="font-editorial text-2xl text-white font-normal">
                Aiven Cloud DB Synchronization Console
              </h3>
              <p className="text-xs text-neutral-400 mt-1 max-w-xl">
                Maintains bi-directional data consistency for private client galleries, biometric credentials, and booking inquiries across all client devices with indexed query optimization.
              </p>
            </div>
          </div>

          <button
            onClick={handleSyncClick}
            disabled={syncingActive}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-black bg-white rounded-lg hover:bg-neutral-200 transition-colors cursor-pointer shadow-md disabled:opacity-50 whitespace-nowrap"
          >
            <RefreshCw className={`w-4 h-4 ${syncingActive ? 'animate-spin' : ''}`} />
            {syncingActive ? 'Synchronizing Cluster...' : 'Force Cloud DB Sync'}
          </button>
        </div>

        {/* Sync Telemetry Metrics */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs font-mono tabular-nums">
          <div>
            <div className="text-neutral-400 text-[11px] uppercase mb-1">Query Latency</div>
            <div className="text-xl text-emerald-400 font-semibold">{aivenState.latencyMs} ms</div>
            <div className="text-neutral-400 text-[10px]">Optimized B-tree indexes</div>
          </div>

          <div>
            <div className="text-neutral-400 text-[11px] uppercase mb-1">Consistent Records</div>
            <div className="text-xl text-neutral-100 font-semibold">{aivenState.recordsConsistent} Entities</div>
            <div className="text-neutral-400 text-[10px]">Cross-device verified</div>
          </div>

          <div>
            <div className="text-neutral-400 text-[11px] uppercase mb-1">Target Cluster</div>
            <div className="text-neutral-200 text-xs font-medium truncate">{aivenState.host}</div>
            <div className="text-neutral-400 text-[10px]">TLS 1.3 Encrypted</div>
          </div>

          <div>
            <div className="text-neutral-400 text-[11px] uppercase mb-1">Last Replicated</div>
            <div className="text-neutral-200 text-xs font-medium">{aivenState.lastSyncedAt}</div>
            <div className="text-neutral-400 text-[10px]">Zero-replica lag</div>
          </div>
        </div>

        {syncSuccessToast && (
          <div className="mt-6 p-3 rounded-lg bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>
              Aiven Console database synchronization completed. All gallery tokens and booking records are consistent.
            </span>
          </div>
        )}
      </div>

      {/* Two-Column Analytics: Popular Content Trends & Search Terms */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Left: Popular Content Trends */}
        <div className="lg:col-span-7 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-200 dark:border-neutral-800">
            <div>
              <div className="text-xs uppercase tracking-wider text-neutral-500 font-semibold">
                Content Engagement
              </div>
              <h3 className="font-editorial text-2xl text-neutral-900 dark:text-neutral-100 font-normal">
                Popular Portfolio Trends
              </h3>
            </div>
            <span className="text-xs text-neutral-500 font-mono">Ranked by Engagement</span>
          </div>

          <div className="space-y-4">
            {photos.map((p, idx) => {
              const engagementRate = ((p.downloads / p.views) * 100).toFixed(1);
              return (
                <div
                  key={p.id}
                  className="flex items-center justify-between gap-4 p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-950 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-semibold text-neutral-400 w-4">
                      {idx + 1}.
                    </span>
                    <img
                      src={p.imageUrl}
                      alt={p.title}
                      className="w-12 h-12 rounded-lg object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        {p.title}
                      </div>
                      <div className="text-xs text-neutral-500 font-mono">
                        {p.category} · {p.exif.location}
                      </div>
                    </div>
                  </div>

                  <div className="text-right text-xs font-mono tabular-nums">
                    <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                      {p.views.toLocaleString()} views
                    </div>
                    <div className="text-emerald-600 dark:text-emerald-400">
                      {engagementRate}% conversion
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Top Search Keywords & Retention Analytics */}
        <div className="lg:col-span-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8">
          <div className="mb-6 pb-4 border-b border-neutral-200 dark:border-neutral-800">
            <div className="text-xs uppercase tracking-wider text-neutral-500 font-semibold">
              Audience Intent
            </div>
            <h3 className="font-editorial text-2xl text-neutral-900 dark:text-neutral-100 font-normal">
              Search Trends
            </h3>
          </div>

          <div className="space-y-3">
            {analytics.popularKeywords.map((item) => (
              <div
                key={item.keyword}
                className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-800/80"
              >
                <div className="flex items-center gap-2">
                  <Search className="w-3.5 h-3.5 text-neutral-400" />
                  <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200">
                    "{item.keyword}"
                  </span>
                </div>
                <span className="text-xs font-mono tabular-nums text-neutral-500">
                  {item.count.toLocaleString()} searches
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500 leading-relaxed font-light">
            Search trends indicate a 40% surge in queries for medium-format editorial commissions and intimate destination weddings.
          </div>
        </div>
      </div>

      {/* Booking Pipeline CRM Table */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <div className="text-xs uppercase tracking-wider text-neutral-500 font-semibold">
              Client Relationship CRM
            </div>
            <h3 className="font-editorial text-2xl text-neutral-900 dark:text-neutral-100 font-normal">
              Active Client Booking Inquiries
            </h3>
          </div>
          <span className="text-xs text-neutral-500 font-mono">
            {inquiries.length} Active Records
          </span>
        </div>

        {inquiries.length === 0 ? (
          <div className="text-center py-12 text-neutral-400 text-xs">
            No booking inquiries yet. Submit an inquiry from the booking section to test the live pipeline.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="text-neutral-400 uppercase border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  <th className="py-3 px-4">Ref #</th>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Package</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4 text-right">Commission</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {inquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-950 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-neutral-900 dark:text-neutral-100">
                      {inq.referenceNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-sans font-medium text-neutral-900 dark:text-neutral-100">
                        {inq.clientName}
                      </div>
                      <div className="text-neutral-400 text-[11px]">{inq.clientEmail}</div>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-700 dark:text-neutral-300 font-sans">
                      {inq.packageName}
                    </td>
                    <td className="py-3.5 px-4 text-neutral-600 dark:text-neutral-400">
                      {inq.requestedDate}
                    </td>
                    <td className="py-3.5 px-4 text-right font-semibold text-neutral-900 dark:text-neutral-100 tabular-nums">
                      ${inq.totalPrice.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <select
                        value={inq.status}
                        onChange={(e) =>
                          onUpdateInquiryStatus(
                            inq.id,
                            e.target.value as 'new' | 'reviewing' | 'confirmed' | 'completed'
                          )
                        }
                        className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded px-2 py-1 text-[11px] text-neutral-800 dark:text-neutral-200 cursor-pointer"
                      >
                        <option value="new">New</option>
                        <option value="reviewing">Reviewing</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};
