/**
 * High-resolution download and calendar export utilities
 */

export async function downloadSingleImage(imageUrl: string, filename: string, watermarked: boolean = false): Promise<void> {
  try {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;

    await new Promise((resolve, reject) => {
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Image failed to load'));
    });

    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth || 3840;
    canvas.height = img.naturalHeight || 2160;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      if (watermarked) {
        ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.textAlign = 'right';
        ctx.fillText('LUMEN & MONOLITH — PROOF PREVIEW', canvas.width - 60, canvas.height - 60);
      }

      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 'image/jpeg', 0.95);
    }
  } catch {
    // Direct link download fallback
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `${filename}.jpg`;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}

/**
 * Creates an .ICS iCalendar file for client booking confirmation
 */
export function generateCalendarInvite(params: {
  title: string;
  description: string;
  location: string;
  dateStr: string;
  timeStr: string;
}): void {
  const { title, description, location, dateStr, timeStr } = params;

  // Format YYYYMMDDTHHMMSS
  const cleanDate = dateStr.replace(/-/g, '');
  const cleanTime = timeStr.replace(/[^0-9]/g, '').padEnd(4, '0') + '00';
  const startDateTime = `${cleanDate}T${cleanTime}`;

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Lumen and Monolith Photography//Booking System//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `SUMMARY:${title}`,
    `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
    `LOCATION:${location}`,
    `DTSTART:${startDateTime}`,
    `DTEND:${startDateTime}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `photography-session-${dateStr}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
