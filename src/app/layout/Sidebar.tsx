import { clsx } from 'clsx'
import {
  LayoutDashboard,
  Package,
  Truck,
  QrCode,
  User,
  Home,
  ChefHat,
  Bed,
  Sofa,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { usePackGo } from '../state/store'

const nav = [
  { to: '/dashboard', label: 'Дашборд', icon: LayoutDashboard },
  { to: '/boxes', label: 'Мои коробки', icon: Package },
  { to: '/logistics', label: 'Логистика', icon: Truck },
  { to: '/scanner', label: 'Сканер', icon: QrCode },
  { to: '/profile', label: 'Профиль', icon: User },
] as const

function roomIcon(roomId: string) {
  switch (roomId) {
    case 'kitchen':
      return ChefHat
    case 'bedroom':
      return Bed
    case 'living':
      return Sofa
    default:
      return Home
  }
}

export function Sidebar() {
  const { state } = usePackGo()

  return (
    <aside className="w-[260px] shrink-0">
      <div className="pg-card p-4">
        <div className="flex items-center gap-2 px-2 py-1">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-900 text-white">
            <Package size={18} />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-slate-900">Pack&Go</div>
          </div>
        </div>

        <nav className="mt-4 space-y-1">
          {nav.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium',
                    isActive
                      ? 'bg-slate-100 text-slate-900'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                  )
                }
              >
                <Icon size={18} className="opacity-80" />
                {item.label}
              </NavLink>
            )
          })}
        </nav>

        <div className="mt-6 px-2">
          <div className="text-[11px] font-semibold tracking-wider text-slate-400">
            НЕДАВНИЕ КОМНАТЫ
          </div>
          <div className="mt-2 space-y-1">
            {state.rooms.map((r) => {
              const Icon = roomIcon(r.id)
              return (
                <div
                  key={r.id}
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-600"
                >
                  <Icon size={16} className="opacity-70" />
                  {r.name}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </aside>
  )
}

