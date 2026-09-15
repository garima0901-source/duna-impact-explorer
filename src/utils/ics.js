// Client-side .ics generation — no backend. Builds a single-day VEVENT per
// RFC 5545 and triggers a browser download via an object URL.

function icsEscape(text) {
  return String(text)
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
}

function toIcsDate(iso) {
  return iso.replace(/-/g, '')
}

function addDays(iso, days) {
  const d = new Date(`${iso}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

function timestampNow() {
  return new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
}

export function buildDeadlineIcs({ id, title, date, description, sourceUrl }) {
  const fullDescription = sourceUrl ? `${description} Source: ${sourceUrl}` : description
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Duna Impact Explorer//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${id}@duna-impact-explorer.vercel.app`,
    `DTSTAMP:${timestampNow()}`,
    `DTSTART;VALUE=DATE:${toIcsDate(date)}`,
    `DTEND;VALUE=DATE:${toIcsDate(addDays(date, 1))}`,
    `SUMMARY:${icsEscape(title)}`,
    `DESCRIPTION:${icsEscape(fullDescription)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ]
  return lines.join('\r\n')
}

export function downloadDeadlineIcs(deadline) {
  const content = buildDeadlineIcs(deadline)
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${deadline.id}.ics`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
