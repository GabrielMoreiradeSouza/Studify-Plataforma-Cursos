import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { cursosService } from "../../services/cursos.service";
import type { CursoResponse, LessonResponse, ProgressoResponse } from "../../services/cursos.service";

export const Player = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const navigate = useNavigate();
    const videoRef = useRef<HTMLVideoElement>(null);

    const [curso, setCurso] = useState<CursoResponse | null>(null);
    const [lessons, setLessons] = useState<LessonResponse[]>([]);
    const [progresso, setProgresso] = useState<ProgressoResponse[]>([]);
    const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!courseId) return;
        Promise.all([
            cursosService.listAll(),
            cursosService.listLessons(courseId),
            cursosService.getProgresso(courseId),
        ])
            .then(([all, less, prog]) => {
                const found = all.find((c) => c.idCurso === courseId) || null;
                setCurso(found);
                setLessons(less);
                setProgresso(prog);
                if (less.length > 0) {
                    setCurrentLessonId(less[0].idLesson);
                }
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [courseId]);

    const progressoMap = new Map(progresso.map((p) => [p.idLesson, p]));

    const completedCount = progresso.filter((p) => p.completado).length;
    const totalLessons = lessons.length;
    const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    const currentLesson = lessons.find((l) => l.idLesson === currentLessonId);

    const handleLessonClick = (lessonId: string) => {
        setCurrentLessonId(lessonId);
    };

    const handleVideoEnded = async () => {
        if (!currentLessonId || !courseId) return;
        const already = progressoMap.get(currentLessonId);
        if (already?.completado) return;

        try {
            const result = await cursosService.completarAula(courseId, currentLessonId);
            setProgresso((prev) => {
                const filtered = prev.filter((p) => p.idLesson !== currentLessonId);
                return [...filtered, result];
            });
        } catch {
        }
    };

    const isCompleta = (lessonId: string) => {
        return progressoMap.get(lessonId)?.completado ?? false;
    };

    const needsManualCheck = (lessonId: string) => {
        const prog = progressoMap.get(lessonId);
        return prog === undefined || !prog.completado;
    };

    const handleCheckbox = async (lessonId: string) => {
        if (!courseId) return;
        try {
            const result = await cursosService.completarAula(courseId, lessonId);
            setProgresso((prev) => {
                const filtered = prev.filter((p) => p.idLesson !== lessonId);
                return [...filtered, result];
            });
        } catch {
        }
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
                        <h6 className="text-white mb-2">Progresso</h6>
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
                    </div>

                    <div className="flex-grow-1 overflow-auto p-3">
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
                    </div>
                </div>
            </div>
        </div>
    );
};
