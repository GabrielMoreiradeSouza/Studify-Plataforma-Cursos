import { useState, useEffect } from "react";
import { adminService } from "../../services/admin.service";
import type { Categoria } from "../../services/admin.service";

export const CriarCurso = () => {
    const [categories, setCategories] = useState<Categoria[]>([]);
    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [categoriaId, setCategoriaId] = useState("");
    const [nivel, setNivel] = useState("iniciante");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        adminService.listCategories()
            .then(setCategories)
            .catch((err: any) => setError(err.message || "Erro ao carregar categorias"));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        if (!categoriaId) {
            setError("Selecione uma categoria");
            return;
        }
        setCreating(true);
        try {
            await adminService.createCourse({ titulo, descricao, categoriaId, nivel });
            setSuccess("Curso criado com sucesso!");
            setTitulo("");
            setDescricao("");
            setCategoriaId("");
            setNivel("iniciante");
        } catch (err: any) {
            setError(err.message || "Erro ao criar curso");
        } finally {
            setCreating(false);
        }
    };

    return (
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
            <h4 className="text-white mb-1" style={{ fontWeight: 600 }}>Criar Novo Curso</h4>
            <p className="text-muted mb-4" style={{ color: "#9a9a9a !important" }}>Preencha os dados para criar um novo curso</p>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <div className="card" style={{ backgroundColor: "#1e2124", border: "none", borderRadius: "12px" }}>
                <div className="card-body p-4">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label text-white">Título</label>
                            <input
                                type="text"
                                className="form-control"
                                style={{ backgroundColor: "#2a2d33", border: "none", color: "#fff" }}
                                value={titulo}
                                onChange={(e) => setTitulo(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label text-white">Descrição</label>
                            <textarea
                                className="form-control"
                                rows={3}
                                style={{ backgroundColor: "#2a2d33", border: "none", color: "#fff" }}
                                value={descricao}
                                onChange={(e) => setDescricao(e.target.value)}
                            />
                        </div>
                        <div className="row mb-3">
                            <div className="col">
                                <label className="form-label text-white">Categoria</label>
                                <select
                                    className="form-select"
                                    style={{ backgroundColor: "#2a2d33", border: "none", color: "#fff" }}
                                    value={categoriaId}
                                    onChange={(e) => setCategoriaId(e.target.value)}
                                    required
                                >
                                    <option value="">Selecione...</option>
                                    {categories.map((cat) => (
                                        <option key={cat.idCategoria} value={cat.idCategoria}>
                                            {cat.nome}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col">
                                <label className="form-label text-white">Nível</label>
                                <select
                                    className="form-select"
                                    style={{ backgroundColor: "#2a2d33", border: "none", color: "#fff" }}
                                    value={nivel}
                                    onChange={(e) => setNivel(e.target.value)}
                                >
                                    <option value="iniciante">Iniciante</option>
                                    <option value="intermediario">Intermediário</option>
                                    <option value="avancado">Avançado</option>
                                </select>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="btn w-100"
                            style={{ backgroundColor: "#295bf1", color: "#fff", fontWeight: 600 }}
                            disabled={creating}
                        >
                            {creating ? "Criando..." : "Criar Curso"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
