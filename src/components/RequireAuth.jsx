import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from './AuthProvider'

export default function RequireAuth({ children }) {
  const { currentUser } = useContext(AuthContext)
  if (!currentUser) {
    return <Navigate to="/login" replace />
  }
  return children
}
