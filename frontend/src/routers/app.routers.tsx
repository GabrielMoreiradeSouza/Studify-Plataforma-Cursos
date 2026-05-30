import { Navigate, Route, Routes } from "react-router-dom"
import { HomePages } from "../pages/HomePages"
import { SobrePages } from "../pages/SobrePages"
import { UsuarioPages } from "../pages/UsuarioPages"
import LoginPages from "../pages/LoginPages"
import RegisterPages from "../pages/RegisterPages"


export const AppRouter = () => {
  return (
    <>
        <Routes>
            <Route path="/login" element={<LoginPages />} />
            <Route path="/register" element={<RegisterPages />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/home" element={<HomePages />} />
            <Route path="/sobre" element={<SobrePages />} />
            <Route path="/usuario" element={<UsuarioPages />} />
        </Routes>
    </>
    )
}
