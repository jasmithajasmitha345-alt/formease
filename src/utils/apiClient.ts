/**
 * Safe API client utility to handle HTTP status and response content-types
 * without unhandled JSON parsing syntax errors.
 */

export interface SafeApiResponse<T> {
  ok: boolean;
  status: number;
  data?: T;
  error?: string;
  isHtmlRedirect?: boolean;
}

export async function safeFetchJson<T>(url: string, init?: RequestInit): Promise<SafeApiResponse<T>> {
  try {
    const response = await fetch(url, init);
    const contentType = response.headers.get('content-type') || '';

    // Check if the server returned HTML (e.g. Netlify 404/SPA index.html fallback)
    if (contentType.includes('text/html')) {
      return {
        ok: false,
        status: response.status,
        isHtmlRedirect: true,
        error: `Server returned an HTML document instead of JSON (Status ${response.status}). The requested endpoint '${url}' might not be routed to a serverless backend function.`,
      };
    }

    if (contentType.includes('application/json')) {
      const json = await response.json();
      if (!response.ok) {
        return {
          ok: false,
          status: response.status,
          error: json.error || `HTTP error ${response.status}`,
          data: json,
        };
      }
      return {
        ok: true,
        status: response.status,
        data: json,
      };
    }

    // Other non-JSON content
    const text = await response.text();
    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        error: text || `HTTP error ${response.status}`,
      };
    }

    return {
      ok: false,
      status: response.status,
      error: `Unexpected response content-type: ${contentType}`,
    };
  } catch (err: any) {
    return {
      ok: false,
      status: 0,
      error: err.message || 'Network request failed.',
    };
  }
}
