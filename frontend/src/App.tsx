import { useLocation } from "react-router-dom"
import { Nav } from "./components/Nav"
import { AppRouter } from "./routers/app.routers"
import { AuthProvider } from "./components/AuthContext"

function App() {
  const location = useLocation()
  const showNav = location.pathname !== "/login" && location.pathname !== "/register"

  return (
    <AuthProvider>
      {showNav && <Nav />}
      <AppRouter />
    </AuthProvider>
  )
}

export default App
