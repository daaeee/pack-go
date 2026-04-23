import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './app/layout/AppLayout'
import { DashboardPage } from './pages/DashboardPage'
import { BoxesPage } from './pages/BoxesPage'
import { LogisticsPage } from './pages/LogisticsPage'
import { ScannerPage } from './pages/ScannerPage'
import { ProfilePage } from './pages/ProfilePage'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/boxes" element={<BoxesPage />} />
        <Route path="/logistics" element={<LogisticsPage />} />
        <Route path="/scanner" element={<ScannerPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
