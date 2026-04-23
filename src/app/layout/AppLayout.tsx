import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'

export function AppLayout() {
  return (
    <div className="min-h-full bg-[color:var(--pg-bg)]">
      <div className="mx-auto flex w-full max-w-[1200px] gap-6 px-6 py-6">
        <Sidebar />
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

