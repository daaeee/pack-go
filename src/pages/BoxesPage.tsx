import { useMemo, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Camera } from 'lucide-react'
import { usePackGo } from '../app/state/store'
import type { BoxStatus } from '../app/state/types'

export function BoxesPage() {
  const { state, actions } = usePackGo()
  const [roomId, setRoomId] = useState(state.rooms[0]?.id ?? 'kitchen')
  const [itemsPreview, setItemsPreview] = useState('Кастрюли, тарелки, ножи…')
  const [fragile, setFragile] = useState(true)
  const [qrBoxId, setQrBoxId] = useState<string | null>(null)

  const qrValue = useMemo(() => {
    if (!qrBoxId) return ''
    const base = window.location.origin
    return `${base}/scanner?box=${encodeURIComponent(qrBoxId)}`
  }, [qrBoxId])

  function onSave() {
    const title = `Коробка #${state.boxes.length + 1}`
    const id = actions.addBox({
      title,
      roomId,
      itemsPreview: itemsPreview.trim() || '—',
      fragile,
      status: 'packed' satisfies BoxStatus,
    })
    setQrBoxId(id)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="pg-card p-6">
        <div className="text-xl font-semibold text-slate-900">Новая коробка</div>

        <div className="mt-6 grid gap-5">
          <div>
            <div className="pg-label">Комната</div>
            <select
              className="pg-input mt-2"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            >
              {state.rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="pg-label">Что внутри?</div>
            <textarea
              className="pg-input mt-2 min-h-[90px] resize-none"
              value={itemsPreview}
              onChange={(e) => setItemsPreview(e.target.value)}
              placeholder="Кастрюли, тарелки, вещи…"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <div className="pg-label">Фото содержимого</div>
              <div className="text-xs text-slate-400">(необязательно)</div>
            </div>
            <div className="mt-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6">
              <div className="mx-auto grid max-w-[260px] place-items-center gap-2 text-center text-slate-500">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-white ring-1 ring-slate-900/5">
                  <Camera size={18} className="opacity-70" />
                </div>
                <div className="text-sm font-medium text-slate-700">Добавить фото</div>
                <div className="text-xs text-slate-400">PNG, JPG до 5 MB</div>
              </div>
            </div>
          </div>

          <label className="flex items-center gap-3 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={fragile}
              onChange={(e) => setFragile(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-slate-900"
            />
            Хрупкое (осторожно при перевозке)
          </label>

          <button className="pg-btn-primary w-full" onClick={onSave}>
            Сохранить и получить QR-код
          </button>
        </div>
      </div>

      <div className="pg-card p-6">
        <div className="text-sm font-semibold text-slate-900">QR-код коробки</div>
        <div className="mt-4 rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-900/5">
          <div className="mx-auto grid w-full place-items-center">
            {qrValue ? (
              <QRCodeSVG value={qrValue} size={160} />
            ) : (
              <div className="h-[160px] w-[160px] rounded-2xl bg-slate-200/70" />
            )}
          </div>
        </div>
        <div className="mt-3 text-xs text-slate-400">
          {qrValue
            ? 'Сохраните QR-код и наклейте на коробку.'
            : 'Заполните форму и нажмите “Сохранить”, чтобы получить QR.'}
        </div>
      </div>
    </div>
  )
}

