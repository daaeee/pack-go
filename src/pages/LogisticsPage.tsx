import { useMemo, useState } from 'react'
import { Star, Phone, Globe } from 'lucide-react'
import { clsx } from 'clsx'
import { statusLabel, usePackGo } from '../app/state/store'
import type { BoxStatus } from '../app/state/types'

const statuses: { value: BoxStatus; label: string }[] = [
  { value: 'packed', label: 'Упакована' },
  { value: 'in_transit', label: 'У перевозчика' },
  { value: 'delivered', label: 'Доставлена' },
  { value: 'unpacked', label: 'Распакована' },
]

function StatusPill({ status }: { status: BoxStatus }) {
  const cls = (() => {
    switch (status) {
      case 'packed':
        return 'bg-slate-100 text-slate-700'
      case 'in_transit':
        return 'bg-blue-100 text-blue-700'
      case 'delivered':
        return 'bg-emerald-100 text-emerald-700'
      case 'unpacked':
        return 'bg-violet-100 text-violet-700'
    }
  })()
  return (
    <span className={clsx('inline-flex rounded-full px-3 py-1 text-xs font-semibold', cls)}>
      {statusLabel(status)}
    </span>
  )
}

export function LogisticsPage() {
  const { state, actions } = usePackGo()
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const [bulkStatus, setBulkStatus] = useState<BoxStatus>('packed')

  const roomsById = useMemo(
    () => Object.fromEntries(state.rooms.map((r) => [r.id, r] as const)),
    [state.rooms],
  )

  const allChecked = state.boxes.length > 0 && state.boxes.every((b) => selected[b.id])
  const anyChecked = state.boxes.some((b) => selected[b.id])

  function toggleAll(next: boolean) {
    const map: Record<string, boolean> = {}
    for (const b of state.boxes) map[b.id] = next
    setSelected(map)
  }

  function applyBulk() {
    for (const b of state.boxes) {
      if (selected[b.id]) actions.setBoxStatus(b.id, bulkStatus)
    }
  }

  return (
    <div className="space-y-6">
      <div className="pg-card p-6">
        <div className="text-xl font-semibold text-slate-900">Логистика</div>

        <div className="mt-5">
          <div className="text-sm font-semibold text-slate-900">Управление статусами</div>

          <div className="mt-3 overflow-hidden rounded-2xl ring-1 ring-slate-900/5">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold text-slate-500">
                <tr>
                  <th className="w-10 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={allChecked}
                      onChange={(e) => toggleAll(e.target.checked)}
                      aria-label="Выбрать все"
                    />
                  </th>
                  <th className="px-4 py-3">Коробка</th>
                  <th className="px-4 py-3">Комната</th>
                  <th className="px-4 py-3">Содержимое</th>
                  <th className="px-4 py-3">Статус</th>
                  <th className="w-[190px] px-4 py-3">Изменить</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {state.boxes.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={!!selected[b.id]}
                        onChange={(e) => setSelected((s) => ({ ...s, [b.id]: e.target.checked }))}
                        aria-label={`Выбрать ${b.title}`}
                      />
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900">{b.title}</td>
                    <td className="px-4 py-3 text-slate-700">{roomsById[b.roomId]?.name ?? '—'}</td>
                    <td className="px-4 py-3 text-slate-500">{b.itemsPreview}</td>
                    <td className="px-4 py-3">
                      <StatusPill status={b.status} />
                    </td>
                    <td className="px-4 py-3">
                      <select
                        className="pg-input"
                        value={b.status}
                        onChange={(e) => actions.setBoxStatus(b.id, e.target.value as BoxStatus)}
                        aria-label={`Изменить статус ${b.title}`}
                      >
                        {statuses.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <select
              className="pg-input max-w-[240px]"
              value={bulkStatus}
              onChange={(e) => setBulkStatus(e.target.value as BoxStatus)}
              disabled={!anyChecked}
            >
              {statuses.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <button className="pg-btn-primary" disabled={!anyChecked} onClick={applyBulk}>
              Изменить статус
            </button>
            <button className="pg-btn-secondary" onClick={() => setSelected({})}>
              Обновить список
            </button>
          </div>
        </div>
      </div>

      <div className="pg-card p-6">
        <div className="text-sm font-semibold text-slate-900">Перевозчики</div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {state.carriers.map((c) => (
            <div key={c.id} className="rounded-2xl border border-slate-100 bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="font-semibold text-slate-900">{c.name}</div>
                <div className="text-xs font-semibold text-slate-700">
                  от {c.priceFromRub.toLocaleString('ru-RU')} ₽
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                <Star size={14} className="text-amber-500" />
                <span className="font-semibold text-slate-700">{c.rating.toFixed(1)}</span>
                <span>({c.reviews} отзывов)</span>
              </div>
              <div className="mt-3 space-y-2 text-xs text-slate-500">
                {c.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="opacity-70" />
                    <span>{c.phone}</span>
                  </div>
                )}
                {c.website && (
                  <div className="flex items-center gap-2">
                    <Globe size={14} className="opacity-70" />
                    <span>{c.website}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

