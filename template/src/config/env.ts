// config/ : env, database, view  (setara config/*.php + .env di Laravel)

/** env('KEY', 'default') */
export function env(key: string, fallback = ''): string {
  const v = process.env[key];
  return v !== undefined && v !== '' ? v : fallback;
}
