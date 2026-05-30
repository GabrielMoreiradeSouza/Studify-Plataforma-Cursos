import { Link } from "react-router-dom";


export const Nav = () => {
    return (
        <>
            <div className="d-flex justify-content-between align-items-center bg-dark px-3 py-2 text-white">
                <Link to="/home">
                    <img
                        src="/LogoName.png"
                        alt="Logo Studify"

                    />
                </Link>
                <ul className="nav ms-auto">
                    <li className="nav-item">
                        <Link className="nav-link text-white" to="/">Cursos</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link text-white" to="/planos">Inscreva-se</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link text-white" to="/sobre">Contato</Link>
                    </li>
                </ul>
            </div>
        </>
    );
}