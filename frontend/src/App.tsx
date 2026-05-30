import { useLocation } from "react-router-dom"
import { Nav } from "./components/Nav"
import { AppRouter } from "./routers/app.routers"

function App() {
  const location = useLocation()
  const showNav = location.pathname !== "/login" && location.pathname !== "/register"

  return (
    <>
      {showNav && <Nav />}
      <AppRouter />
    </>
  )
}

export default App
