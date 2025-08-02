import { Provider } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './components/AuthProvider'
import RequireAuth from './components/RequireAuth'
import AuthPage from './pages/AuthPage'
import ProfilePage from './pages/ProfilePage'
import store from './store'

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/profile"
        element={
          <RequireAuth>
            <ProfilePage />
          </RequireAuth>
        }
      />
      <Route path="/login" element={<AuthPage />} />
      <Route path="*" element={<AuthPage />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Provider store={store}>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </Provider>
    </AuthProvider>
  )
}
