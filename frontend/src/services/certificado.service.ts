const raw = import.meta.env.VITE_API_URL || 'http://localhost:8080/auth';
const API_BASE_URL = raw.replace(/\/auth$/, '');

export interface CertificadoResponse {
    idCertificado: string;
    idUsuario: string;
    nomeUsuario: string;
    idCurso: string | null;
    nomeCurso: string | null;
    idTrilha: string | null;
    nomeTrilha: string | null;
    codigoVerificacao: string;
    dataEmissao: string;
}

class CertificadoService {

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
        const response = await fetch(url, config);
        if (!response.ok) {
            throw new Error(`Erro API (${response.status}): ${response.statusText}`);
        }
        return await response.json();
    }

    async listar(): Promise<CertificadoResponse[]> {
        return this.request<CertificadoResponse[]>('/certificados');
    }

    async visualizarHtml(id: string): Promise<void> {
        const url = `${API_BASE_URL}/certificados/${id}/html`;
        const response = await fetch(url, { headers: this.authHeaders() });
        if (!response.ok) throw new Error("Erro ao carregar certificado");
        const html = await response.text();
        const blob = new Blob([html], { type: 'text/html' });
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, '_blank');
    }
}

export const certificadoService = new CertificadoService();
