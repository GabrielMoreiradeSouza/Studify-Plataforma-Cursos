import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { cursosService } from "../../services/cursos.service";
import type { CursoResponse, LessonResponse, ProgressoResponse, TrilhaResponse } from "../../services/cursos.service";
import { carteiraService } from "../../services/carteira.service";
import { AcessoNegadoModal } from "../../components/AcessoNegadoModal";
import { Accordion } from "../../components/Accordion";
import { useAuth } from "../../components/AuthContext";

export const Player = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const navigate = useNavigate();
    const videoRef = useRef<HTMLVideoElement>(null);
    const { role } = useAuth();
    const [searchParams] = useSearchParams();
    const trilhaId = searchParams.get('trilhaId') || undefined;

    const [curso, setCurso] = useState<CursoResponse | null>(null);
    const [trilha, setTrilha] = useState<TrilhaResponse | null>(null);
    const [lessons, setLessons] = useState<LessonResponse[]>([]);
    const [progresso, setProgresso] = useState<ProgressoResponse[]>([]);
    const [allLessons, setAllLessons] = useState<Map<string, LessonResponse[]>>(new Map());
    const [allProgresso, setAllProgresso] = useState<Map<string, ProgressoResponse[]>>(new Map());
    const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (!courseId) return;

        setLoading(true);

        const fetchData = async () => {
            const [allCourses, less, prog] = await Promise.all([
                cursosService.listAll(),
                cursosService.listLessons(courseId),
                cursosService.getProgresso(courseId),
            ]);

            const found = allCourses.find((c) => c.idCurso === courseId) || null;
            setCurso(found);
            setLessons(less);
            setProgresso(prog);

            if (less.length > 0) {
                setCurrentLessonId(less[0].idLesson);
            }

            if (trilhaId) {
                try {
                    const t = await cursosService.getTrilha(trilhaId);
                    setTrilha(t);

                    const lessonsMap = new Map<string, LessonResponse[]>();
                    const progressMap = new Map<string, ProgressoResponse[]>();

                    lessonsMap.set(courseId, less);
                    progressMap.set(courseId, prog);

                    const otherCourses = t.cursos.filter((c) => c.idCurso !== courseId);
                    if (otherCourses.length > 0) {
                        const results = await Promise.all(
                            otherCourses.map((c) =>
                                Promise.all([
                                    cursosService.listLessons(c.idCurso).catch(() => [] as LessonResponse[]),
                                    cursosService.getProgresso(c.idCurso).catch(() => [] as ProgressoResponse[]),
                                ])
                            )
                        );
                        otherCourses.forEach((c, i) => {
                            lessonsMap.set(c.idCurso, results[i][0]);
                            progressMap.set(c.idCurso, results[i][1]);
                        });
                    }

                    setAllLessons(lessonsMap);
                    setAllProgresso(progressMap);
                } catch {
                    setTrilha(null);
                }
            }

            return found;
        };

        if (role === "ADMIN") {
            fetchData()
                .catch(() => {})
                .finally(() => setLoading(false));
            return;
        }

        (async () => {
            try {
                const ativa = await carteiraService.possuiAssinaturaAtiva();
                if (!ativa) {
                    setShowModal(true);
                    setLoading(false);
                    return;
                }
                await fetchData();
            } catch {
            } finally {
                setLoading(false);
            }
        })();
    }, [courseId, role, trilhaId]);

    const progressoMap = new Map(progresso.map((p) => [p.idLesson, p]));

    const trilhaTotalAulas = trilha
        ? trilha.cursos.reduce((sum, c) => sum + (c.totalAulas || 0), 0)
        : 0;

    const trilhaCompletadas = trilha
        ? Array.from(allProgresso.entries()).reduce((sum, [, prog]) =>
            sum + prog.filter((p) => p.completado).length, 0)
        : 0;

    const trilhaProgressPercent = trilhaTotalAulas > 0
        ? Math.round((trilhaCompletadas / trilhaTotalAulas) * 100)
        : 0;

    const completedCount = progresso.filter((p) => p.completado).length;
    const totalLessons = lessons.length;
    const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    const currentLesson = lessons.find((l) => l.idLesson === currentLessonId);

    const goToNextCurso = () => {
        if (!trilha || !courseId) return;
        const idx = trilha.cursos.findIndex((c) => c.idCurso === courseId);
        if (idx >= 0 && idx < trilha.cursos.length - 1) {
            const next = trilha.cursos[idx + 1];
            navigate(`/cursos/${next.idCurso}?trilhaId=${trilhaId}`);
        }
    };

    const handleLessonClick = (lessonId: string) => {
        setCurrentLessonId(lessonId);
    };

    const isCompleta = (lessonId: string) => {
        return progressoMap.get(lessonId)?.completado ?? false;
    };

    const needsManualCheck = (lessonId: string) => {
        const prog = progressoMap.get(lessonId);
        return prog === undefined || !prog.completado;
    };

    const completarELancar = async (lessonId: string) => {
        if (!courseId) return;

        try {
            const result = await cursosService.completarAula(courseId, lessonId, trilhaId);
            const completed = result.completado;

            setProgresso((prev) => {
                const updated = prev.filter((p) => p.idLesson !== lessonId);
                updated.push(result);
                return updated;
            });

            setAllProgresso((prev) => {
                const next = new Map(prev);
                const cursoProg = (next.get(courseId!) || []).filter((p) => p.idLesson !== lessonId);
                cursoProg.push(result);
                next.set(courseId!, cursoProg);
                return next;
            });

            if (completed) {
                const currentIdx = lessons.findIndex((l) => l.idLesson === lessonId);
                if (currentIdx >= 0 && currentIdx < lessons.length - 1) {
                    setTimeout(() => setCurrentLessonId(lessons[currentIdx + 1].idLesson), 300);
                } else if (currentIdx >= 0 && lessons.length > 0) {
                    const allDone = progresso.filter((p) => p.idLesson !== lessonId && p.completado).length + 1 >= lessons.length;
                    if (allDone) {
                        setTimeout(() => goToNextCurso(), 500);
                    }
                }
            }
        } catch {
        }
    };

    const handleVideoEnded = () => {
        if (!currentLessonId) return;
        completarELancar(currentLessonId);
    };

    const handleCheckbox = (lessonId: string) => {
        completarELancar(lessonId);
    };

    const isCursoCompleto = (cursoId: string) => {
        const prog = allProgresso.get(cursoId);
        if (!prog) return false;
        const cursoData = trilha?.cursos.find((c) => c.idCurso === cursoId);
        if (!cursoData) return false;
        const total = cursoData.totalAulas || 0;
        return total > 0 && prog.filter((p) => p.completado).length >= total;
    };

    const handleCursoClick = (targetCursoId: string) => {
        if (targetCursoId === courseId) return;
        navigate(`/cursos/${targetCursoId}?trilhaId=${trilhaId}`);
    };

    const handleLessonFromOtherCurso = (targetCursoId: string, lessonId: string) => {
        navigate(`/cursos/${targetCursoId}?trilhaId=${trilhaId}`);
    };

    if (loading) {
        return (
            <div style={{ backgroundColor: "#121214", minHeight: "100vh" }} className="d-flex justify-content-center align-items-center">
                <p className="text-white">Carregando...</p>
            </div>
        );
    }

    if (!curso) {
        return (
            <div style={{ backgroundColor: "#121214", minHeight: "100vh" }} className="d-flex justify-content-center align-items-center flex-column">
                <p className="text-white">Curso não encontrado.</p>
                <button className="btn btn-primary" onClick={() => navigate("/cursos")}>Voltar</button>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: "#121214", minHeight: "100vh" }}>
            <div className="d-flex" style={{ height: "calc(100vh - 57px)" }}>
                <div className="flex-grow-1 d-flex flex-column p-3">
                    <button
                        className="btn btn-sm mb-2"
                        style={{ alignSelf: "flex-start", color: "#9a9a9a", backgroundColor: "#2a2d33", border: "none" }}
                        onClick={() => navigate("/cursos")}
                    >
                        ← Voltar
                    </button>

                    {currentLesson ? (
                        <video
                            ref={videoRef}
                            key={currentLesson.idLesson}
                            className="w-100 rounded"
                            style={{ maxHeight: "75vh", backgroundColor: "#000" }}
                            controls
                            autoPlay
                            onEnded={handleVideoEnded}
                        >
                            <source
                                src={cursosService.getVideoUrl(courseId!, currentLesson.idLesson)}
                                type="video/mp4"
                            />
                        </video>
                    ) : (
                        <div className="d-flex align-items-center justify-content-center flex-grow-1">
                            <p className="text-muted">Nenhuma aula disponível.</p>
                        </div>
                    )}

                    <div className="mt-2">
                        <h5 className="text-white mb-0">{currentLesson?.titulo || curso.titulo}</h5>
                        <small style={{ color: "#9a9a9a" }}>{curso.titulo}</small>
                    </div>
                </div>

                <div
                    className="d-flex flex-column"
                    style={{
                        width: "340px",
                        backgroundColor: "#1e2124",
                        borderLeft: "1px solid #2a2d33",
                        flexShrink: 0,
                    }}
                >
                    <div className="p-3 border-bottom" style={{ borderColor: "#2a2d33" }}>
                        <h6 className="text-white mb-2">
                            {trilha ? `Trilha: ${trilha.titulo}` : "Progresso"}
                        </h6>
                        {trilha ? (
                            <>
                                <div className="progress" style={{ height: "8px", backgroundColor: "#2a2d33" }}>
                                    <div
                                        className="progress-bar"
                                        style={{
                                            width: `${trilhaProgressPercent}%`,
                                            backgroundColor: "#295bf1",
                                            transition: "width 0.3s ease",
                                        }}
                                    />
                                </div>
                                <small style={{ color: "#9a9a9a" }}>
                                    {trilhaCompletadas} de {trilhaTotalAulas} aulas concluídas
                                </small>
                            </>
                        ) : (
                            <>
                                <div className="progress" style={{ height: "8px", backgroundColor: "#2a2d33" }}>
                                    <div
                                        className="progress-bar"
                                        style={{
                                            width: `${progressPercent}%`,
                                            backgroundColor: "#295bf1",
                                            transition: "width 0.3s ease",
                                        }}
                                    />
                                </div>
                                <small style={{ color: "#9a9a9a" }}>{completedCount} de {totalLessons} aulas concluídas</small>
                            </>
                        )}
                    </div>

                    <div className="flex-grow-1 overflow-auto p-3">
                        {trilha ? (
                            <Accordion
                                defaultExpanded={[courseId!]}
                                items={trilha.cursos.map((c, idx) => {
                                    const isActive = c.idCurso === courseId;
                                    const completo = isCursoCompleto(c.idCurso);
                                    const cursoLessons = allLessons.get(c.idCurso) || [];
                                    const cursoProgresso = allProgresso.get(c.idCurso) || [];
                                    const cursoProgressoMap = new Map(cursoProgresso.map((p) => [p.idLesson, p]));

                                    return {
                                        id: c.idCurso,
                                        titulo: (
                                            <>
                                                <span
                                                    style={{
                                                        width: 20,
                                                        height: 20,
                                                        borderRadius: "50%",
                                                        backgroundColor: completo ? "#4ade80" : isActive ? "#295bf1" : "#3a3d44",
                                                        display: "inline-flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        fontSize: 11,
                                                        fontWeight: 700,
                                                        color: "#fff",
                                                        flexShrink: 0,
                                                    }}
                                                >
                                                    {completo ? "✓" : idx + 1}
                                                </span>
                                                <span className="text-white small" style={{ fontWeight: isActive ? 600 : 400 }}>
                                                    {c.titulo}
                                                </span>
                                            </>
                                        ),
                                        conteudo: cursoLessons.length === 0 ? (
                                            <p className="text-muted small mb-0">Nenhuma aula</p>
                                        ) : (
                                            <div className="d-flex flex-column gap-1">
                                                {cursoLessons.map((lesson) => {
                                                    const completa = cursoProgressoMap.get(lesson.idLesson)?.completado ?? false;
                                                    const ativa = lesson.idLesson === currentLessonId && isActive;
                                                    return (
                                                        <div
                                                            key={lesson.idLesson}
                                                            role="button"
                                                            tabIndex={0}
                                                            className="d-flex align-items-center gap-2 px-2 py-1 rounded"
                                                            style={{
                                                                cursor: "pointer",
                                                                backgroundColor: ativa ? "#2a2d33" : "transparent",
                                                            }}
                                                            onClick={() => {
                                                                if (isActive) {
                                                                    handleLessonClick(lesson.idLesson);
                                                                } else {
                                                                    handleLessonFromOtherCurso(c.idCurso, lesson.idLesson);
                                                                }
                                                            }}
                                                            onKeyDown={(e) => {
                                                                if (e.key === "Enter" || e.key === " ") {
                                                                    if (isActive) {
                                                                        handleLessonClick(lesson.idLesson);
                                                                    } else {
                                                                        handleLessonFromOtherCurso(c.idCurso, lesson.idLesson);
                                                                    }
                                                                }
                                                            }}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                className="form-check-input"
                                                                checked={completa}
                                                                style={{ cursor: "pointer", flexShrink: 0, width: 14, height: 14 }}
                                                                onClick={(e) => e.stopPropagation()}
                                                                onChange={() => {
                                                                handleCheckbox(lesson.idLesson);
                                                            }}
                                                            />
                                                            <div className="flex-grow-1" style={{ minWidth: 0 }}>
                                                                <div
                                                                    className="text-white small"
                                                                    style={{
                                                                        whiteSpace: "nowrap",
                                                                        overflow: "hidden",
                                                                        textOverflow: "ellipsis",
                                                                        fontWeight: ativa ? 600 : 400,
                                                                        fontSize: 12,
                                                                    }}
                                                                >
                                                                    {lesson.ordem && <>{lesson.ordem}. </>}
                                                                    {lesson.titulo}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ),
                                    };
                                })}
                            />
                        ) : (
                            <>
                                <h6 className="text-white mb-3">Aulas</h6>
                                {lessons.length === 0 ? (
                                    <p className="text-muted small">Nenhuma aula cadastrada.</p>
                                ) : (
                                    <div className="d-flex flex-column gap-2">
                                        {lessons.map((lesson) => {
                                            const completa = isCompleta(lesson.idLesson);
                                            const ativa = lesson.idLesson === currentLessonId;
                                            return (
                                                <div
                                                    key={lesson.idLesson}
                                                    role="button"
                                                    tabIndex={0}
                                                    className="d-flex align-items-center gap-2 px-2 py-2 rounded"
                                                    style={{
                                                        cursor: "pointer",
                                                        backgroundColor: ativa ? "#2a2d33" : "transparent",
                                                    }}
                                                    onClick={() => handleLessonClick(lesson.idLesson)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter" || e.key === " ") handleLessonClick(lesson.idLesson);
                                                    }}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        checked={completa}
                                                        style={{ cursor: "pointer", flexShrink: 0 }}
                                                        onClick={(e) => e.stopPropagation()}
                                                        onChange={() => {
                                                            if (needsManualCheck(lesson.idLesson)) {
                                                                handleCheckbox(lesson.idLesson);
                                                            }
                                                        }}
                                                    />
                                                    <div className="flex-grow-1" style={{ minWidth: 0 }}>
                                                        <div
                                                            className="text-white small"
                                                            style={{
                                                                whiteSpace: "nowrap",
                                                                overflow: "hidden",
                                                                textOverflow: "ellipsis",
                                                                fontWeight: ativa ? 600 : 400,
                                                            }}
                                                        >
                                                            {lesson.ordem && <>{lesson.ordem}. </>}
                                                            {lesson.titulo}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
            <AcessoNegadoModal
                show={showModal}
                onClose={() => { setShowModal(false); navigate("/cursos"); }}
            />
        </div>
    );
};
