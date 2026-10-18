import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Calendar as CalendarIcon,
  Clock,
  Check,
  Plus,
  ArrowRight,
  Download,
  CheckCircle,
  FileText,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { BookingPackage, BookingAddon, BookingInquiry } from '../types';
import { generateCalendarInvite } from '../utils/downloadHelper';

interface BookingSectionProps {
  packages: BookingPackage[];
  addons: BookingAddon[];
  onBookingSubmitted: (inquiry: BookingInquiry) => void;
}

export const BookingSection: React.FC<BookingSectionProps> = ({
  packages,
  addons,
  onBookingSubmitted,
}) => {
  const [selectedPackageId, setSelectedPackageId] = useState<string>(packages[1].id); // Default to Wedding
  const [selectedDate, setSelectedDate] = useState<string>('2026-11-20');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('15:00 - Golden Hour Twilight');
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>(['addon-album']);

  // Client Details Form
  const [clientName, setClientName] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [sessionLocation, setSessionLocation] = useState<string>('Cotswolds / Oxford, United Kingdom');
  const [visionNotes, setVisionNotes] = useState<string>('');

  // Confirmation state
  const [confirmedBooking, setConfirmedBooking] = useState<BookingInquiry | null>(null);

  const selectedPackage = packages.find((p) => p.id === selectedPackageId) || packages[0];

  const calculateTotal = () => {
    let total = selectedPackage.price;
    selectedAddonIds.forEach((id) => {
      const addon = addons.find((a) => a.id === id);
      if (addon) total += addon.price;
    });
    return total;
  };

  const handleToggleAddon = (addonId: string) => {
    setSelectedAddonIds((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    );
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail) {
      alert('Please provide your name and contact email.');
      return;
    }

    const newInquiry: BookingInquiry = {
      id: `inq-${Date.now()}`,
      referenceNumber: `LUM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      clientName,
      clientEmail,
      clientPhone,
      packageId: selectedPackage.id,
      packageName: selectedPackage.title,
      requestedDate: selectedDate,
      requestedTime: selectedTimeSlot,
      selectedAddons: selectedAddonIds,
      totalPrice: calculateTotal(),
      location: sessionLocation,
      visionNotes,
      status: 'new',
      createdAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    };

    onBookingSubmitted(newInquiry);
    setConfirmedBooking(newInquiry);

    // Fire Confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#000000', '#555555', '#D4AF37', '#FAFAFA'],
      });
    } catch {
      // ignore
    }
  };

  const handleDownloadCalendar = () => {
    if (!confirmedBooking) return;
    generateCalendarInvite({
      title: `Photography Session: ${confirmedBooking.packageName} (${confirmedBooking.referenceNumber})`,
      description: `Confirmed photography session with LUMEN & MONOLITH Studio.\nLocation: ${confirmedBooking.location}\nReference: ${confirmedBooking.referenceNumber}`,
      location: confirmedBooking.location,
      dateStr: confirmedBooking.requestedDate,
      timeStr: confirmedBooking.requestedTime,
    });
  };

  return (
    <section id="booking-section" className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="mb-12 pb-6 border-b border-neutral-200 dark:border-neutral-800 text-left">
        <div className="text-xs uppercase tracking-widest font-semibold text-neutral-500 dark:text-neutral-400 mb-2">
          Reserve Your Commission
        </div>
        <h2 className="text-3xl sm:text-4xl font-editorial font-light text-neutral-900 dark:text-neutral-100 tracking-tight">
          Client Booking & Inquiries
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 max-w-2xl font-light">
          Select your photographic package, reserve your desired date, and tailor bespoke archival deliverables.
        </p>
      </div>

      {confirmedBooking ? (
        /* Confirmed Booking Monograph Card */
        <div className="max-w-2xl mx-auto bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 sm:p-12 shadow-xl text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle className="w-8 h-8" />
          </div>

          <div className="text-xs uppercase tracking-widest font-semibold text-neutral-500 dark:text-neutral-400 mb-2 font-mono">
            Booking Inquiry Received
          </div>

          <h3 className="text-3xl font-editorial font-light text-neutral-900 dark:text-neutral-100 mb-2">
            Session Reserved, {confirmedBooking.clientName}
          </h3>

          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-8 max-w-md mx-auto">
            Reference code <strong className="font-mono text-neutral-900 dark:text-neutral-100">{confirmedBooking.referenceNumber}</strong>. We have dispatched a formal confirmation to <strong className="text-neutral-900 dark:text-neutral-100">{confirmedBooking.clientEmail}</strong> with preliminary moodboard questionnaires.
          </p>

          <div className="p-6 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-left mb-8 space-y-3 text-xs font-mono tabular-nums">
            <div className="flex justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
              <span className="text-neutral-500">Package:</span>
              <span className="font-semibold text-neutral-900 dark:text-neutral-100 font-sans">
                {confirmedBooking.packageName}
              </span>
            </div>
            <div className="flex justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
              <span className="text-neutral-500">Reserved Date:</span>
              <span className="text-neutral-900 dark:text-neutral-100">
                {confirmedBooking.requestedDate} ({confirmedBooking.requestedTime})
              </span>
            </div>
            <div className="flex justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
              <span className="text-neutral-500">Location:</span>
              <span className="text-neutral-900 dark:text-neutral-100">{confirmedBooking.location}</span>
            </div>
            <div className="flex justify-between pt-1 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              <span>Estimated Commission:</span>
              <span>${confirmedBooking.totalPrice.toLocaleString()} USD</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleDownloadCalendar}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-950 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              <CalendarIcon className="w-4 h-4" />
              Add to Calendar (.ICS)
            </button>

            <button
              onClick={() => setConfirmedBooking(null)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg transition-colors cursor-pointer"
            >
              Book Another Commission
            </button>
          </div>
        </div>
      ) : (
        /* 4-Step Interactive Booking Engine */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Step 1 & Step 2: Package & Date Selection (Left 7 Cols) */}
          <div className="lg:col-span-7 space-y-10">
            {/* Step 1: Packages */}
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-4">
                <span>01. Select Commission Package</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {packages.map((pkg) => {
                  const isSelected = pkg.id === selectedPackageId;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPackageId(pkg.id)}
                      className={`relative p-5 rounded-xl border text-left cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? 'border-neutral-900 dark:border-white bg-neutral-50 dark:bg-neutral-900 ring-1 ring-neutral-900 dark:ring-white shadow-sm'
                          : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 hover:border-neutral-400'
                      }`}
                    >
                      {pkg.recommended && (
                        <div className="text-[10px] uppercase tracking-widest font-semibold text-neutral-500 dark:text-neutral-400 mb-2">
                          Most In-Demand
                        </div>
                      )}

                      <h3 className="font-editorial text-xl text-neutral-900 dark:text-neutral-100 font-normal mb-1">
                        {pkg.title}
                      </h3>

                      <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-3">
                        {pkg.subtitle} · {pkg.duration}
                      </div>

                      <div className="text-2xl font-editorial font-normal text-neutral-900 dark:text-neutral-100 mb-4 tabular-nums">
                        ${pkg.price.toLocaleString()}
                        <span className="text-xs text-neutral-500 font-sans ml-1">USD</span>
                      </div>

                      <ul className="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-400">
                        {pkg.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <Check className="w-3.5 h-3.5 text-neutral-900 dark:text-neutral-100 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Date & Time Slot */}
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-4">
                <span>02. Select Preferred Date & Time Slot</span>
              </div>

              <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Session Date
                    </label>
                    <div className="relative">
                      <CalendarIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                      <input
                        type="date"
                        value={selectedDate}
                        min="2026-10-18"
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 text-xs font-mono border border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Natural Light Window
                    </label>
                    <div className="relative">
                      <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                      <select
                        value={selectedTimeSlot}
                        onChange={(e) => setSelectedTimeSlot(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 text-xs border border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-400 cursor-pointer"
                      >
                        <option value="06:30 - Dawn First Light">06:30 - Dawn First Light</option>
                        <option value="10:00 - North Atelier Window">10:00 - North Atelier Window</option>
                        <option value="15:00 - Golden Hour Twilight">15:00 - Golden Hour Twilight</option>
                        <option value="18:00 - Blue Hour Architectural">18:00 - Blue Hour Architectural</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Golden Hour Twilight is recommended for the selected wedding package.</span>
                </div>
              </div>
            </div>

            {/* Step 3: Bespoke Add-ons */}
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-4">
                <span>03. Tailor Bespoke Add-ons</span>
              </div>

              <div className="space-y-3">
                {addons.map((addon) => {
                  const isChecked = selectedAddonIds.includes(addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => handleToggleAddon(addon.id)}
                      className={`p-4 rounded-xl border flex items-center justify-between gap-4 cursor-pointer transition-colors ${
                        isChecked
                          ? 'border-neutral-900 dark:border-white bg-neutral-50 dark:bg-neutral-900'
                          : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 hover:border-neutral-400'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-5 h-5 mt-0.5 rounded flex items-center justify-center border transition-colors ${
                            isChecked
                              ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 border-transparent'
                              : 'border-neutral-300 dark:border-neutral-700'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                            {addon.name}
                          </div>
                          <div className="text-xs text-neutral-500 dark:text-neutral-400">
                            {addon.description}
                          </div>
                        </div>
                      </div>

                      <div className="text-sm font-editorial font-normal text-neutral-900 dark:text-neutral-100 tabular-nums shrink-0">
                        +${addon.price}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Step 4: Client Questionnaire & Order Summary (Right 5 Cols) */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="text-xs uppercase tracking-widest font-semibold text-neutral-500 dark:text-neutral-400 mb-2">
                04. Client Vision & Submission
              </div>
              <h3 className="font-editorial text-2xl text-neutral-900 dark:text-neutral-100 font-light mb-6">
                Booking Inquiry Summary
              </h3>

              {/* Price Breakdown */}
              <div className="pb-6 border-b border-neutral-200 dark:border-neutral-800 space-y-2 text-xs font-mono tabular-nums">
                <div className="flex justify-between text-neutral-700 dark:text-neutral-300">
                  <span>{selectedPackage.title}</span>
                  <span>${selectedPackage.price.toLocaleString()}</span>
                </div>

                {selectedAddonIds.map((id) => {
                  const addon = addons.find((a) => a.id === id);
                  if (!addon) return null;
                  return (
                    <div key={id} className="flex justify-between text-neutral-500">
                      <span className="truncate pr-2">+ {addon.name}</span>
                      <span>${addon.price}</span>
                    </div>
                  );
                })}

                <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex justify-between text-base font-semibold text-neutral-900 dark:text-neutral-100">
                  <span className="font-sans">Total Commission</span>
                  <span>${calculateTotal().toLocaleString()} USD</span>
                </div>
              </div>

              {/* Client Form */}
              <form onSubmit={handleSubmitBooking} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Eleanor Vance"
                    className="w-full px-3 py-2 text-xs border border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="client@studio.com"
                      className="w-full px-3 py-2 text-xs border border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="+44 20 7946 0912"
                      className="w-full px-3 py-2 text-xs border border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Location / Destination
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                    <input
                      type="text"
                      value={sessionLocation}
                      onChange={(e) => setSessionLocation(e.target.value)}
                      placeholder="e.g. Kyoto, Japan or Lake Como, Italy"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Artistic Vision & Special Inquiries
                  </label>
                  <textarea
                    rows={3}
                    value={visionNotes}
                    onChange={(e) => setVisionNotes(e.target.value)}
                    placeholder="Tell us about your wedding timeline, architectural project, or editorial concept..."
                    className="w-full px-3 py-2 text-xs border border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-400 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-white bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-950 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors cursor-pointer shadow-md"
                >
                  <span>Submit Commission Request</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-[11px] text-neutral-400 text-center">
                  Zero obligation. We will review date availability and respond within 24 hours.
                </p>
              </form>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
