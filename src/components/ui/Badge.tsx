const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ')

export function Badge({ label, variant = 'default' }: { label: string; variant?: 'default' | 'success' | 'warning' | 'danger' | 'accent' | 'new' | 'gold' }) {
  const s = {
    default: 'bg-[#ede9e3] text-[#7a7468]',
    success: 'bg-green-50 text-green-700 border border-green-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    danger:  'bg-red-50 text-red-600 border border-red-200',
    accent:  'bg-amber-50 text-amber-700 border border-amber-200',
    new:     'bg-blue-50 text-blue-600 border border-blue-200',
    gold:    'bg-amber-50 text-amber-700 border border-amber-300',
  }
  return <span className={cx('inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium whitespace-nowrap', s[variant])}>{label}</span>
}

