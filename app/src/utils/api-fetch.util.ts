export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
}

export async function apiFetch<T = unknown>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(url, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
      ...options,
    });

    const isJson = res.headers.get('content-type')?.includes('application/json');

    const body = isJson ? await res.json().catch(() => ({})) : null;

    if (!res.ok) {
      return {
        error: body?.message ?? 'Request failed',
      };
    }

    return {
      data: body,
    };
  } catch {
    return {
      error: 'Network error',
    };
  }
}
