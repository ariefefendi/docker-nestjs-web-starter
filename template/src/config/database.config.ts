import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { env } from './env';

/**
 * Koneksi MySQL (TypeORM).
 * synchronize = setara `php artisan migrate`: tabel dibuat/disesuaikan
 * otomatis dari model. Hanya aktif saat APP_ENV=local. Production: pakai migration.
 */
export function databaseConfig(): TypeOrmModuleOptions {
  return {
    type: 'mysql',
    host: env('DB_HOST', 'kazuya-mysql'),
    port: Number(env('DB_PORT', '3306')),
    username: env('DB_USERNAME', 'root'),
    password: env('DB_PASSWORD', ''),
    database: env('DB_DATABASE'),
    charset: 'utf8mb4',
    autoLoadEntities: true,
    synchronize: env('APP_ENV', 'local') === 'local',
    extra: { connectionLimit: 10 },
  };
}
