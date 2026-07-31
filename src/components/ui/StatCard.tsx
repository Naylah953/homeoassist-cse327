import { Card } from './Card';

interface StatCardProps {
  label: string;
  value: string | number;
  sub: string;
  gold?: boolean;
  warn?: boolean;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, sub, gold, warn, className = '', }) => {
  // Resolve value text color based on priority: warn -> gold -> default
  const getValueColor = () => {
    if (warn) return '#c0392b';
    if (gold) return 'var(--color-accent)';
    return 'var(--color-foreground, #1b2d20)';
  };

  return (
    <Card className={`p-5 flex flex-col gap-2.5 ${className}`}>
      <p className="text-[10px] font-bold uppercase tracking-widest text-[#7a7468]"> {label} </p>
      <p className="text-[32px] font-bold leading-none" style={{ fontFamily: 'var(--font-display)', color: getValueColor(), }}> {value} </p>
      <p className="text-xs text-[#7a7468]">{sub}</p>
    </Card>
  );
};