// setara database/seeders/DatabaseSeeder.php
import { Injectable } from '@nestjs/common';
import { UnitsSeeder } from './units.seeder';
import { UsersSeeder } from './users.seeder';

@Injectable()
export class DatabaseSeeder {
  constructor(
    private readonly users: UsersSeeder,
    private readonly units: UnitsSeeder,
  ) {}

  async run(): Promise<void> {
    await this.users.run();
    await this.units.run();
  }
}
