/**
 * Fetch mock helper for mobile tests.
 *
 * Mocks the global `fetch` at the ApiClient boundary so tests can assert on
 * outbound HTTP calls (method, URL, headers, body) and return canned JSON or
 * Nibble error-envelope responses without hitting a real server.
 *
 * Usage:
 *   import { mockFetch, mockFetchError, assertFetchCall } from '@/test/fetch-mock';
 *
 *   beforeEach(() => {
 *     mockFetch({ items: [], hasMore: false });       // happy path
 *   });
 *   afterEach(() => {
 *     jest.restoreAllMocks();
 *   });
 *
 *   it('calls the feed endpoint', async () => {
 *     // ... render / act ...
 *     assertFetchCall(0, { method: 'GET', urlContains: '/feed' });
 *   });
 */

/** A Nibble API error envelope as returned by the Go handler. */
export interface ApiErrorEnvelope {
  error: {
    code: string;
    message: string;
  };
}

/** Options for assertFetchCall. */
export interface FetchCallAssertion {
  /** Expected HTTP method (case-insensitive). */
  method?: string;
  /** Substring the URL must contain. */
  urlContains?: string;
  /** Expected request headers (subset check). */
  headers?: Record<string, string>;
  /** Expected JSON body (deep-equal). */
  body?: unknown;
}

/**
 * Replace global fetch with a mock that resolves to the given JSON payload.
 *
 * Call this in `beforeEach`. Pair with `jest.restoreAllMocks()` in `afterEach`
 * so the real fetch is restored for other test suites.
 *
 * @param payload   JSON to return as the response body.
 * @param status    HTTP status code (default 200).
 */
export function mockFetch(payload: unknown, status = 200): jest.SpyInstance {
  return jest.spyOn(global, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(payload), {
      status,
      headers: { 'Content-Type': 'application/json' },
    }),
  );
}

/**
 * Replace global fetch with a mock that resolves to a Nibble error envelope.
 *
 * Useful for testing error-state rendering (network errors, 401s, 404s, etc.).
 *
 * @param code      Machine-readable error code (e.g. 'not_found').
 * @param message   Human-readable message for the error.
 * @param status    HTTP status code (default 400).
 */
export function mockFetchError(code: string, message: string, status = 400): jest.SpyInstance {
  const envelope: ApiErrorEnvelope = { error: { code, message } };
  return jest.spyOn(global, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(envelope), {
      status,
      headers: { 'Content-Type': 'application/json' },
    }),
  );
}

/**
 * Replace global fetch with a mock that rejects with a network error.
 *
 * Simulates a dropped connection or DNS failure.
 *
 * @param message   Error message (default 'Network request failed').
 */
export function mockFetchNetworkError(message = 'Network request failed'): jest.SpyInstance {
  return jest.spyOn(global, 'fetch').mockRejectedValue(new TypeError(message));
}

/**
 * Assert properties of the nth fetch call made during a test.
 *
 * @param callIndex   Zero-based index into the calls made to global.fetch.
 * @param assertion   Properties to check (all optional; only those provided are asserted).
 */
export function assertFetchCall(callIndex: number, assertion: FetchCallAssertion): void {
  const calls = (global.fetch as jest.Mock).mock.calls;
  if (calls.length <= callIndex) {
    throw new Error(
      `assertFetchCall: expected at least ${callIndex + 1} fetch call(s) but got ${calls.length}`,
    );
  }

  const [url, init] = calls[callIndex] as [string, RequestInit | undefined];

  if (assertion.urlContains !== undefined) {
    expect(url).toContain(assertion.urlContains);
  }

  if (assertion.method !== undefined) {
    expect((init?.method ?? 'GET').toUpperCase()).toBe(assertion.method.toUpperCase());
  }

  if (assertion.headers !== undefined) {
    const actualHeaders =
      init?.headers instanceof Headers
        ? Object.fromEntries((init.headers as Headers).entries())
        : ((init?.headers as Record<string, string> | undefined) ?? {});

    for (const [key, value] of Object.entries(assertion.headers)) {
      expect(actualHeaders[key.toLowerCase()] ?? actualHeaders[key]).toBe(value);
    }
  }

  if (assertion.body !== undefined) {
    const bodyString = typeof init?.body === 'string' ? init.body : JSON.stringify(init?.body);
    expect(JSON.parse(bodyString)).toEqual(assertion.body);
  }
}
