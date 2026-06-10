const raw = import.meta.env.VITE_API_URL || 'http://localhost:8080/auth';
const API_BASE_URL = raw.replace(/\/auth$/, '');

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

export interface LessonResponse {
    idLesson: string;
    idCurso: string;
    titulo: string;
    s3Key: string;
    duracaoSegundos: number | null;
    ordem: number;
    dataUpload: string;
}

export interface ProgressoResponse {
    idProgresso: string;
    idLesson: string;
    completado: boolean;
    dataConclusao: string | null;
}

class CursosService {

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

    async listAll(): Promise<CursoResponse[]> {
        return this.request<CursoResponse[]>('/courses/all');
    }

    async listLessons(courseId: string): Promise<LessonResponse[]> {
        return this.request<LessonResponse[]>(`/courses/${courseId}/lessons`);
    }

    async getProgresso(courseId: string): Promise<ProgressoResponse[]> {
        return this.request<ProgressoResponse[]>(`/courses/${courseId}/progresso`);
    }

    async completarAula(courseId: string, lessonId: string): Promise<ProgressoResponse> {
        return this.request<ProgressoResponse>(`/courses/${courseId}/lessons/${lessonId}/completar`, {
            method: 'POST',
        });
    }

    getVideoUrl(courseId: string, lessonId: string): string {
        return `${API_BASE_URL}/courses/${courseId}/lessons/${lessonId}/video`;
    }

    getCourseImageUrl(courseId: string): string {
        return `${API_BASE_URL}/courses/${courseId}/image`;
    }

    async listTrilhas(): Promise<TrilhaResponse[]> {
        return this.request<TrilhaResponse[]>('/trilhas');
    }

    async getTrilha(trilhaId: string): Promise<TrilhaResponse> {
        return this.request<TrilhaResponse>(`/trilhas/${trilhaId}`);
    }

    getTrilhaImageUrl(trilhaId: string): string {
        return `${API_BASE_URL}/trilhas/${trilhaId}/image`;
    }
}

export const cursosService = new CursosService();
