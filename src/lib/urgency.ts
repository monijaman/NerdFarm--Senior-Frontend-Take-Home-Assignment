export type UrgencyLevel = 'high' | 'medium' | 'low';

/**
 * Determines visual urgency of an SLA deadline:
 * - high   → < 24 hours remaining (red)
 * - medium → 24–72 hours remaining (amber)
 * - low    → > 72 hours remaining (green)
 */
export function getUrgency(slaDeadline: string): UrgencyLevel {
  const hoursRemaining =
    (new Date(slaDeadline).getTime() - Date.now()) / (1000 * 60 * 60);
  if (hoursRemaining < 24) return 'high';
  if (hoursRemaining < 72) return 'medium';
  return 'low';
}

export const urgencyLabel: Record<UrgencyLevel, string> = {
  high: 'Due soon',
  medium: 'Due this week',
  low: 'On track',
};

export const urgencyColorClass: Record<UrgencyLevel, string> = {
  high: 'text-danger bg-danger/10',
  medium: 'text-warning bg-warning/10',
  low: 'text-success bg-success/10',
};
