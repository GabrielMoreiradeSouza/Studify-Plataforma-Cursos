const raw = import.meta.env.VITE_API_URL || 'http://localhost:8080/auth';
const API_BASE_URL = raw.replace(/\/auth$/, '');

export interface Categoria {
    idCategoria: string;
    nome: string;
    descricao: string;
}

export interface CursoResponse {
    idCurso: string;
    titulo: string;
    descricao: string;
    idInstrutor: string;
    nomeInstrutor: string;
    idCategoria: string;
    nomeCategoria: string;
    nivel: string;
    dataPublicacao: string;
    totalAulas: number;
    totalHoras: number;
    imagemKey: string | null;
}

export interface CreateCursoRequest {
    titulo: string;
    descricao: string;
    categoriaId: string;
    nivel: string;
}

export interface LessonResponse {
    idLesson: string;
    idCurso: string;
    titulo: string;
    s3Key: string;
    duracaoSegundos: number | null;
    ordem: number;
    dataUpload: string;
}

export interface TrilhaResponse {
    idTrilha: string;
    titulo: string;
    descricao: string;
    dataCriacao: string;
    totalCursos: number;
    imagemKey: string | null;
    idCategoria: string;
    nomeCategoria: string;
    cursos: CursoResponse[];
}

export interface CreateTrilhaRequest {
    titulo: string;
    descricao: string;
    categoriaId: string;
}

export interface AddCursoToTrilhaRequest {
    cursoId: string;
    ordem?: number;
}

class AdminService {

    private getToken(): string | null {
        return localStorage.getItem('token');
    }

    private authHeaders(): Record<string, string> {
        const token = this.getToken();
        if (!token) return {};
        return { 'Authorization': `Bearer ${token}` };
    }

    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const url = `${API_BASE_URL}${endpoint}`;

        const config: RequestInit = {
            ...options,
            headers: { ...this.authHeaders(), ...options.headers },
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                let errorMessage = response.statusText;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.error || JSON.stringify(errorData);
                } catch {
                    errorMessage = await response.text();
                }
                throw new Error(`Erro API (${response.status}): ${errorMessage}`);
            }

            if (response.status === 204) {
                return {} as T;
            }

            return await response.json();
        } catch (error) {
            console.error(`Erro na requisição para ${url}:`, error);
            throw error;
        }
    }

    async listCategories(): Promise<Categoria[]> {
        return this.request<Categoria[]>('/categories');
    }

    async listCourses(): Promise<CursoResponse[]> {
        return this.request<CursoResponse[]>('/courses');
    }

    async createCourse(data: CreateCursoRequest): Promise<CursoResponse> {
        return this.request<CursoResponse>('/courses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
    }

    async listLessons(courseId: string): Promise<LessonResponse[]> {
        return this.request<LessonResponse[]>(`/courses/${courseId}/lessons`);
    }

    async deleteCourse(courseId: string): Promise<void> {
        return this.request<void>(`/courses/${courseId}`, { method: 'DELETE' });
    }

    async deleteLesson(courseId: string, lessonId: string): Promise<void> {
        return this.request<void>(`/courses/${courseId}/lessons/${lessonId}`, { method: 'DELETE' });
    }

    getCourseImageUrl(courseId: string): string {
        return `${API_BASE_URL}/courses/${courseId}/image`;
    }

    async uploadCourseImage(courseId: string, file: File): Promise<CursoResponse> {
        const formData = new FormData();
        formData.append('file', file);

        const url = `${API_BASE_URL}/courses/${courseId}/image`;
        const token = this.getToken();

        const headers: Record<string, string> = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config: RequestInit = {
            method: 'POST',
            headers,
            body: formData,
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                let errorMessage = response.statusText;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.error || JSON.stringify(errorData);
                } catch {
                    errorMessage = await response.text();
                }
                throw new Error(`Erro API (${response.status}): ${errorMessage}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Erro no upload para ${url}:`, error);
            throw error;
        }
    }

    async listTrilhas(): Promise<TrilhaResponse[]> {
        return this.request<TrilhaResponse[]>('/trilhas');
    }

    async getTrilha(trilhaId: string): Promise<TrilhaResponse> {
        return this.request<TrilhaResponse>(`/trilhas/${trilhaId}`);
    }

    async createTrilha(data: CreateTrilhaRequest): Promise<TrilhaResponse> {
        return this.request<TrilhaResponse>('/trilhas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
    }

    async deleteTrilha(trilhaId: string): Promise<void> {
        return this.request<void>(`/trilhas/${trilhaId}`, { method: 'DELETE' });
    }

    async addCursoToTrilha(trilhaId: string, data: AddCursoToTrilhaRequest): Promise<TrilhaResponse> {
        return this.request<TrilhaResponse>(`/trilhas/${trilhaId}/cursos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
    }

    async removeCursoFromTrilha(trilhaId: string, cursoId: string): Promise<TrilhaResponse> {
        return this.request<TrilhaResponse>(`/trilhas/${trilhaId}/cursos/${cursoId}`, { method: 'DELETE' });
    }

    getTrilhaImageUrl(trilhaId: string): string {
        return `${API_BASE_URL}/trilhas/${trilhaId}/image`;
    }

    async uploadTrilhaImage(trilhaId: string, file: File): Promise<TrilhaResponse> {
        const formData = new FormData();
        formData.append('file', file);

        const url = `${API_BASE_URL}/trilhas/${trilhaId}/image`;
        const token = this.getToken();

        const headers: Record<string, string> = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config: RequestInit = {
            method: 'POST',
            headers,
            body: formData,
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                let errorMessage = response.statusText;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.error || JSON.stringify(errorData);
                } catch {
                    errorMessage = await response.text();
                }
                throw new Error(`Erro API (${response.status}): ${errorMessage}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Erro no upload para ${url}:`, error);
            throw error;
        }
    }

    async uploadLesson(courseId: string, formData: FormData): Promise<LessonResponse> {
        const url = `${API_BASE_URL}/courses/${courseId}/lessons`;
        const token = this.getToken();

        const headers: Record<string, string> = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config: RequestInit = {
            method: 'POST',
            headers,
            body: formData,
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                let errorMessage = response.statusText;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.error || JSON.stringify(errorData);
                } catch {
                    errorMessage = await response.text();
                }
                throw new Error(`Erro API (${response.status}): ${errorMessage}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Erro no upload para ${url}:`, error);
            throw error;
        }
    }
}

export const adminService = new AdminService();
