import { useState, useEffect } from "react";
import { adminService } from "../../services/admin.service";
import type { TrilhaResponse, CursoResponse, Categoria } from "../../services/admin.service";

export const Trilhas = () => {
    const [trilhas, setTrilhas] = useState<TrilhaResponse[]>([]);
    const [cursos, setCursos] = useState<CursoResponse[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showCreate, setShowCreate] = useState(false);
    const [newTitulo, setNewTitulo] = useState("");
    const [newDescricao, setNewDescricao] = useState("");
    const [newCategoriaId, setNewCategoriaId] = useState("");

    const [expandedTrilha, setExpandedTrilha] = useState<string | null>(null);
    const [selectedCurso, setSelectedCurso] = useState<string>("");
    const [imageUploading, setImageUploading] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError("");
        try {
            const [t, c, cats] = await Promise.all([
                adminService.listTrilhas(),
                adminService.listCourses(),
                adminService.listCategories(),
            ]);
            setTrilhas(t);
            setCursos(c);
            setCategorias(cats);
        } catch (err: any) {
            setError(err.message || "Erro ao carregar dados");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            await adminService.createTrilha({
                titulo: newTitulo,
                descricao: newDescricao,
                categoriaId: newCategoriaId,
            });
            setNewTitulo("");
            setNewDescricao("");
            setNewCategoriaId("");
            setShowCreate(false);
            await fetchData();
        } catch (err: any) {
            setError(err.message || "Erro ao criar trilha");
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Excluir esta trilha?")) return;
        try {
            await adminService.deleteTrilha(id);
            await fetchData();
        } catch (err: any) {
            setError(err.message || "Erro ao excluir trilha");
        }
    };

    const handleAddCurso = async (trilhaId: string) => {
        if (!selectedCurso) return;
        setError("");
        try {
            await adminService.addCursoToTrilha(trilhaId, { cursoId: selectedCurso });
            setSelectedCurso("");
            await fetchData();
        } catch (err: any) {
            setError(err.message || "Erro ao adicionar curso");
        }
    };

    const handleRemoveCurso = async (trilhaId: string, cursoId: string) => {
        if (!window.confirm("Remover este curso da trilha?")) return;
        try {
            await adminService.removeCursoFromTrilha(trilhaId, cursoId);
            await fetchData();
        } catch (err: any) {
            setError(err.message || "Erro ao remover curso");
        }
    };

    const handleImageUpload = async (trilhaId: string, file: File) => {
        if (!file.type || !["image/png", "image/jpeg"].includes(file.type)) {
            setError("Apenas PNG ou JPG");
            return;
        }
        setImageUploading(trilhaId);
        setError("");
        try {
            await adminService.uploadTrilhaImage(trilhaId, file);
            await fetchData();
        } catch (err: any) {
            setError(err.message || "Erro ao fazer upload da imagem");
        } finally {
            setImageUploading(null);
        }
    };

    if (loading) {
        return <p className="text-white">Carregando...</p>;
    }

    const cursosDisponiveis = (trilhaId: string) => {
        const trilha = trilhas.find((t) => t.idTrilha === trilhaId);
        const idsNaTrilha = new Set((trilha?.cursos || []).map((c) => c.idCurso));
        return cursos.filter((c) => !idsNaTrilha.has(c.idCurso));
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h4 className="text-white mb-1" style={{ fontWeight: 600 }}>Trilhas</h4>
                    <p className="text-muted mb-0" style={{ color: "#9a9a9a" }}>Gerencie trilhas de cursos</p>
                </div>
                <button
                    className="btn"
                    style={{ backgroundColor: "#295bf1", color: "#fff", fontWeight: 600 }}
                    onClick={() => setShowCreate(!showCreate)}
                >
                    {showCreate ? "Cancelar" : "Nova Trilha"}
                </button>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            {showCreate && (
                <div className="card mb-4" style={{ backgroundColor: "#1e2124", border: "none", borderRadius: "12px" }}>
                    <div className="card-body p-4">
                        <h6 className="text-white mb-3">Criar Nova Trilha</h6>
                        <form onSubmit={handleCreate}>
                            <div className="mb-3">
                                <label className="form-label text-white">Título</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    style={{ backgroundColor: "#2a2d33", border: "none", color: "#fff" }}
                                    value={newTitulo}
                                    onChange={(e) => setNewTitulo(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label text-white">Descrição</label>
                                <textarea
                                    className="form-control"
                                    style={{ backgroundColor: "#2a2d33", border: "none", color: "#fff" }}
                                    value={newDescricao}
                                    onChange={(e) => setNewDescricao(e.target.value)}
                                    rows={3}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label text-white">Categoria</label>
                                <select
                                    className="form-control"
                                    style={{ backgroundColor: "#2a2d33", border: "none", color: "#fff" }}
                                    value={newCategoriaId}
                                    onChange={(e) => setNewCategoriaId(e.target.value)}
                                    required
                                >
                                    <option value="">Selecione...</option>
                                    {categorias.map((cat) => (
                                        <option key={cat.idCategoria} value={cat.idCategoria}>{cat.nome}</option>
                                    ))}
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="btn"
                                style={{ backgroundColor: "#295bf1", color: "#fff", fontWeight: 600 }}
                            >
                                Criar
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {trilhas.length === 0 ? (
                <p className="text-muted">Nenhuma trilha criada ainda.</p>
            ) : (
                <div className="d-flex flex-column gap-3">
                    {trilhas.map((trilha) => (
                        <div
                            key={trilha.idTrilha}
                            className="card"
                            style={{ backgroundColor: "#1e2124", border: "none", borderRadius: "12px" }}
                        >
                            <div className="card-body p-4">
                                <div
                                    role="button"
                                    tabIndex={0}
                                    className="d-flex justify-content-between align-items-center"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => setExpandedTrilha(expandedTrilha === trilha.idTrilha ? null : trilha.idTrilha)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            setExpandedTrilha(expandedTrilha === trilha.idTrilha ? null : trilha.idTrilha);
                                        }
                                    }}
                                >
                                    <div className="d-flex align-items-center gap-3">
                                        {trilha.imagemKey ? (
                                            <img
                                                src={adminService.getTrilhaImageUrl(trilha.idTrilha)}
                                                alt={trilha.titulo}
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
                                                🗂️
                                            </div>
                                        )}
                                        <div>
                                            <h6 className="mb-1 text-white">{trilha.titulo}</h6>
                                            <small style={{ color: "#9a9a9a" }}>
                                                {trilha.nomeCategoria} &middot; {trilha.totalCursos} cursos &middot; {trilha.dataCriacao}
                                            </small>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                        <label
                                            className="btn btn-sm"
                                            style={{ backgroundColor: "#295bf1", color: "#fff", fontSize: 12, cursor: "pointer" }}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {imageUploading === trilha.idTrilha ? "..." : "Imagem"}
                                            <input
                                                type="file"
                                                accept=".png,.jpg,.jpeg,image/png,image/jpeg"
                                                style={{ display: "none" }}
                                                onChange={(e) => {
                                                    if (e.target.files && e.target.files[0]) {
                                                        handleImageUpload(trilha.idTrilha, e.target.files[0]);
                                                    }
                                                }}
                                            />
                                        </label>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            style={{ fontSize: 12 }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(trilha.idTrilha);
                                            }}
                                        >
                                            Excluir
                                        </button>
                                        <span style={{ color: "#9a9a9a" }}>
                                            {expandedTrilha === trilha.idTrilha ? "▲" : "▼"}
                                        </span>
                                    </div>
                                </div>

                                {expandedTrilha === trilha.idTrilha && (
                                    <div className="mt-3 border-top pt-3" style={{ borderColor: "#2a2d33" }}>
                                        <h6 className="text-white">Cursos na Trilha</h6>

                                        {(!trilha.cursos || trilha.cursos.length === 0) ? (
                                            <p className="text-muted small">Nenhum curso nesta trilha.</p>
                                        ) : (
                                            <div className="d-flex flex-column gap-2 mb-3">
                                                {trilha.cursos.map((curso) => (
                                                    <div
                                                        key={curso.idCurso}
                                                        className="d-flex justify-content-between align-items-center px-3 py-2 rounded"
                                                        style={{ backgroundColor: "#2a2d33" }}
                                                    >
                                                        <span className="text-white">{curso.titulo}</span>
                                                        <button
                                                            className="btn btn-sm btn-outline-danger"
                                                            style={{ fontSize: 12 }}
                                                            onClick={() => handleRemoveCurso(trilha.idTrilha, curso.idCurso)}
                                                        >
                                                            Remover
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <div className="d-flex gap-2">
                                            <select
                                                className="form-control"
                                                style={{ backgroundColor: "#2a2d33", border: "none", color: "#fff", maxWidth: 300 }}
                                                value={selectedCurso}
                                                onChange={(e) => setSelectedCurso(e.target.value)}
                                            >
                                                <option value="">Adicionar curso...</option>
                                                {cursosDisponiveis(trilha.idTrilha).map((c) => (
                                                    <option key={c.idCurso} value={c.idCurso}>{c.titulo}</option>
                                                ))}
                                            </select>
                                            <button
                                                className="btn btn-sm"
                                                style={{ backgroundColor: "#295bf1", color: "#fff" }}
                                                disabled={!selectedCurso}
                                                onClick={() => handleAddCurso(trilha.idTrilha)}
                                            >
                                                Adicionar
                                            </button>
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
