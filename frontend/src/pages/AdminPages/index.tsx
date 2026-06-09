import { NavLink, Outlet } from "react-router-dom";

export const AdminPages = () => {
    return (
        <div className="d-flex" style={{ minHeight: "100vh", backgroundColor: "#121214" }}>
            <div
                className="d-flex flex-column p-4"
                style={{
                    width: "260px",
                    backgroundColor: "#1e2124",
                    borderRight: "1px solid #2a2d33",
                    flexShrink: 0,
                }}
            >
                <h5 className="text-white mb-4" style={{ fontWeight: 600 }}>Painel Admin</h5>
                <nav className="d-flex flex-column gap-2">
                    <NavLink
                        to="/admin/cursos"
                        className="text-decoration-none px-3 py-2 rounded"
                        style={({ isActive }) => ({
                            color: isActive ? "#fff" : "#9a9a9a",
                            backgroundColor: isActive ? "#295bf1" : "transparent",
                            fontWeight: isActive ? 600 : 400,
                        })}
                    >
                        Meus Cursos
                    </NavLink>
                    <NavLink
                        to="/admin/criar-curso"
                        className="text-decoration-none px-3 py-2 rounded"
                        style={({ isActive }) => ({
                            color: isActive ? "#fff" : "#9a9a9a",
                            backgroundColor: isActive ? "#295bf1" : "transparent",
                            fontWeight: isActive ? 600 : 400,
                        })}
                    >
                        Criar Novo Curso
                    </NavLink>
                </nav>
            </div>
            <div className="flex-grow-1 p-4" style={{ overflow: "auto" }}>
                <Outlet />
            </div>
        </div>
    );
};
