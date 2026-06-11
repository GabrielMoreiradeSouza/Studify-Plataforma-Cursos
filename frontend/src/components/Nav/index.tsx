import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useState } from "react";

export const Nav = () => {
    const { isAuthenticated, nomeCompleto, role, logout } = useAuth();
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const primeiroNome = nomeCompleto ? nomeCompleto.split(" ")[0] : "Usuário";

    return (
        <>
            <div className="d-flex justify-content-between align-items-center bg-dark px-3 py-2 text-white">
                <Link to="/home">
                    <img
                        src="/LogoName.png"
                        alt="Logo Studify"

                    />
                </Link>
                <ul className="nav ms-auto align-items-center">
                    <li className="nav-item">
                        <Link className="nav-link text-white" to="/cursos">Cursos</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link text-white" to="/inscrever">Inscreva-se</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link text-white" to="/sobre">Contato</Link>
                    </li>
                    {isAuthenticated && role === "ADMIN" && (
                        <li className="nav-item">
                            <Link className="nav-link text-white" to="/admin">Admin</Link>
                        </li>
                    )}
                    {isAuthenticated && (
                        <li className="nav-item ms-2 position-relative">
                            <div 
                                className="px-3 py-1 bg-secondary text-white" 
                                style={{ borderRadius: '4px', cursor: 'pointer' }}
                                onClick={() => setShowDropdown(!showDropdown)}
                            >
                                {primeiroNome}
                            </div>
                            {showDropdown && (
                                <div className="position-absolute bg-white text-dark shadow rounded mt-1" style={{ right: 0, minWidth: '130px', zIndex: 1000 }}>
                                    <button
                                        className="btn btn-link text-decoration-none text-dark w-100 text-start px-3 py-2"
                                        onClick={() => { setShowDropdown(false); navigate("/perfil"); }}
                                    >
                                        Ver Perfil
                                    </button>
                                    <button 
                                        className="btn btn-link text-decoration-none text-dark w-100 text-start px-3 py-2"
                                        onClick={handleLogout}
                                    >
                                        Sair
                                    </button>
                                </div>
                            )}
                        </li>
                    )}
                </ul>
            </div>
        </>
    );
}