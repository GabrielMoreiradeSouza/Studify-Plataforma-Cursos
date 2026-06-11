import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { carteiraService, type CarteiraResponse } from "../../services/carteira.service";
import "bootstrap/dist/css/bootstrap.min.css";

const paymentMethods = ["Carteira Virtual", "Pix", "Cartão de Crédito", "Boleto"];

export const InscrevasePages = () => {
    const navigate = useNavigate();
    const [carteira, setCarteira] = useState<CarteiraResponse>({ idUsuario: "", saldo: 500 });

    useEffect(() => {
        carteiraService.getSaldo()
            .then(setCarteira)
            .catch(() => {});
    }, []);

    return (
        <div style={{ backgroundColor: "#1a1a1a", minHeight: "100vh", color: "#fff" }} className="py-5">
            <div className="text-center mb-5">
                <h2 className="fw-bold mb-2">Inscreva-se</h2>
                <hr style={{ width: "40px", borderColor: "#fff", opacity: 1, margin: "0 auto 12px" }} />
                <p className="text-secondary mb-0">Os Planos dão Acesso a Todos os Cursos</p>
            </div>

            <div style={{ position: "fixed", top: 80, left: 24, zIndex: 1000 }}>
                <div className="d-flex align-items-center gap-2 px-3 py-2 rounded" style={{ backgroundColor: "#111", border: "1px solid #2a2a2a" }}>
                    <i className="bi bi-wallet2" style={{ fontSize: 18, color: "#4ade80" }}></i>
                    <strong style={{ color: "#4ade80", fontSize: 16 }}>R$ {carteira.saldo.toFixed(2)}</strong>
                </div>
            </div>

            <div className="container">
                <div className="row justify-content-center g-4 align-items-start">
                    <div className="col-12 col-md-4">
                        <div style={{ backgroundColor: "#111", border: "1px solid #2a2a2a", borderRadius: "8px", overflow: "hidden" }}>
                            <div className="p-4">
                                <h4 className="fw-bold mb-4">Mensal</h4>
                                <ul className="list-unstyled mb-0">
                                    {["1 Mês de Acesso", "Acesso a Todos os Cursos", "Mais de 1600 Aulas", "Certificado de Conclusão"].map((f) => (
                                        <li key={f} className="d-flex justify-content-between align-items-center py-2" style={{ borderBottom: "1px solid #2a2a2a", fontSize: "0.9rem" }}>
                                            <span><span style={{ color: "#888", marginRight: "8px" }}>—</span>{f}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="p-4 text-center" style={{ backgroundColor: "#0d0d0d" }}>
                                <div className="fw-bold mb-3" style={{ fontSize: "2rem" }}>R$ 120</div>
                                <button
                                    className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                                    onClick={() => navigate("/checkout/mensal")}
                                    disabled={carteira.saldo < 120}
                                >
                                    {carteira.saldo < 120 ? "Saldo Insuficiente" : "Assinar Mensal"} <span>›</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-md-4">
                        <div style={{ backgroundColor: "#111", border: "1px solid #444", borderRadius: "8px", overflow: "hidden" }}>
                            <div className="p-4">
                                <h4 className="fw-bold mb-4">Vitalício</h4>
                                <ul className="list-unstyled mb-0">
                                    {["Acesso Vitalício Ilimitado", "Acesso a Todos os Cursos", "Mais de 1600 Aulas", "Certificado de Conclusão", "Suporte Premium", "Download das aulas"].map((f) => (
                                        <li key={f} className="d-flex justify-content-between align-items-center py-2" style={{ borderBottom: "1px solid #2a2a2a", fontSize: "0.9rem" }}>
                                            <span><span style={{ color: "#888", marginRight: "8px" }}>—</span>{f}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="p-4 text-center" style={{ backgroundColor: "#0d0d0d" }}>
                                <div className="text-secondary mb-1" style={{ fontSize: "0.85rem" }}>
                                    de <span style={{ textDecoration: "line-through", color: "#e74c3c" }}>R$ 1.080,00</span> por
                                </div>
                                <div className="text-secondary mb-1" style={{ fontSize: "0.85rem" }}>12x de</div>
                                <div className="fw-bold" style={{ fontSize: "2.4rem", lineHeight: 1.1 }}>R$ 45</div>
                                <div className="text-secondary mt-1 mb-3" style={{ fontSize: "0.85rem" }}>à vista R$ 540,00</div>
                                <button
                                    className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                                    onClick={() => navigate("/checkout/vitalicio")}
                                    disabled={carteira.saldo < 540}
                                >
                                    {carteira.saldo < 540 ? "Saldo Insuficiente" : "Assinar Vitalício"} <span>›</span>
                                </button>
                                <div className="text-secondary mt-2" style={{ fontSize: "0.78rem" }}>Unidades Limitadas</div>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-md-4">
                        <div style={{ backgroundColor: "#111", border: "1px solid #2a2a2a", borderRadius: "8px", overflow: "hidden" }}>
                            <div className="p-4">
                                <h4 className="fw-bold mb-4">Anual</h4>
                                <ul className="list-unstyled mb-0">
                                    {["12 Meses de Acesso", "Acesso a Todos os Cursos", "Mais de 1600 Aulas", "Certificado de Conclusão", "Suporte"].map((f) => (
                                        <li key={f} className="d-flex justify-content-between align-items-center py-2" style={{ borderBottom: "1px solid #2a2a2a", fontSize: "0.9rem" }}>
                                            <span><span style={{ color: "#888", marginRight: "8px" }}>—</span>{f}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="p-4 text-center" style={{ backgroundColor: "#0d0d0d" }}>
                                <div className="text-secondary mb-1" style={{ fontSize: "0.85rem" }}>até 12x de</div>
                                <div className="fw-bold" style={{ fontSize: "2.4rem", lineHeight: 1.1 }}>R$ 39</div>
                                <div className="text-secondary mt-1 mb-3" style={{ fontSize: "0.85rem" }}>à vista R$ 468,00</div>
                                <button
                                    className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                                    onClick={() => navigate("/checkout/anual")}
                                    disabled={carteira.saldo < 468}
                                >
                                    {carteira.saldo < 468 ? "Saldo Insuficiente" : "Assinar Anual"} <span>›</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-5">
                    <div className="d-inline-flex align-items-center gap-3 flex-wrap justify-content-center" style={{ fontSize: "0.9rem", color: "#aaa" }}>
                        {paymentMethods.map((method, i) => (
                            <span key={method} className="d-flex align-items-center gap-2">
                                {i > 0 && <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#555", display: "inline-block" }} />}
                                {method}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
