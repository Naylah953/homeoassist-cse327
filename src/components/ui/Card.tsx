const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ')

export function Card({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div style={style} className={cx('bg-white rounded-[10px] border border-[#d6d0c8]', className)}>
      {children}
    </div>
  )
}