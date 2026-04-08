const BASE_URL = "http://localhost:8080"

export async function fetchApi<T>(path: string, method: string, body?: object): Promise<T> {
    
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    const token = localStorage.getItem("auth_token");
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
        throw new Error(`API Fehler: ${response.status}`);
    }

    return response.json() as Promise<T>;
}