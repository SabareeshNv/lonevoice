import { SITE } from '@/site.config';

const part = (options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat(SITE.locale, { timeZone: SITE.timeZone, ...options });

const dayFormat = part({ day: '2-digit' });
const monthFormat = part({ month: 'short' });
const monthLongFormat = part({ month: 'long' });
const weekdayFormat = part({ weekday: 'short' });
const yearFormat = part({ year: 'numeric' });
const fullFormat = part({ weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const shortFormat = part({ day: '2-digit', month: 'short', year: 'numeric' });

/** The pieces of the date block: 21 · NOV · SAT · 2026. */
export function dateParts(date: Date) {
  return {
    day: dayFormat.format(date),
    month: monthFormat.format(date).toUpperCase(),
    weekday: weekdayFormat.format(date).toUpperCase(),
    year: yearFormat.format(date),
  };
}

/** “Saturday 21 November 2026”: the accessible name of a date block. */
export const fullDate = (date: Date) => fullFormat.format(date);

/** “21 Nov 2026”. */
export const shortDate = (date: Date) => shortFormat.format(date);

/** Year and month name, used to group the archive. */
export const yearOf = (date: Date) => yearFormat.format(date);
export const monthNameOf = (date: Date) => monthLongFormat.format(date).toLowerCase();

/**
 * Reads a date's clock time as a time in SITE.timeZone.
 *
 * Pages CMS (the phone editor) saves the clock time it shows, such as 16:57, followed by
 * "+00:00" whatever the real time zone is. YAML turns that into a Date whose UTC fields
 * are the clock reading. This puts that reading in the site's time zone, so a post
 * written at 20:30 in India stays on its own day and keeps the right order. A date with
 * no time (midnight) comes out as midnight in the site's time zone, the same day.
 */
export function clockTimeAsSiteTime(clock: Date): Date {
  const clockFormat = new Intl.DateTimeFormat('en-US', {
    timeZone: SITE.timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  // How far the site's clock is ahead of UTC at a given moment, in milliseconds.
  const offsetAt = (instant: Date) => {
    const p = Object.fromEntries(clockFormat.formatToParts(instant).map(({ type, value }) => [type, Number(value)]));
    return Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second) - Math.floor(instant.getTime() / 1000) * 1000;
  };
  // Two passes settle the answer even where the offset changes (daylight saving).
  const first = new Date(clock.getTime() - offsetAt(clock));
  return new Date(clock.getTime() - offsetAt(first));
}
