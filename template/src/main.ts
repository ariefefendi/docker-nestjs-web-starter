// Entry point aplikasi web NestJS (MVC, pola Laravel).
//
// Alur:
//  1. Buat app (koneksi database + sinkronisasi tabel terjadi di sini)
//  2. Session (untuk auth) + view (Nunjucks) + file statis (public)
//  3. Seed data jika SEED=true
//  4. Jalankan server
//
// Environment variable: lihat .env
import 'reflect-metadata';
import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import session from 'express-session';
import { AppModule } from './app.module';
import { env } from './config/env';
import { setupViews } from './config/view.config';
import { DatabaseSeeder } from './database/seeders/database.seeder';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Session (auth). MemoryStore hanya untuk development;
  // production sebaiknya pakai store eksternal (Redis/DB).
  app.use(
    session({
      secret: env('APP_KEY', 'change-me-in-env'),
      resave: false,
      saveUninitialized: false,
      cookie: { httpOnly: true, sameSite: 'lax', maxAge: 1000 * 60 * 60 * 8 },
    }),
  );

  // View: template Nunjucks (lihat config/view.config.ts)
  setupViews(app);

  // File statis: /public/xxx -> ./public/xxx
  app.useStaticAssets(join(process.cwd(), 'public'), { prefix: '/public/' });

  // php artisan db:seed  (jika SEED=true di .env; aman dipanggil berulang)
  if (env('SEED', 'false') === 'true') {
    await app.get(DatabaseSeeder).run();
  }

  // 0.0.0.0 wajib supaya bisa diakses dari luar container
  await app.listen(Number(env('APP_PORT', '8000')), '0.0.0.0');
}
bootstrap();
