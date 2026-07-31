import { Ico, IC } from '../ui/Ico';

interface TopBarProps {
  title: string;
  sub?: string;
  profile?: { name?: string };
  defaultInitials?: string;
  onProfileClick?: () => void;
  onNotificationClick?: () => void;
  avatarBg?: string; // Allows customizing the avatar color per role if needed
}

export const TopBar: React.FC<TopBarProps> = ({
  title,
  sub,
  profile,
  defaultInitials = 'U',
  onProfileClick,
  onNotificationClick,
  avatarBg = 'var(--color-primary)',
}) => {
  // Compute user initials dynamically with fallback
  const getInitials = (name?: string) => {
    if (!name) return defaultInitials;
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const isClickable = Boolean(onProfileClick);

  return (
    <div
      className="flex items-center justify-between px-8 py-4 sticky top-0 z-10"
      style={{
        background: 'rgba(245,242,237,0.88)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid #d6d0c8',
      }}
    >
      {/* Title & Subtitle */}
      <div>
        <h1
          className="text-[19px] font-semibold"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--color-foreground, #1b2d20)',
          }}
        >
          {title}
        </h1>
        {sub && (
          <p className="text-[11px] mt-0.5" style={{ color: '#7a7468' }}>
            {sub}
          </p>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Notification Bell */}
        <button
          onClick={onNotificationClick}
          className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-[#ede9e3]"
          style={{ color: '#7a7468' }}
          title="Notifications"
        >
          <Ico d={IC.bell} size={16} />
        </button>

        {/* Profile Avatar */}
        <button
          onClick={onProfileClick}
          disabled={!isClickable}
          title={isClickable ? 'View & Edit Profile' : undefined}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold transition-transform ${
            isClickable
              ? 'cursor-pointer hover:scale-105 active:scale-95'
              : 'cursor-default'
          }`}
          style={{
            background: avatarBg,
            color: '#ffffff',
          }}
        >
          {getInitials(profile?.name)}
        </button>
      </div>
    </div>
  );
};


// //admin
// function TopBar({ title, sub }: { title: string; sub?: string }) {
//   return (
//     <div className="flex items-center justify-between px-8 py-4 sticky top-0 z-10"
//       style={{ background: 'rgba(245,242,237,0.88)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #d6d0c8' }}>
//       <div>
//         <h1 className="text-[19px] font-semibold" style={{ fontFamily: 'var(--font-display)', color: '#1b2d20' }}>{title}</h1>
//         {sub && <p className="text-[11px] mt-0.5" style={{ color: '#7a7468' }}>{sub}</p>}
//       </div>
//       <div className="flex items-center gap-2">
//         <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#ede9e3] transition-colors" style={{ color: '#7a7468' }}>
//           <Ico d={IC.bell} size={16} />
//         </button>
//         <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold"
//           style={{ background: '#c9913d', color: 'white' }}>SA</div>
//       </div>
//     </div>
//   )
// }

// //doc
// function TopBar({ title, sub, onProfileClick, profile }: { title: string; sub?: string; onProfileClick?: () => void; profile?: any }) {
// const getInitials = (name?: string) => {
//   if (!name) return 'AR'
//   return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
// }

//   return (
//     <div className="flex items-center justify-between px-8 py-4 sticky top-0 z-10"
//       style={{ background: 'rgba(245,242,237,0.85)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #d6d0c8' }}>
//       <div>
//         <h1 className="text-[19px] font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-foreground)' }}>{title}</h1>
//         {sub && <p className="text-[11px] mt-0.5" style={{ color: '#7a7468' }}>{sub}</p>}
//       </div>
//       <div className="flex items-center gap-2">
//         <button className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-[#ede9e3]" style={{ color: '#7a7468' }}>
//           <Ico d={IC.bell} size={16} />
//         </button>
//         {/* Clickable Top-Right Profile Icon */}
//         <button
//           onClick={onProfileClick}
//           title="Edit Profile"
//           className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold cursor-pointer transition-transform hover:scale-105"
//           style={{ background: 'var(--color-primary)', color: '#f0ede8' }}>
//           {getInitials(profile?.name)}
//         </button>
//       </div>
//     </div>
//   )
// }

// //patient
// function TopBar({ title, sub, onProfileClick, profile }: { title: string; sub?: string; onProfileClick?: () => void; profile?: any }) {
//   const getInitials = (name?: string) => {
//     if (!name) return 'RH'
//     return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
//   }

//   return (
//     <div className="flex items-center justify-between px-8 py-4 sticky top-0 z-10"
//       style={{ background: 'rgba(245,242,237,0.88)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #d6d0c8' }}>
//       <div>
//         <h1 className="text-[19px] font-semibold" style={{ fontFamily: 'var(--font-display)', color: '#1b2d20' }}>{title}</h1>
//         {sub && <p className="text-[11px] mt-0.5" style={{ color: '#7a7468' }}>{sub}</p>}
//       </div>
//       <div className="flex items-center gap-2">
//         <button className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-[#ede9e3]" style={{ color: '#7a7468' }}>
//           <Ico d={IC.bell} size={16} />
//         </button>
//         <button 
//           onClick={onProfileClick}
//           title="View & Edit Profile"
//           className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold transition-transform active:scale-95 cursor-pointer"
//           style={{ background: 'var(--color-accent)', color: 'white' }}>
//           {getInitials(profile?.name)}
//         </button>
//       </div>
//     </div>
//   )
// }
