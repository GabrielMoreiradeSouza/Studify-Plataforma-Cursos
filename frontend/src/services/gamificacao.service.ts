const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080/auth').replace('/auth', '');

export interface ConquistaResponse {
    idConquista: string;
    nome: string;
    descricao: string;
    desbloqueada: boolean;
    dataConquista: string | null;
}

export interface PerfilResponse {
    idUsuario: string;
    nomeCompleto: string;
    email: string;
    pontos: number;
    nivel: number;
    conquistas: ConquistaResponse[];
}

function getHeaders(): Record<string, string> {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

export const gamificacaoService = {
    async getPerfil(): Promise<PerfilResponse> {
        const response = await fetch(`${API_BASE_URL}/gamificacao/perfil`, {
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error('Erro ao carregar perfil');
        return response.json();
    },

    async getConquistas(): Promise<ConquistaResponse[]> {
        const response = await fetch(`${API_BASE_URL}/gamificacao/conquistas`, {
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error('Erro ao carregar conquistas');
        return response.json();
    },
};
