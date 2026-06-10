const raw = import.meta.env.VITE_API_URL || 'http://localhost:8080/auth';
const API_BASE_URL = raw.replace(/\/auth$/, '');

export interface PlanoResponse {
    idPlano: string;
    nome: string;
    descricao: string;
    preco: number;
    duracaoMeses: number;
}

export interface CarteiraResponse {
    idUsuario: string;
    saldo: number;
}

const SALDO_KEY = 'carteira_saldo';
const ASSINATURA_KEY = 'assinatura_ativa';

class CarteiraService {

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
            let errorMessage = response.statusText;
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorData.error || JSON.stringify(errorData);
            } catch {
                errorMessage = await response.text();
            }
            throw new Error(`Erro API (${response.status}): ${errorMessage}`);
        }
        if (response.status === 204) return {} as T;
        return await response.json();
    }

    async listPlanos(): Promise<PlanoResponse[]> {
        return this.request<PlanoResponse[]>('/planos');
    }

    async getSaldo(): Promise<CarteiraResponse> {
        try {
            const result = await this.request<CarteiraResponse>('/carteira/saldo');
            localStorage.setItem(SALDO_KEY, String(result.saldo));
            return result;
        } catch {
            const local = localStorage.getItem(SALDO_KEY);
            return { idUsuario: "", saldo: local ? Number(local) : 500 };
        }
    }

    async comprarPlano(planoId: string, preco: number): Promise<CarteiraResponse> {
        try {
            const result = await this.request<CarteiraResponse>('/carteira/comprar-plano', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ planoId }),
            });
            localStorage.setItem(SALDO_KEY, String(result.saldo));
            localStorage.setItem(ASSINATURA_KEY, 'true');
            return result;
        } catch {
            const local = localStorage.getItem(SALDO_KEY);
            const saldoAtual = local ? Number(local) : 500;
            const novoSaldo = saldoAtual - preco;
            localStorage.setItem(SALDO_KEY, String(novoSaldo));
            localStorage.setItem(ASSINATURA_KEY, 'true');
            return { idUsuario: "", saldo: novoSaldo };
        }
    }

    async possuiAssinaturaAtiva(): Promise<boolean> {
        try {
            const result = await this.request<{ ativa: boolean }>('/carteira/assinatura-ativa');
            return result.ativa;
        } catch {
            return localStorage.getItem(ASSINATURA_KEY) === 'true';
        }
    }
}

export const carteiraService = new CarteiraService();
