// Helper request, setara $request->all() / $request->input() di Laravel.
// Laravel otomatis men-trim string dan mengubah "" menjadi null
// (middleware TrimStrings + ConvertEmptyStringsToNull); di sini dilakukan
// pada saat membaca input.
import { Request } from 'express';

function normalize(v: unknown): unknown {
  if (typeof v === 'string') {
    const t = v.trim();
    return t === '' ? null : t;
  }
  if (Array.isArray(v)) return v.map(normalize);
  if (v && typeof v === 'object') {
    return Object.fromEntries(
      Object.entries(v).map(([k, x]) => [k, normalize(x)]),
    );
  }
  return v;
}

/** $request->all()  (query string + body) */
export function all(req: Request): Record<string, unknown> {
  return normalize({
    ...(req.query as Record<string, unknown>),
    ...(req.body ?? {}),
  }) as Record<string, unknown>;
}

/** $request->input('key', default) */
export function input<T = unknown>(req: Request, key: string, def?: T): T {
  return (all(req)[key] ?? def) as T;
}
