import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Package } from 'lucide-react'
import { statusLabel, usePackGo } from '../app/state/store'

function useQuery() {
  const { search } = useLocation()
  return useMemo(() => new URLSearchParams(search), [search])
}

export function ScannerPage() {
  const { state, actions } = usePackGo()
  const q = useQuery()
  const nav = useNavigate()
  const initial = q.get('box') ?? ''
  const [value, setValue] = useState(initial)

  const box = useMemo(() => state.boxes.find((b) => b.id === value.trim()), [state.boxes, value])

  function markUnpacked() {
    if (!box) return
    actions.setBoxStatus(box.id, 'unpacked')
  }

  return (
    <div className="grid min-h-[640px] place-items-center">
      <div className="w-full max-w-[520px] text-center">
        <div className="mx-auto grid h-72 w-72 place-items-center rounded-3xl bg-slate-900/10">
          <div className="h-44 w-44 rounded-3xl bg-white/40 ring-1 ring-white/40" />
        </div>

        <div className="mx-auto -mt-6 w-full max-w-[440px] rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-900/5">
          <input
            className="pg-input text-center"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Введите номер коробки"
          />

          {box && (
            <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-left ring-1 ring-slate-900/5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-900">Коробка найдена!</div>
                  <div className="text-sm font-semibold text-slate-900">{box.title}</div>
                  <div className="mt-1 text-xs text-slate-500">{box.itemsPreview}</div>
                  {box.fragile && <div className="mt-2 text-xs text-amber-600">▲ Хрупкое</div>}
                </div>
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-white ring-1 ring-slate-900/5">
                  <Package size={18} className="text-slate-700" />
                </div>
              </div>
              <div className="mt-3 text-xs font-semibold text-slate-500">
                Статус: <span className="text-slate-700">{statusLabel(box.status)}</span>
              </div>
            </div>
          )}

          {box ? (
            <div className="mt-4 grid gap-2">
              <button className="pg-btn-primary w-full" onClick={markUnpacked}>
                Отметить распакованной
              </button>
              <button className="pg-btn-secondary w-full" onClick={() => nav('/dashboard')}>
                На главную
              </button>
            </div>
          ) : (
            <div className="mt-4 text-xs text-slate-400">
              Подсказка: вставьте `id` коробки из QR (например: <span className="font-mono">box_1</span>)
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

