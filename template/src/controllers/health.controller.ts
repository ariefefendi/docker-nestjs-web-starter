import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { DataSource } from 'typeorm';

@Controller('health')
export class HealthController {
  constructor(private readonly dataSource: DataSource) {}

  /** GET /health -> cek aplikasi + koneksi database */
  @Get()
  async check(@Res() res: Response) {
    try {
      await this.dataSource.query('SELECT 1');
      return res.status(200).json({ status: 'ok', database: 'connected' });
    } catch (err) {
      return res
        .status(503)
        .json({ status: 'error', database: (err as Error).message });
    }
  }
}
