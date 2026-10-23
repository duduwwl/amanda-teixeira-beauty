import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import Home from './pages/Home'

// Agenda e painel carregam só quando visitados (o Supabase e o Motion não pesam na primeira página).
const BookingPage = lazy(() => import('./features/booking/BookingPage').then((m) => ({ default: m.BookingPage })))
const AdminPage = lazy(() => import('./features/admin/AdminPage'))
const Privacy = lazy(() => import('./pages/Legal').then((m) => ({ default: m.Privacy })))
const Terms = lazy(() => import('./pages/Legal').then((m) => ({ default: m.Terms })))
const NotFound = lazy(() => import('./pages/NotFound'))

const Loading = () => <div className="frame min-h-[80svh] pt-[140px] text-soft" aria-live="polite">Carregando…</div>

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="agendamento" element={<BookingPage />} />
            <Route path="admin" element={<AdminPage />} />
            <Route path="politica-de-privacidade" element={<Privacy />} />
            <Route path="termos" element={<Terms />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
