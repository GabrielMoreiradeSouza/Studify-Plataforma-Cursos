import { useAuth } from "../../components/AuthContext"

export const SobrePages = () => {
    const { nomeCompleto, email } = useAuth()

    return (
        <div style={{ backgroundColor: "#121214", minHeight: "100vh" }}>
            <style>{`.form-control::placeholder { color: #9a9a9a !important; }`}</style>
            <div className="d-flex justify-content-center py-5">
                <div className="card p-4" style={{ width: "100%", maxWidth: "540px", backgroundColor: "#1e2124", border: "none", borderRadius: "12px" }}>
                    <h4 className="text-white mb-4" style={{ fontWeight: 600 }}>Tire Suas Dúvidas</h4>
                    <form>
                        <div className="mb-3">
                            <label className="form-label text-white">Nome</label>
                            <input
                                type="text"
                                className="form-control"
                                style={{ backgroundColor: "#2a2d33", border: "none", color: "#fff" }}
                                defaultValue={nomeCompleto || ""}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label text-white">E-mail</label>
                            <input
                                type="email"
                                className="form-control"
                                style={{ backgroundColor: "#2a2d33", border: "none", color: "#fff" }}
                                defaultValue={email || ""}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label text-white">Mensagem</label>
                            <textarea
                                className="form-control"
                                rows={5}
                                style={{ backgroundColor: "#2a2d33", border: "none", color: "#fff", resize: "vertical" }}
                                placeholder="Digite sua mensagem..."
                            />
                        </div>
                        <button type="submit" className="btn w-100" style={{ backgroundColor: "#295bf1", color: "#fff", fontWeight: 600 }}>
                            Enviar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
