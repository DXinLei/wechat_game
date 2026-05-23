/**
 * 日期工具
 */

const DAY_MS = 24 * 60 * 60 * 1000;

export function getToday() {
  const now = new Date();
  return formatDate(now);
}

export function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function isSameDay(date1, date2) {
  return formatDate(date1) === formatDate(date2);
}

export function isNewDay(lastDate) {
  if (!lastDate) return true;
  return lastDate !== getToday();
}

export function getDayStart() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now.getTime();
}

export function getDayEnd() {
  return getDayStart() + DAY_MS - 1;
}
