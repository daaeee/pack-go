import { Link } from 'react-router-dom'
import { usePackGo } from '../app/state/store'

export function DashboardPage() {
  const { state } = usePackGo()
  const packedCount = state.boxes.filter((b) => b.status === 'packed').length
  const transitCount = state.boxes.filter((b) => b.status === 'in_transit').length
  const deliveredCount = state.boxes.filter((b) => b.status === 'delivered').length
  const unpackedCount = state.boxes.filter((b) => b.status === 'unpacked').length

  return (
    <div className="space-y-6">
      <div className="pg-card p-6">
        <div className="text-sm text-slate-500">Добро пожаловать</div>
        <div className="mt-1 text-2xl font-semibold text-slate-900">
          {state.profile.name} {state.profile.surname}
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link className="pg-btn-primary" to="/boxes">
            Добавить коробку
          </Link>
          <Link className="pg-btn-secondary" to="/logistics">
            Перейти к логистике
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="pg-card p-5">
          <div className="text-xs font-semibold text-slate-500">Упаковано</div>
          <div className="mt-2 text-2xl font-semibold text-slate-900">{packedCount}</div>
        </div>
        <div className="pg-card p-5">
          <div className="text-xs font-semibold text-slate-500">У перевозчика</div>
          <div className="mt-2 text-2xl font-semibold text-slate-900">{transitCount}</div>
        </div>
        <div className="pg-card p-5">
          <div className="text-xs font-semibold text-slate-500">Доставлено</div>
          <div className="mt-2 text-2xl font-semibold text-slate-900">{deliveredCount}</div>
        </div>
        <div className="pg-card p-5">
          <div className="text-xs font-semibold text-slate-500">Распаковано</div>
          <div className="mt-2 text-2xl font-semibold text-slate-900">{unpackedCount}</div>
        </div>
      </div>
    </div>
  )
}

