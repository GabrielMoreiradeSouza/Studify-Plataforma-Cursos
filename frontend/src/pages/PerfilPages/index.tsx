import { useEffect, useState } from "react";
import { gamificacaoService, type PerfilResponse } from "../../services/gamificacao.service";
import { certificadoService, type CertificadoResponse } from "../../services/certificado.service";

export const PerfilPages = () => {
    const [perfil, setPerfil] = useState<PerfilResponse | null>(null);
    const [certificados, setCertificados] = useState<CertificadoResponse[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            gamificacaoService.getPerfil(),
            certificadoService.listar(),
        ])
            .then(([p, certs]) => {
                setPerfil(p);
                setCertificados(certs);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ backgroundColor: "#121214", minHeight: "100vh" }}>
                <p className="text-white">Carregando...</p>
            </div>
        );
    }

    if (!perfil) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ backgroundColor: "#121214", minHeight: "100vh" }}>
                <p className="text-white">Erro ao carregar perfil.</p>
            </div>
        );
    }

    const pontosNoNivel = perfil.pontos % 50;
    const progressoPercent = (pontosNoNivel / 50) * 100;

    return (
        <div style={{ backgroundColor: "#121214", minHeight: "100vh" }}>
            <div className="d-flex justify-content-center py-5">
                <div style={{ width: "100%", maxWidth: "600px" }}>
                    <div className="card p-4 mb-4" style={{ backgroundColor: "#1e2124", border: "none", borderRadius: "12px" }}>
                        <div className="d-flex align-items-center justify-content-between mb-4">
                            <div>
                                <h4 className="text-white mb-1" style={{ fontWeight: 600 }}>{perfil.nomeCompleto}</h4>
                                <p style={{ color: "#9a9a9a", margin: 0 }}>{perfil.email}</p>
                            </div>
                            <img
                                src="/SeuNivel.png"
                                alt="Nível"
                                style={{ width: "96px", objectFit: "contain" }}
                            />
                        </div>

                        <div className="mb-3">
                            <div className="d-flex justify-content-between mb-1">
                                <span className="text-white" style={{ fontWeight: 600 }}>Nível {perfil.nivel}</span>
                                <span style={{ color: "#9a9a9a" }}>{perfil.pontos} pts</span>
                            </div>
                            <div className="progress" style={{ height: "12px", backgroundColor: "#2a2d33", borderRadius: "6px" }}>
                                <div
                                    className="progress-bar"
                                    style={{
                                        width: `${progressoPercent}%`,
                                        backgroundColor: "#295bf1",
                                        borderRadius: "6px",
                                        transition: "width 0.3s ease",
                                    }}
                                />
                            </div>
                            <div className="d-flex justify-content-between mt-1">
                                <small style={{ color: "#6c757d" }}>{pontosNoNivel} / 50 pts</small>
                                <small style={{ color: "#6c757d" }}>Próximo nível: {50 - pontosNoNivel} pts</small>
                            </div>
                        </div>
                    </div>

                    <div className="card p-4 mb-4" style={{ backgroundColor: "#1e2124", border: "none", borderRadius: "12px" }}>
                        <div className="d-flex align-items-center gap-3 mb-4">
                            <img
                                src="/Conquistas.png"
                                alt="Conquistas"
                                style={{ width: "28px", objectFit: "contain" }}
                            />
                            <h5 className="text-white mb-0" style={{ fontWeight: 600 }}>Conquistas</h5>
                        </div>

                        {perfil.conquistas.length === 0 ? (
                            <p style={{ color: "#9a9a9a" }}>Nenhuma conquista disponível.</p>
                        ) : (
                            <div className="d-flex gap-4 flex-wrap">
                                {perfil.conquistas.map((c) => (
                                    <div key={c.idConquista} className="d-flex flex-column align-items-center" style={{ width: "80px" }}>
                                        <div
                                            className="d-flex align-items-center justify-content-center"
                                            style={{
                                                width: "56px",
                                                height: "56px",
                                                borderRadius: "50%",
                                                backgroundColor: c.desbloqueada ? "#295bf1" : "#2a2d33",
                                                border: c.desbloqueada ? "3px solid #295bf1" : "3px solid #3a3d44",
                                                opacity: c.desbloqueada ? 1 : 0.4,
                                            }}
                                        >
                                            <img
                                                src="/Conquistas.png"
                                                alt={c.nome}
                                                style={{
                                                    width: "28px",
                                                    objectFit: "contain",
                                                    filter: c.desbloqueada ? "none" : "grayscale(1)",
                                                }}
                                            />
                                        </div>
                                        <span className="text-center mt-2" style={{ color: "#9a9a9a", fontSize: "12px", lineHeight: 1.2 }}>
                                            {c.nome}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {certificados.length > 0 && (
                        <div className="card p-4" style={{ backgroundColor: "#1e2124", border: "none", borderRadius: "12px" }}>
                            <h5 className="text-white mb-3" style={{ fontWeight: 600 }}>Certificados</h5>
                            <div className="d-flex flex-column gap-2">
                                {certificados.map((cert) => (
                                    <div
                                        key={cert.idCertificado}
                                        className="d-flex align-items-center justify-content-between p-3 rounded"
                                        style={{ backgroundColor: "#2a2d33" }}
                                    >
                                        <div>
                                            <div className="text-white" style={{ fontWeight: 500 }}>
                                                {cert.nomeTrilha || cert.nomeCurso}
                                            </div>
                                            <small style={{ color: "#9a9a9a" }}>
                                                {cert.nomeTrilha ? "Trilha" : "Curso"}
                                            </small>
                                        </div>
                                        <button
                                            className="btn btn-sm"
                                            style={{ backgroundColor: "#295bf1", color: "#fff", border: "none" }}
                                            onClick={() => certificadoService.visualizarHtml(cert.idCertificado)}
                                        >
                                            Visualizar
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
