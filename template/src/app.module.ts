// Setara routes/web.php + bootstrap Laravel: mendaftarkan controller,
// service, middleware, dan model.
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { AuthController } from './controllers/auth.controller';
import { HealthController } from './controllers/health.controller';
import { HomeController } from './controllers/home.controller';
import { UnitsController } from './controllers/master_data/units.controller';
import { DatabaseSeeder } from './database/seeders/database.seeder';
import { UnitsSeeder } from './database/seeders/units.seeder';
import { UsersSeeder } from './database/seeders/users.seeder';
import { AuthMiddleware } from './middleware/auth.middleware';
import { Units } from './models/master_data/units.model';
import { Users } from './models/users.model';
import { AuthService } from './services/auth.service';
import { RoleViewService } from './services/role-view.service';
import { ShortIdService } from './services/short-id.service';
import { UuidService } from './services/uuid.service';
import { ValidatorService } from './services/validator.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig()),
    // Tambahkan model baru di sini: forFeature([Units, Users, Xxx])
    TypeOrmModule.forFeature([Units, Users]),
  ],
  controllers: [
    HomeController,
    AuthController,
    HealthController,
    // ---------- master_data ----------
    UnitsController,
  ],
  providers: [
    // Services
    UuidService,
    ShortIdService,
    ValidatorService,
    AuthService,
    RoleViewService,
    // Seeders
    DatabaseSeeder,
    UsersSeeder,
    UnitsSeeder,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Setara Route::middleware('auth')->group(...)
    consumer.apply(AuthMiddleware).forRoutes(UnitsController);
  }
}
