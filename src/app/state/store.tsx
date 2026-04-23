import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type {
  BoxStatus,
  PackGoActions,
  PackGoState,
  PackGoState as PackGoStateShape,
} from './types'

const STORAGE_KEY = 'packgo:v2'

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`
}

function seedState(): PackGoStateShape {
  const rooms = [
    { id: 'kitchen', name: 'Кухня' },
    { id: 'bedroom', name: 'Спальня' },
    { id: 'living', name: 'Гостиная' },
  ]

  return {
    rooms,
    boxes: [],
    carriers: [
      {
        id: 'gruzovichkof',
        name: 'Грузовичкоф',
        priceFromRub: 3900,
        rating: 4.8,
        reviews: 115,
        phone: '+7 800 123-45-67',
        website: 'gruzovichkof.ru',
      },
      {
        id: 'profivozka',
        name: 'ПрофиПеревозка',
        priceFromRub: 2500,
        rating: 4.7,
        reviews: 68,
        phone: '+7 495 123-45-67',
        website: 'profivozka.ru',
      },
      {
        id: 'fastmove',
        name: 'Быстрый Переезд',
        priceFromRub: 3200,
        rating: 4.6,
        reviews: 23,
        phone: '+7 812 123-45-67',
        website: 'bystreepereezd.ru',
      },
      {
        id: 'taxigruz',
        name: 'Такси-Груз',
        priceFromRub: 1900,
        rating: 4.1,
        reviews: 89,
        phone: '+7 000 987-65-43',
        website: 'taksi-gruz.ru',
      },
    ],
    profile: {
      name: 'Анна',
      surname: 'Иванова',
      email: 'anna@example.com',
      phone: '+7 999 123-45-67',
      notifications: {
        email: true,
        sms: false,
        phoneVerified: false,
      },
      moves: [
        { id: 'm1', title: 'Переезд в Москву', dateRange: 'Декабрь — Январь 2025' },
        { id: 'm2', title: 'Переезд на дачу', dateRange: 'Июнь 2024', archived: true },
        { id: 'm3', title: 'Переезд в Сочи', dateRange: 'Май 2024', archived: true },
      ],
    },
  }
}

function loadState(): PackGoState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return seedState()
    return JSON.parse(raw) as PackGoState
  } catch {
    return seedState()
  }
}

function saveState(state: PackGoState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignore
  }
}

type DbBox = {
  id: string
  title: string
  roomId: string
  itemsPreview: string
  fragile: boolean
  status: BoxStatus
  createdAt: string
}

async function invokeIfTauri<T>(command: string, args?: Record<string, unknown>): Promise<T | null> {
  if (!('__TAURI_INTERNALS__' in window)) return null
  const api = await import('@tauri-apps/api/core')
  return api.invoke<T>(command, args)
}

type StoreValue = { state: PackGoState; actions: PackGoActions }

const StoreContext = createContext<StoreValue | null>(null)

export function PackGoProvider(props: { children: React.ReactNode }) {
  const [state, setState] = useState<PackGoState>(() => loadState())

  useEffect(() => {
    saveState(state)
  }, [state])

  useEffect(() => {
    void (async () => {
      const dbBoxes = await invokeIfTauri<DbBox[]>('load_boxes')
      if (!dbBoxes) return
      setState((s) => ({ ...s, boxes: dbBoxes }))
    })()
  }, [])

  const actions = useMemo<PackGoActions>(
    () => ({
      setBoxStatus: (boxId, status) => {
        setState((s) => ({
          ...s,
          boxes: s.boxes.map((b) => (b.id === boxId ? { ...b, status } : b)),
        }))
        void invokeIfTauri('update_box_status', { box_id: boxId, status })
      },
      updateProfile: (patch) => {
        setState((s) => ({ ...s, profile: { ...s.profile, ...patch } }))
      },
      toggleNotification: (key) => {
        setState((s) => ({
          ...s,
          profile: {
            ...s.profile,
            notifications: { ...s.profile.notifications, [key]: !s.profile.notifications[key] },
          },
        }))
      },
      verifyPhone: () => {
        setState((s) => ({
          ...s,
          profile: {
            ...s.profile,
            notifications: { ...s.profile.notifications, phoneVerified: true },
          },
        }))
      },
      addBox: (box) => {
        const id = uid('box')
        const newBox = {
          ...box,
          id,
          createdAt: new Date().toISOString(),
        }
        setState((s) => ({
          ...s,
          boxes: [newBox, ...s.boxes],
        }))
        void invokeIfTauri('add_box', { payload: newBox })
        return id
      },
    }),
    [],
  )

  const value = useMemo(() => ({ state, actions }), [state, actions])
  return <StoreContext.Provider value={value}>{props.children}</StoreContext.Provider>
}

export function usePackGo() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('usePackGo must be used within PackGoProvider')
  return ctx
}

export function statusLabel(status: BoxStatus) {
  switch (status) {
    case 'packed':
      return 'Упакована'
    case 'in_transit':
      return 'У перевозчика'
    case 'delivered':
      return 'Доставлена'
    case 'unpacked':
      return 'Распакована'
  }
}

