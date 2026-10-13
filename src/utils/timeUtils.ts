import { TaskStatus } from '../types/protocol';

export interface CountdownInfo {
  totalMs: number;
  isOverdue: boolean;
  isEarlyWarning: boolean;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  formattedString: string;
}

export function computeCountdown(
  targetDeadlineIso: string,
  alertBeforeMinutes: number,
  simulatedOffsetMs: number = 0,
  currentStatus: TaskStatus = 'PENDIENTE'
): CountdownInfo {
  const now = Date.now() + simulatedOffsetMs;
  const target = new Date(targetDeadlineIso).getTime();
  const diffMs = target - now;

  const isOverdue = diffMs <= 0 && currentStatus !== 'CUMPLIDO';
  const isEarlyWarning =
    diffMs > 0 &&
    diffMs <= alertBeforeMinutes * 60 * 1000 &&
    currentStatus !== 'CUMPLIDO';

  const absDiff = Math.abs(diffMs);
  const totalSeconds = Math.floor(absDiff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');

  let formattedString = '';
  if (days > 0) {
    formattedString = `${days}d ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
  } else if (hours > 0) {
    formattedString = `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
  } else {
    formattedString = `${pad(minutes)}m ${pad(seconds)}s`;
  }

  if (isOverdue) {
    formattedString = `-${formattedString}`;
  }

  return {
    totalMs: diffMs,
    isOverdue,
    isEarlyWarning,
    days,
    hours,
    minutes,
    seconds,
    formattedString,
  };
}

export function formatDateTimeEs(isoString: string): string {
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(d);
  } catch (e) {
    return isoString;
  }
}
