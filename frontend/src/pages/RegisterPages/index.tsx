import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/auth.service";
import { useAuth } from "../../components/AuthContext";

export default function RegisterPages() {
    const [nome_completo, setNome_completo] = useState("");
    const [email, setEmail] = useState("");
    const [senha_hash, setSenha_hash] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            const response = await authService.register({ nomeCompleto: nome_completo, email, senhaHash: senha_hash });
            login(response.token, response.nomeCompleto, response.email, response.role);
            navigate("/home");
        } catch (err: any) {
            setError(err.message || "Erro ao registrar usuário");
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: "#121214", color: "#fff" }}>
            <form onSubmit={handleSubmit} className="w-100 d-flex flex-column align-items-center" style={{ maxWidth: "400px" }}>

                <img
                    src="/Logo.png"
                    alt="Logo Studify"
                    className="img-fluid"
                    style={{ maxWidth: '250px' }}
                />

                {error && <div className="alert alert-danger w-100">{error}</div>}

                <div className="mb-3 w-100">
                    <label htmlFor="inputText" className="form-label">Nome Completo</label>
                    <input
                        type="text"
                        className="form-control"
                        id="inputText"
                        placeholder="Ex.: João da Silva"
                        value={nome_completo}
                        onChange={(e) => setNome_completo(e.target.value)}
                        required
                    />
                </div>

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
                <button type="submit" className="btn btn-primary w-100">Register</button>
                <p className="mt-3">Já tem uma conta? <a href="/login">Faça login</a></p>
            </form>
        </div>
    );
}