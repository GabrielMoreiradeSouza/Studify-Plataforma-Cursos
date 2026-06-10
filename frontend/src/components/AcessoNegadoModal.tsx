import { useNavigate } from "react-router-dom";

interface Props {
    show: boolean;
    onClose: () => void;
}

export const AcessoNegadoModal = ({ show, onClose }: Props) => {
    const navigate = useNavigate();

    if (!show) return null;

    return (
        <div
            className="d-flex align-items-center justify-content-center"
            style={{
                position: "fixed",
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: "rgba(0,0,0,0.7)",
                zIndex: 9999,
            }}
            onClick={onClose}
        >
            <div
                className="card p-4 text-center"
                style={{
                    backgroundColor: "#1e2124",
                    border: "1px solid #2a2d33",
                    borderRadius: 12,
                    maxWidth: 420,
                    width: "90%",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-3" style={{ color: "#e74c3c" }}>
                    <i className="bi bi-lock-fill" style={{ fontSize: 40 }}></i>
                </div>
                <h5 className="text-white mb-2" style={{ fontWeight: 600 }}>
                    Conteúdo Bloqueado
                </h5>
                <p className="mb-4" style={{ color: "#9a9a9a", fontSize: 14 }}>
                    Você precisa adquirir um plano para acessar este conteúdo.
                    Escolha o plano ideal para você na página de inscrição.
                </p>
                <div className="d-flex gap-2 justify-content-center">
                    <button
                        className="btn"
                        style={{ backgroundColor: "#295bf1", color: "#fff", fontWeight: 600 }}
                        onClick={() => { onClose(); navigate("/inscrever"); }}
                    >
                        Ver Planos
                    </button>
                    <button
                        className="btn"
                        style={{ backgroundColor: "#2a2d33", color: "#fff" }}
                        onClick={onClose}
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
};
