import { useState, useEffect } from "react";
import { adminService } from "../../services/admin.service";
import type { CursoResponse, LessonResponse } from "../../services/admin.service";

export const MeusCursos = () => {
    const [courses, setCourses] = useState<CursoResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
    const [lessons, setLessons] = useState<Record<string, LessonResponse[]>>({});
    const [lessonTitle, setLessonTitle] = useState("");
    const [lessonOrdem, setLessonOrdem] = useState("");
    const [lessonFile, setLessonFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const [imageUploading, setImageUploading] = useState<string | null>(null);

    const fetchCourses = async () => {
        setLoading(true);
        setError("");
        try {
            const cours = await adminService.listCourses();
            setCourses(cours);
        } catch (err: any) {
            setError(err.message || "Erro ao carregar cursos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const toggleCourse = async (courseId: string) => {
        if (expandedCourse === courseId) {
            setExpandedCourse(null);
            return;
        }
        setExpandedCourse(courseId);
        if (!lessons[courseId]) {
            try {
                const lessonList = await adminService.listLessons(courseId);
                setLessons((prev) => ({ ...prev, [courseId]: lessonList }));
            } catch {
                setLessons((prev) => ({ ...prev, [courseId]: [] }));
            }
        }
    };

    const handleUploadLesson = async (e: React.FormEvent, courseId: string) => {
        e.preventDefault();
        setError("");
        if (!lessonFile) {
            setError("Selecione um arquivo .mp4");
            return;
        }
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", lessonFile);
            formData.append("titulo", lessonTitle);
            if (lessonOrdem) formData.append("ordem", lessonOrdem);

            await adminService.uploadLesson(courseId, formData);
            setLessonTitle("");
            setLessonOrdem("");
            setLessonFile(null);

            const lessonList = await adminService.listLessons(courseId);
            setLessons((prev) => ({ ...prev, [courseId]: lessonList }));
        } catch (err: any) {
            setError(err.message || "Erro ao fazer upload da aula");
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteCourse = async (courseId: string) => {
        if (!window.confirm("Excluir este curso? Todas as aulas serão removidas.")) return;
        try {
            await adminService.deleteCourse(courseId);
            setCourses((prev) => prev.filter((c) => c.idCurso !== courseId));
            setLessons((prev) => { const next = { ...prev }; delete next[courseId]; return next; });
        } catch (err: any) {
            setError(err.message || "Erro ao excluir curso");
        }
    };

    const handleDeleteLesson = async (courseId: string, lessonId: string) => {
        if (!window.confirm("Excluir esta aula?")) return;
        try {
            await adminService.deleteLesson(courseId, lessonId);
            const lessonList = await adminService.listLessons(courseId);
            setLessons((prev) => ({ ...prev, [courseId]: lessonList }));
        } catch (err: any) {
            setError(err.message || "Erro ao excluir aula");
        }
    };

    const handleImageUpload = async (courseId: string, file: File) => {
        if (!file.type || !["image/png", "image/jpeg"].includes(file.type)) {
            setError("Apenas PNG ou JPG");
            return;
        }
        setImageUploading(courseId);
        setError("");
        try {
            await adminService.uploadCourseImage(courseId, file);
            await fetchCourses();
        } catch (err: any) {
            setError(err.message || "Erro ao fazer upload da imagem");
        } finally {
            setImageUploading(null);
        }
    };

    if (loading) {
        return <p className="text-white">Carregando...</p>;
    }

    return (
        <div>
            <h4 className="text-white mb-1" style={{ fontWeight: 600 }}>Meus Cursos</h4>
            <p className="text-muted mb-4" style={{ color: "#9a9a9a !important" }}>Gerencie seus cursos e aulas</p>

            {error && <div className="alert alert-danger">{error}</div>}

            {courses.length === 0 ? (
                <p className="text-muted">Nenhum curso criado ainda.</p>
            ) : (
                <div className="d-flex flex-column gap-3">
                    {courses.map((course) => (
                        <div
                            key={course.idCurso}
                            className="card"
                            style={{ backgroundColor: "#1e2124", border: "none", borderRadius: "12px" }}
                        >
                            <div className="card-body p-4">
                                <div
                                    role="button"
                                    tabIndex={0}
                                    className="d-flex justify-content-between align-items-center"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => toggleCourse(course.idCurso)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") toggleCourse(course.idCurso);
                                    }}
                                >
                                    <div className="d-flex align-items-center gap-3">
                                        {course.imagemKey ? (
                                            <img
                                                src={adminService.getCourseImageUrl(course.idCurso)}
                                                alt={course.titulo}
                                                style={{ width: 56, height: 56, borderRadius: 8, objectFit: "cover" }}
                                            />
                                        ) : (
                                            <div
                                                style={{
                                                    width: 56, height: 56, borderRadius: 8,
                                                    backgroundColor: "#2a2d33", display: "flex",
                                                    alignItems: "center", justifyContent: "center",
                                                    fontSize: 20, color: "#9a9a9a"
                                                }}
                                            >
                                                📁
                                            </div>
                                        )}
                                        <div>
                                            <h6 className="mb-1 text-white">{course.titulo}</h6>
                                            <small style={{ color: "#9a9a9a" }}>
                                                {course.nomeCategoria} &middot; {course.nivel} &middot; {course.dataPublicacao} &middot; {course.totalAulas} aulas
                                            </small>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                        <label
                                            className="btn btn-sm"
                                            style={{ backgroundColor: "#295bf1", color: "#fff", fontSize: 12, cursor: "pointer" }}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {imageUploading === course.idCurso ? "..." : "Imagem"}
                                            <input
                                                type="file"
                                                accept=".png,.jpg,.jpeg,image/png,image/jpeg"
                                                style={{ display: "none" }}
                                                onChange={(e) => {
                                                    if (e.target.files && e.target.files[0]) {
                                                        handleImageUpload(course.idCurso, e.target.files[0]);
                                                    }
                                                }}
                                            />
                                        </label>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            style={{ fontSize: 12 }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteCourse(course.idCurso);
                                            }}
                                        >
                                            Excluir
                                        </button>
                                        <span style={{ color: "#9a9a9a" }}>
                                            {expandedCourse === course.idCurso ? "▲" : "▼"}
                                        </span>
                                    </div>
                                </div>

                                {expandedCourse === course.idCurso && (
                                    <div className="mt-3 border-top pt-3" style={{ borderColor: "#2a2d33 !important" }}>
                                        <h6 className="text-white">Gerenciar Aulas</h6>
                                        <form onSubmit={(e) => handleUploadLesson(e, course.idCurso)}>
                                            <div className="mb-3">
                                                <label className="form-label text-white">Título da Aula</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    style={{ backgroundColor: "#2a2d33", border: "none", color: "#fff" }}
                                                    value={lessonTitle}
                                                    onChange={(e) => setLessonTitle(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="row mb-3">
                                                <div className="col">
                                                    <label className="form-label text-white">Ordem</label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        style={{ backgroundColor: "#2a2d33", border: "none", color: "#fff" }}
                                                        value={lessonOrdem}
                                                        onChange={(e) => setLessonOrdem(e.target.value)}
                                                        min="1"
                                                    />
                                                </div>
                                                <div className="col">
                                                    <label className="form-label text-white">Arquivo .mp4</label>
                                                    <input
                                                        type="file"
                                                        className="form-control"
                                                        style={{ backgroundColor: "#2a2d33", border: "none", color: "#fff" }}
                                                        accept=".mp4,video/mp4"
                                                        onChange={(e) => {
                                                            if (e.target.files && e.target.files[0]) {
                                                                setLessonFile(e.target.files[0]);
                                                            }
                                                        }}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <button
                                                type="submit"
                                                className="btn"
                                                style={{ backgroundColor: "#295bf1", color: "#fff", fontWeight: 600 }}
                                                disabled={uploading}
                                            >
                                                {uploading ? "Enviando..." : "Upload Aula"}
                                            </button>
                                        </form>

                                        <div className="mt-4">
                                            <h6 className="text-white">Aulas</h6>
                                            {!lessons[course.idCurso] || lessons[course.idCurso].length === 0 ? (
                                                <p className="text-muted small">Nenhuma aula cadastrada.</p>
                                            ) : (
                                                <div className="d-flex flex-column gap-2">
                                                    {lessons[course.idCurso].map((lesson) => (
                                                        <div
                                                            key={lesson.idLesson}
                                                            className="d-flex justify-content-between align-items-center px-3 py-2 rounded"
                                                            style={{ backgroundColor: "#2a2d33" }}
                                                        >
                                                            <span className="text-white">
                                                                {lesson.ordem && <strong>{lesson.ordem}.</strong>} {lesson.titulo}
                                                            </span>
                                                            <div className="d-flex align-items-center gap-2">
                                                                <small style={{ color: "#9a9a9a" }}>
                                                                    {lesson.s3Key.split("/").pop()}
                                                                </small>
                                                                <button
                                                                    className="btn btn-sm btn-outline-danger"
                                                                    style={{ fontSize: 12 }}
                                                                    onClick={() => handleDeleteLesson(course.idCurso, lesson.idLesson)}
                                                                >
                                                                    Excluir
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
