const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/auth';

export interface SignInRequest {
    email: string;
    senha_hash: string;
}

export interface RegisterRequest {
    nome_completo: string;
    email: string;
    senha_hash: string;
}

export interface SignInResponse {
    token: string;
}

export class AuthService {

    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const url = `${API_BASE_URL}${endpoint}`;
        
        const defaultHeaders = {
            'Content-Type': 'application/json',
        };

        const config: RequestInit = {
            ...options,
            headers: { ...defaultHeaders, ...options.headers },
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                const errorMessage = await response.text().catch(() => response.statusText);
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

    async login(data: SignInRequest): Promise<SignInResponse> {
        return this.request<SignInResponse>('/sign-in', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async register(data: RegisterRequest): Promise<SignInResponse> {
        return this.request<SignInResponse>('/register', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    logout(): void {
        localStorage.removeItem('token');
    }

    isAuthenticated(): boolean {
        return !!localStorage.getItem('token');
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }
}

export const authService = new AuthService();
