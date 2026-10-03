import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Units } from '../../models/master_data/units.model';
import { ShortIdService } from '../../services/short-id.service';
import { UuidService } from '../../services/uuid.service';

/** Aman dipanggil berulang: dicek per code (termasuk yang soft-deleted). */
@Injectable()
export class UnitsSeeder {
  constructor(
    @InjectRepository(Units) private readonly units: Repository<Units>,
    private readonly uuid: UuidService,
    private readonly shortId: ShortIdService,
  ) {}

  async run(): Promise<void> {
    const rows: Array<[string, string, string | null, number]> = [
      ['PCS', 'Pieces', 'Satuan buah', 1],
      ['BOX', 'Box', 'Satuan kotak', 1],
      ['PACK', 'Pack', 'Satuan bungkus', 1],
      ['DUS', 'Dus', 'Satuan dus / karton', 1],
      ['LSN', 'Lusin', 'Satuan 12 buah', 1],
      ['KG', 'Kilogram', 'Satuan berat 1000 gram', 1],
      ['GR', 'Gram', 'Satuan berat', 1],
      ['LTR', 'Liter', 'Satuan volume', 1],
      ['ML', 'Mililiter', null, 1],
      ['MTR', 'Meter', 'Satuan panjang', 1],
      ['CM', 'Centimeter', null, 1],
      ['ROLL', 'Roll', 'Satuan gulungan', 1],
      ['SET', 'Set', 'Satuan paket lengkap', 1],
      ['BTL', 'Botol', 'Satuan botol', 1],
      ['SAK', 'Sak', 'Satuan karung', 0],
      ['UNIT', 'Unit', 'Satuan unit barang', 0],
    ];

    for (const [code, name, description, is_active] of rows) {
      if (await this.units.exists({ where: { code }, withDeleted: true })) continue;

      await this.units.save(
        this.units.create({
          id: this.uuid.generate(),
          reference: this.shortId.generate({ prefix: 'UN', length: 5 }),
          code,
          name,
          description,
          is_active,
        }),
      );
    }
  }
}
