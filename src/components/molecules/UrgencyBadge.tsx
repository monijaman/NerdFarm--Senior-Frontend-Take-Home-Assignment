import { Badge } from '@/components/atoms';
import { getUrgency, urgencyLabel } from '@/lib/urgency';
import { formatShortDate } from '@/lib/format';

interface UrgencyBadgeProps {
  slaDeadline: string;
}

export function UrgencyBadge({ slaDeadline }: UrgencyBadgeProps) {
  const urgency = getUrgency(slaDeadline);
  const variantMap = { high: 'danger', medium: 'warning', low: 'success' } as const;

  return (
    <span className="inline-flex items-center gap-1.5" aria-label={`SLA: ${urgencyLabel[urgency]}`}>
      <Badge variant={variantMap[urgency]}>
        {urgencyLabel[urgency]}
      </Badge>
      <span className="text-xs text-muted">{formatShortDate(slaDeadline)}</span>
    </span>
  );
}
