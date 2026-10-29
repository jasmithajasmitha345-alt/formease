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
    const rawText = await response.text();
    const trimmed = rawText.trim();

    // Check if the server returned HTML (e.g. Netlify 404, SPA index.html fallback, or gateway error)
    if (contentType.includes('text/html') || trimmed.startsWith('<') || trimmed.toLowerCase().startsWith('<!doctype')) {
      return {
        ok: false,
        status: response.status,
        isHtmlRedirect: true,
        error: `Server returned an HTML document instead of JSON (Status ${response.status}). The requested endpoint '${url}' is not a working JSON API.`,
      };
    }

    try {
      const json = JSON.parse(rawText);
      if (!response.ok) {
        return {
          ok: false,
          status: response.status,
          error: json?.error || `HTTP error ${response.status}`,
          data: json,
        };
      }
      return {
        ok: true,
        status: response.status,
        data: json,
      };
    } catch {
      return {
        ok: false,
        status: response.status,
        error: rawText.slice(0, 150) || `HTTP error ${response.status}`,
      };
    }
  } catch (err: any) {
    return {
      ok: false,
      status: 0,
      error: err.message || 'Network request failed.',
    };
  }
}
