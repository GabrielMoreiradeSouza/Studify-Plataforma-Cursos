import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cursosService } from "../../services/cursos.service";
import type { CursoResponse, TrilhaResponse } from "../../services/cursos.service";
import { carteiraService } from "../../services/carteira.service";
import { AcessoNegadoModal } from "../../components/AcessoNegadoModal";
import { useAuth } from "../../components/AuthContext";

type Tab = "cursos" | "trilhas";

export const CursosPages = () => {
    const navigate = useNavigate();
    const { role } = useAuth();
    const [tab, setTab] = useState<Tab>("cursos");
    const [cursos, setCursos] = useState<CursoResponse[]>([]);
    const [trilhas, setTrilhas] = useState<TrilhaResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const handleCourseClick = async (courseId: string, trilhaId?: string) => {
        const target = trilhaId ? `/cursos/${courseId}?trilhaId=${trilhaId}` : `/cursos/${courseId}`;
        if (role === "ADMIN") {
            navigate(target);
            return;
        }
        try {
            const ativa = await carteiraService.possuiAssinaturaAtiva();
            if (ativa) {
                navigate(target);
            } else {
                setShowModal(true);
            }
        } catch {
            setShowModal(true);
        }
    };

    useEffect(() => {
        setLoading(true);
        if (tab === "cursos") {
            cursosService.listAll()
                .then(setCursos)
                .catch(() => {})
                .finally(() => setLoading(false));
        } else {
            cursosService.listTrilhas()
                .then(setTrilhas)
                .catch(() => {})
                .finally(() => setLoading(false));
        }
    }, [tab]);

    const tabStyle = (active: boolean): React.CSSProperties => ({
        color: active ? "#fff" : "#9a9a9a",
        backgroundColor: active ? "#295bf1" : "transparent",
        fontWeight: active ? 600 : 400,
        cursor: "pointer",
        border: "none",
        padding: "10px 16px",
        borderRadius: "8px",
        textAlign: "left" as const,
        width: "100%",
        fontSize: "14px",
    });

    return (
        <div className="d-flex" style={{ backgroundColor: "#121214", minHeight: "100vh" }}>
            <div className="d-flex flex-column align-items-center p-3" style={{ width: "220px", flexShrink: 0 }}>
                <div
                    className="d-flex flex-column p-4"
                    style={{
                        width: "100%",
                        backgroundColor: "#1e2124",
                        border: "1px solid #2a2d33",
                        borderRadius: 2,
                    }}
                >
                    <h5 className="text-white mb-4" style={{ fontWeight: 600 }}>Explorar</h5>
                    <nav className="d-flex flex-column gap-2">
                        <button
                            style={tabStyle(tab === "cursos")}
                            onClick={() => setTab("cursos")}
                        >
                            Cursos
                        </button>
                        <button
                            style={tabStyle(tab === "trilhas")}
                            onClick={() => setTab("trilhas")}
                        >
                            Trilhas
                        </button>
                    </nav>
                </div>
            </div>
            <div className="flex-grow-1 p-4" style={{ overflow: "auto" }}>
                <div className="container">
                    {loading ? (
                        <p className="text-white">Carregando...</p>
                    ) : tab === "cursos" ? (
                        <>
                            <h3 className="text-white mb-1" style={{ fontWeight: 600 }}>Cursos</h3>
                            <p className="mb-4" style={{ color: "#9a9a9a" }}>Escolha um curso para começar a aprender</p>
                            {cursos.length === 0 ? (
                                <p style={{ color: "#9a9a9a" }}>Nenhum curso disponível no momento.</p>
                            ) : (
                                <div className="row g-4">
                                    {cursos.map((curso) => (
                                        <div key={curso.idCurso} className="col-12 col-sm-6 col-lg-4 col-xl-3">
                                            <div
                                                className="card h-100"
                                                style={{
                                                    backgroundColor: "#1e2124",
                                                    border: "none",
                                                    borderRadius: "12px",
                                                    cursor: "pointer",
                                                }}
                                                onClick={() => handleCourseClick(curso.idCurso)}
                                            >
                                                {curso.imagemKey ? (
                                                    <img
                                                        src={cursosService.getCourseImageUrl(curso.idCurso)}
                                                        alt={curso.titulo}
                                                        style={{
                                                            height: "160px",
                                                            width: "100%",
                                                            objectFit: "cover",
                                                            borderRadius: "12px 12px 0 0",
                                                        }}
                                                    />
                                                ) : (
                                                    <div
                                                        className="d-flex align-items-center justify-content-center"
                                                        style={{
                                                            height: "160px",
                                                            backgroundColor: "#2a2d33",
                                                            borderRadius: "12px 12px 0 0",
                                                        }}
                                                    >
                                                        <span style={{ fontSize: "3rem", color: "#4a4d54" }}>🎬</span>
                                                    </div>
                                                )}
                                                <div className="card-body d-flex flex-column">
                                                    <h6 className="text-white mb-1">{curso.titulo}</h6>
                                                    <small style={{ color: "#9a9a9a" }} className="mb-2">{curso.descricao}</small>
                                                    <div className="mt-auto">
                                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                                            <small style={{ color: "#6a6a6a" }}>
                                                                {curso.totalAulas || 0} aulas
                                                            </small>
                                                            <span
                                                                className="badge"
                                                                style={{
                                                                    backgroundColor:
                                                                        curso.nivel === "iniciante" ? "#4ade80" :
                                                                        curso.nivel === "intermediario" ? "#f8cb00" : "#fe7d13",
                                                                    color: "#000",
                                                                    fontWeight: 500,
                                                                }}
                                                            >
                                                                {curso.nivel}
                                                            </span>
                                                        </div>
                                                        <small style={{ color: "#6a6a6a" }}>
                                                            {curso.nomeCategoria}
                                                        </small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <h3 className="text-white mb-1" style={{ fontWeight: 600 }}>Trilhas</h3>
                            <p className="mb-4" style={{ color: "#9a9a9a" }}>Trilhas de cursos para aprendizado guiado</p>
                            {trilhas.length === 0 ? (
                                <p style={{ color: "#9a9a9a" }}>Nenhuma trilha disponível no momento.</p>
                            ) : (
                                <div className="row g-4">
                                    {trilhas.map((trilha) => (
                                        <div key={trilha.idTrilha} className="col-12 col-sm-6 col-lg-4 col-xl-3">
                                            <div
                                                className="card h-100"
                                                style={{
                                                    backgroundColor: "#1e2124",
                                                    border: "none",
                                                    borderRadius: "12px",
                                                    cursor: "pointer",
                                                }}
                                                onClick={() => {
                                                    if (trilha.cursos && trilha.cursos.length > 0) {
                                                        handleCourseClick(trilha.cursos[0].idCurso, trilha.idTrilha);
                                                    }
                                                }}
                                            >
                                                {trilha.imagemKey ? (
                                                    <img
                                                        src={cursosService.getTrilhaImageUrl(trilha.idTrilha)}
                                                        alt={trilha.titulo}
                                                        style={{
                                                            height: "160px",
                                                            width: "100%",
                                                            objectFit: "cover",
                                                            borderRadius: "12px 12px 0 0",
                                                        }}
                                                    />
                                                ) : (
                                                    <div
                                                        className="d-flex align-items-center justify-content-center"
                                                        style={{
                                                            height: "160px",
                                                            backgroundColor: "#2a2d33",
                                                            borderRadius: "12px 12px 0 0",
                                                        }}
                                                    >
                                                        <span style={{ fontSize: "1.5rem", color: "#4a4d54", fontWeight: 300 }}>Trilha</span>
                                                    </div>
                                                )}
                                                <div className="card-body d-flex flex-column">
                                                    <h6 className="text-white mb-1">{trilha.titulo}</h6>
                                                    <small style={{ color: "#9a9a9a" }} className="mb-2">{trilha.descricao}</small>
                                                    <div className="mt-auto">
                                                        <small style={{ color: "#6a6a6a" }}>
                                                            {trilha.totalCursos} cursos &middot; {trilha.nomeCategoria}
                                                        </small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
            <AcessoNegadoModal show={showModal} onClose={() => setShowModal(false)} />
        </div>
    );
};
