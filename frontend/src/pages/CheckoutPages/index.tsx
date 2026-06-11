import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { carteiraService, type CarteiraResponse } from "../../services/carteira.service";

const planosData: Record<string, { nome: string; preco: number; duracao: string }> = {
    mensal: { nome: "Mensal", preco: 120, duracao: "1 mês" },
    anual: { nome: "Anual", preco: 468, duracao: "12 meses" },
    vitalicio: { nome: "Vitalício", preco: 540, duracao: "Vitalício" },
};

export const CheckoutPages = () => {
    const { planoId } = useParams<{ planoId: string }>();
    const navigate = useNavigate();

    const [realPlanoId, setRealPlanoId] = useState<string | null>(null);
    const [carteira, setCarteira] = useState<CarteiraResponse>({ idUsuario: "", saldo: 500 });
    const [step, setStep] = useState<"revisao" | "pagamento" | "processando" | "confirmado">("revisao");
    const [error, setError] = useState("");

    const [cardNumber] = useState("1234 5678 9012 3456");
    const [cardName, setCardName] = useState("");

    const plano = planoId ? planosData[planoId] : undefined;

    useEffect(() => {
        if (!plano) { navigate("/inscrever"); return; }
        carteiraService.listPlanos().then((planos) => {
            const found = planos.find((p) => {
                const normalized = p.nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
                return normalized === planoId;
            });
            if (found) setRealPlanoId(found.idPlano);
        }).catch(() => setError("Erro ao carregar planos"));
        carteiraService.getSaldo()
            .then(setCarteira)
            .catch(() => setError("Erro ao carregar saldo"));
    }, [planoId, plano, navigate]);

    const handleConfirmar = async () => {
        if (!plano) return;
        if (!realPlanoId) {
            setError("Plano não encontrado. Tente novamente.");
            return;
        }
        setStep("processando");
        setError("");

        await new Promise((r) => setTimeout(r, 1500));
        try {
            const result = await carteiraService.comprarPlano(realPlanoId);
            setCarteira(result);
            setStep("confirmado");
        } catch (err: any) {
            setError(err.message || "Erro ao processar compra");
            setStep("revisao");
        }
    };

    const saldoInsuficiente = carteira.saldo < (plano?.preco ?? 0);

    if (!plano) return null;

    if (step === "confirmado") {
        return (
            <div style={{ backgroundColor: "#121214", minHeight: "100vh" }} className="d-flex align-items-center justify-content-center p-3">
                <div className="card p-5 text-center" style={{ backgroundColor: "#1e2124", border: "1px solid #2a2d33", borderRadius: 12, maxWidth: 480, width: "100%" }}>
                    <div className="mb-3" style={{ color: "#4ade80" }}>
                        <i className="bi bi-check-circle-fill" style={{ fontSize: 64 }}></i>
                    </div>
                    <h3 className="text-white mb-2" style={{ fontWeight: 700 }}>Compra Confirmada!</h3>
                    <p className="mb-1" style={{ color: "#9a9a9a" }}>
                        Seu plano <strong className="text-white">{plano.nome}</strong> foi ativado com sucesso.
                    </p>
                    <p className="mb-4" style={{ color: "#9a9a9a" }}>
                        Saldo restante: <strong style={{ color: "#4ade80" }}>R$ {carteira.saldo.toFixed(2)}</strong>
                    </p>
                    <div className="d-flex gap-2 justify-content-center">
                        <button
                            className="btn"
                            style={{ backgroundColor: "#295bf1", color: "#fff", fontWeight: 600 }}
                            onClick={() => navigate("/cursos")}
                        >
                            Explorar Cursos
                        </button>
                        <button
                            className="btn"
                            style={{ backgroundColor: "#2a2d33", color: "#fff" }}
                            onClick={() => navigate("/home")}
                        >
                            Ir para Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: "#121214", minHeight: "100vh" }} className="py-5">
            <style>{`.form-control::placeholder { color: #9a9a9a !important; }`}</style>
            <div className="container" style={{ maxWidth: 640 }}>
                <button
                    className="btn btn-sm mb-4"
                    style={{ color: "#9a9a9a", backgroundColor: "#2a2d33", border: "none" }}
                    onClick={() => navigate("/inscrever")}
                >
                    ← Voltar
                </button>

                <div className="card" style={{ backgroundColor: "#1e2124", border: "1px solid #2a2d33", borderRadius: 12 }}>
                    <div className="card-body p-4">
                        <h4 className="text-white mb-1" style={{ fontWeight: 700 }}>Checkout</h4>
                        <p className="mb-4" style={{ color: "#9a9a9a" }}>Revise os detalhes da sua compra</p>

                        {error && <div className="alert alert-danger">{error}</div>}

                        <div className="mb-4 p-3 rounded" style={{ backgroundColor: "#2a2d33" }}>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <span style={{ color: "#9a9a9a" }}>Plano</span>
                                <span className="text-white fw-bold">{plano.nome}</span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <span style={{ color: "#9a9a9a" }}>Duração</span>
                                <span className="text-white">{plano.duracao}</span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <span style={{ color: "#9a9a9a" }}>Valor</span>
                                <span className="text-white fw-bold" style={{ fontSize: 18 }}>R$ {plano.preco.toFixed(2)}</span>
                            </div>
                            <hr style={{ borderColor: "#3a3d43" }} />
                            <div className="d-flex justify-content-between align-items-center">
                                <span style={{ color: "#9a9a9a" }}>Saldo Disponível</span>
                                <span className="text-white">R$ {carteira.saldo.toFixed(2)}</span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center mt-1">
                                <span style={{ color: "#9a9a9a" }}>Saldo após compra</span>
                                <span className={saldoInsuficiente ? "text-danger" : "text-white"}>
                                    {saldoInsuficiente ? "Insuficiente" : `R$ ${(carteira.saldo - plano.preco).toFixed(2)}`}
                                </span>
                            </div>
                        </div>

                        {step === "pagamento" && (
                            <div className="mb-4">
                                <h6 className="text-white mb-3">Dados do Pagamento</h6>
                                <div className="mb-3">
                                    <label className="form-label text-white small">Número do Cartão</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        style={{ backgroundColor: "#2a2d33", border: "none", color: "#fff" }}
                                        value={cardNumber}
                                        onChange={() => {}}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label text-white small">Nome no Cartão</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        style={{ backgroundColor: "#2a2d33", border: "none", color: "#fff" }}
                                        value={cardName}
                                        onChange={(e) => setCardName(e.target.value)}
                                        placeholder="Seu nome completo"
                                    />
                                </div>
                                <div className="row mb-3">
                                    <div className="col">
                                        <label className="form-label text-white small">Validade</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            style={{ backgroundColor: "#2a2d33", border: "none", color: "#fff" }}
                                            defaultValue="12/28"
                                        />
                                    </div>
                                    <div className="col">
                                        <label className="form-label text-white small">CVV</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            style={{ backgroundColor: "#2a2d33", border: "none", color: "#fff" }}
                                            defaultValue="123"
                                        />
                                    </div>
                                </div>
                                <div className="d-flex align-items-center gap-2 mb-3" style={{ color: "#9a9a9a", fontSize: 13 }}>
                                    <i className="bi bi-lock"></i>
                                    <span>Pagamento processado com segurança via Carteira Virtual</span>
                                </div>
                            </div>
                        )}

                        {step === "processando" && (
                            <div className="text-center py-4">
                                <div className="spinner-border text-light mb-3" role="status" />
                                <p className="text-white">Processando seu pagamento...</p>
                            </div>
                        )}

                        <div className="d-flex gap-2">
                            {step === "revisao" && (
                                <>
                                    <button
                                        className="btn flex-grow-1"
                                        style={{ backgroundColor: "#295bf1", color: "#fff", fontWeight: 600 }}
                                        onClick={() => setStep("pagamento")}
                                        disabled={saldoInsuficiente}
                                    >
                                        {saldoInsuficiente ? "Saldo Insuficiente" : "Continuar"}
                                    </button>
                                    <button
                                        className="btn"
                                        style={{ backgroundColor: "#2a2d33", color: "#fff" }}
                                        onClick={() => navigate("/inscrever")}
                                    >
                                        Cancelar
                                    </button>
                                </>
                            )}
                            {step === "pagamento" && (
                                <button
                                    className="btn flex-grow-1"
                                    style={{ backgroundColor: "#4ade80", color: "#000", fontWeight: 600 }}
                                    onClick={handleConfirmar}
                                    disabled={!cardName.trim()}
                                >
                                    Confirmar Pagamento — R$ {plano.preco.toFixed(2)}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
