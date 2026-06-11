import { Navigate, Route, Routes } from "react-router-dom"
import { HomePages } from "../pages/HomePages"
import { CursosPages } from "../pages/CursosPages"
import { Player } from "../pages/CursosPages/Player"
import { AdminPages } from "../pages/AdminPages"
import { CriarCurso } from "../pages/AdminPages/CriarCurso"
import { MeusCursos } from "../pages/AdminPages/MeusCursos"
import { Trilhas } from "../pages/AdminPages/Trilhas"
import LoginPages from "../pages/LoginPages"
import RegisterPages from "../pages/RegisterPages"
import { ProtectedRoute } from "../components/AuthContext"
import { InscrevasePages } from "../pages/InscrevasePages"
import { CheckoutPages } from "../pages/CheckoutPages"
import { SobrePages } from "../pages/SobrePages"
import { PerfilPages } from "../pages/PerfilPages"


export const AppRouter = () => {
  return (
    <>
        <Routes>
            <Route path="/login" element={<LoginPages />} />
            <Route path="/register" element={<RegisterPages />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/home" element={<HomePages />} />
              <Route path="/cursos" element={<CursosPages />} />
              <Route path="/inscrever" element={<InscrevasePages />} />
              <Route path="/sobre" element={<SobrePages />} />
              <Route path="/perfil" element={<PerfilPages />} />
              <Route path="/checkout/:planoId" element={<CheckoutPages />} />
              <Route path="/cursos/:courseId" element={<Player />} />
              <Route path="/admin" element={<AdminPages />}>
                <Route index element={<Navigate to="cursos" replace />} />
                <Route path="cursos" element={<MeusCursos />} />
                <Route path="criar-curso" element={<CriarCurso />} />
                <Route path="trilhas" element={<Trilhas />} />
              </Route>
            </Route>
        </Routes>
    </>
    )
}
