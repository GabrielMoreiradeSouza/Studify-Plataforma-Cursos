import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/AuthContext";
import { authService } from "../../services/auth.service";

export default function LoginPages() {
    const [email, setEmail] = useState("");
    const [senha_hash, setSenha_hash] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            const response = await authService.login({ email, senhaHash: senha_hash });
            login(response.token, response.nomeCompleto, response.role);
            navigate("/home");
        } catch (err: any) {
            setError(err.message || "Erro ao fazer login");
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <form onSubmit={handleSubmit} className="w-100 d-flex flex-column align-items-center" style={{ maxWidth: "400px" }}>

                <img
                    src="/Logo.png"
                    alt="Logo Studify"
                    className="img-fluid"
                    style={{ maxWidth: '250px' }}
                />

                {error && <div className="alert alert-danger w-100">{error}</div>}

                <div className="mb-3 w-100">
                    <label htmlFor="inputEmail" className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        id="inputEmail"
                        placeholder="Ex.: joao@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3 w-100">
                    <label htmlFor="inputPassword" className="form-label">Senha</label>
                    <input 
                        type="password" 
                        className="form-control" 
                        id="inputPassword" 
                        placeholder="Ex.: joao123" 
                        value={senha_hash}
                        onChange={(e) => setSenha_hash(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100">Login</button>
                <p className="mt-3">Não tem uma conta? <a href="/register">Registre-se</a></p>
            </form>
        </div>
    );
}