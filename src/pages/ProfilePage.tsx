import { useMemo, useState } from 'react'
import { clsx } from 'clsx'
import { usePackGo } from '../app/state/store'

function Toggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean
  onChange: (next: boolean) => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={clsx(
        'relative inline-flex h-6 w-11 items-center rounded-full transition',
        disabled && 'opacity-50',
        checked ? 'bg-[color:var(--pg-primary)]' : 'bg-slate-200',
      )}
      aria-pressed={checked}
    >
      <span
        className={clsx(
          'inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition',
          checked ? 'translate-x-5' : 'translate-x-1',
        )}
      />
    </button>
  )
}

export function ProfilePage() {
  const { state, actions } = usePackGo()
  const p = state.profile

  const [draftName, setDraftName] = useState(p.name)
  const [draftSurname, setDraftSurname] = useState(p.surname)

  const changed = useMemo(
    () => draftName.trim() !== p.name || draftSurname.trim() !== p.surname,
    [draftName, draftSurname, p.name, p.surname],
  )

  function save() {
    actions.updateProfile({ name: draftName.trim() || p.name, surname: draftSurname.trim() || p.surname })
  }

  return (
    <div className="space-y-6">
      <div className="text-xl font-semibold text-slate-900">Профиль</div>

      <div className="pg-card p-6">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-500 ring-1 ring-slate-900/5">
            <span className="text-sm font-semibold">
              {p.name.slice(0, 1)}
              {p.surname.slice(0, 1)}
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-slate-900">
              {p.name} {p.surname}
            </div>
            <div className="text-xs text-slate-400">{p.email}</div>
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          <div className="grid gap-3 md:grid-cols-[120px_1fr_120px] md:items-center">
            <div className="text-xs font-semibold text-slate-500">Имя</div>
            <input className="pg-input" value={draftName} onChange={(e) => setDraftName(e.target.value)} />
            <button className="pg-btn-secondary md:justify-self-end" onClick={save} disabled={!changed}>
              Изменить
            </button>
          </div>

          <div className="grid gap-3 md:grid-cols-[120px_1fr_120px] md:items-center">
            <div className="text-xs font-semibold text-slate-500">Фамилия</div>
            <input
              className="pg-input"
              value={draftSurname}
              onChange={(e) => setDraftSurname(e.target.value)}
            />
            <button className="pg-btn-secondary md:justify-self-end" onClick={save} disabled={!changed}>
              Изменить
            </button>
          </div>

          <div className="grid gap-3 md:grid-cols-[120px_1fr_120px] md:items-center">
            <div className="text-xs font-semibold text-slate-500">Email</div>
            <div className="text-sm text-slate-700">{p.email}</div>
            <button className="pg-btn-secondary md:justify-self-end" disabled>
              Изменить
            </button>
          </div>

          <div className="grid gap-3 md:grid-cols-[120px_1fr_120px] md:items-center">
            <div className="text-xs font-semibold text-slate-500">Номер телефона</div>
            <div className="text-sm text-slate-700">{p.phone}</div>
            <button className="pg-btn-secondary md:justify-self-end" disabled>
              Изменить
            </button>
          </div>
        </div>
      </div>

      <div className="pg-card p-6">
        <div className="text-sm font-semibold text-slate-900">Уведомления</div>

        <div className="mt-5 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-medium text-slate-800">Email уведомления</div>
              <div className="text-xs text-slate-400">Получать письма о смене статуса</div>
            </div>
            <Toggle
              checked={p.notifications.email}
              onChange={() => actions.toggleNotification('email')}
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-medium text-slate-800">SMS уведомления</div>
              <div className="text-xs text-slate-400">Коробка обновила статус</div>
            </div>
            <Toggle checked={p.notifications.sms} onChange={() => actions.toggleNotification('sms')} />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-medium text-slate-800">Подтверждение номера</div>
              <div className="text-xs text-slate-400">Нужно для получения SMS</div>
            </div>
            <button
              className={clsx(
                'pg-btn-secondary',
                p.notifications.phoneVerified && 'cursor-default opacity-60',
              )}
              onClick={() => actions.verifyPhone()}
              disabled={p.notifications.phoneVerified}
            >
              {p.notifications.phoneVerified ? 'Подтверждено' : 'Подтвердить'}
            </button>
          </div>
        </div>
      </div>

      <div className="pg-card p-6">
        <div className="text-sm font-semibold text-slate-900">Мои переезды</div>
        <div className="mt-4 divide-y divide-slate-100">
          {p.moves.map((m) => (
            <div key={m.id} className="flex items-center justify-between gap-4 py-3">
              <div>
                <div className="text-sm font-medium text-slate-900">{m.title}</div>
                <div className="text-xs text-slate-400">{m.dateRange}</div>
              </div>
              <div className="text-xs font-semibold text-slate-400">{m.archived ? 'Архив →' : 'Подробнее →'}</div>
            </div>
          ))}
        </div>
      </div>

      <button className="pg-btn-secondary w-full border border-red-200 bg-white text-red-600 hover:bg-red-50">
        Выйти из аккаунта
      </button>
    </div>
  )
}

