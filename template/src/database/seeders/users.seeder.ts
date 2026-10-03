import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { env } from '../../config/env';
import { Users } from '../../models/users.model';
import { UuidService } from '../../services/uuid.service';

/**
 * Membuat user admin (jika belum ada).
 * Login default: ADMIN_EMAIL / ADMIN_PASSWORD di .env
 * (default admin@example.com / password) -> GANTI untuk selain development.
 */
@Injectable()
export class UsersSeeder {
  constructor(
    @InjectRepository(Users) private readonly users: Repository<Users>,
    private readonly uuid: UuidService,
  ) {}

  async run(): Promise<void> {
    const email = env('ADMIN_EMAIL', 'admin@example.com');
    if (await this.users.existsBy({ email })) return;

    await this.users.save(
      this.users.create({
        id: this.uuid.generate(),
        name: 'Administrator',
        email,
        password: await bcrypt.hash(env('ADMIN_PASSWORD', 'password'), 10),
        role: 'admin',
      }),
    );
  }
}
