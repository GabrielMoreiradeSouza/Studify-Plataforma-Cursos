import { Navigate, Route, Routes } from "react-router-dom"
import { HomePages } from "../pages/HomePages"
import LoginPages from "../pages/LoginPages"
import RegisterPages from "../pages/RegisterPages"
import { ProtectedRoute } from "../components/AuthContext"


export const AppRouter = () => {
  return (
    <>
        <Routes>
            <Route path="/login" element={<LoginPages />} />
            <Route path="/register" element={<RegisterPages />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/home" element={<HomePages />} />
            </Route>
        </Routes>
    </>
    )
}
