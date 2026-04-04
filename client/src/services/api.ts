const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface FetchOptions extends RequestInit {
    token?: string;
}

export const apiFetch = async <T>(
    endpoint: string,
    options: FetchOptions = {}
): Promise<T> => {
    const { token, ...fetchOptions } = options;

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...fetchOptions,
            headers,
        });

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Error en la petición');
            }
            return data;
        } else {
            const text = await response.text();
            console.error('Respuesta no JSON:', text.substring(0, 200));
            throw new Error('El servidor respondió con un formato inválido');
        }
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Error de conexión con el servidor');
    }
};

export const get = <T>(endpoint: string, token?: string): Promise<T> => {
    return apiFetch<T>(endpoint, { method: 'GET', token });
};

export const post = <T>(endpoint: string, body: any, token?: string): Promise<T> => {
    return apiFetch<T>(endpoint, {
        method: 'POST',
        body: JSON.stringify(body),
        token,
    });
};

export const patch = <T>(endpoint: string, body: any, token?: string): Promise<T> => {
    return apiFetch<T>(endpoint, {
        method: 'PATCH',
        body: JSON.stringify(body),
        token,
    });
};

export const del = <T>(endpoint: string, token?: string): Promise<T> => {
    return apiFetch<T>(endpoint, { method: 'DELETE', token });
};