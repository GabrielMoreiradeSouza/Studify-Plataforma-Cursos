import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cursosService } from "../../services/cursos.service";
import type { CursoResponse } from "../../services/cursos.service";

export const CursosPages = () => {
    const [cursos, setCursos] = useState<CursoResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        cursosService.listAll()
            .then(setCursos)
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div style={{ backgroundColor: "#121214", minHeight: "100vh" }} className="d-flex justify-content-center align-items-center">
                <p className="text-white">Carregando cursos...</p>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: "#121214", minHeight: "100vh" }} className="p-4">
            <div className="container">
                <h3 className="text-white mb-1" style={{ fontWeight: 600 }}>Cursos</h3>
                <p className="mb-4" style={{ color: "#9a9a9a" }}>Escolha um curso para começar a aprender</p>

                {cursos.length === 0 ? (
                    <p className="text-muted">Nenhum curso disponível no momento.</p>
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
                                    onClick={() => navigate(`/cursos/${curso.idCurso}`)}
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
            </div>
        </div>
    );
};
