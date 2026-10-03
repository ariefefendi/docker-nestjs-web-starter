// controllers/master_data/units.controller.ts
// Port 1:1 dari App\Http\Controllers\master_data\UnitsController (Laravel):
// controller langsung memakai model (Units), tanpa lapisan service.
//
// URL (sama seperti pola Laravel: {role}/units/...). Setiap route juga
// tersedia tanpa prefix role:
//   GET    /{role}/units               index
//   POST   /{role}/units/getDataAll    getDataAll   (DataTables server side)
//   GET    /{role}/units/getDataSelect getDataSelect
//   POST   /{role}/units/insert        insert
//   POST   /{role}/units/update        update
//   DELETE /{role}/units/delete        destroy
// (Express tidak membedakan huruf besar/kecil, jadi /GetDataSelect juga cocok.)
import {
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response } from 'express';
import { Brackets, Repository } from 'typeorm';
import { all, input } from '../../helpers/request';
import { Units } from '../../models/master_data/units.model';
import { AuthService } from '../../services/auth.service';
import { RoleViewService } from '../../services/role-view.service';
import { ShortIdService } from '../../services/short-id.service';
import { UuidService } from '../../services/uuid.service';
import { ValidatorService } from '../../services/validator.service';

const p = (action: string) => [`units/${action}`, `:role/units/${action}`];

@Controller()
export class UnitsController {
  constructor(
    @InjectRepository(Units) private readonly units: Repository<Units>,
    private readonly auth: AuthService,
    private readonly validator: ValidatorService,
    private readonly uuid: UuidService,
    private readonly shortId: ShortIdService,
    private readonly roleView: RoleViewService,
  ) {}

  @Get(['units', ':role/units'])
  index(@Req() req: Request, @Res() res: Response) {
    if (!this.auth.check(req)) {
      return res.redirect('/login');
    }

    return this.roleView.roleView(req, res, 'master_data', 'UnitsView');
  }

  /**
   * Datatable Server Side
   */
  @Post(p('getDataAll'))
  @HttpCode(200)
  async getDataAll(@Req() req: Request) {
    const filterText = input<string | null>(req, 'filtertext', null);
    const start = Math.max(0, parseInt(String(input(req, 'start', 0)), 10) || 0);
    const length = Math.max(1, parseInt(String(input(req, 'length', 10)), 10) || 10);

    // Total semua data TANPA filter (soft-deleted tidak dihitung)
    const recordsTotal = await this.units.count();

    // Query utama
    const query = this.units.createQueryBuilder('u');

    // GLOBAL SEARCH
    if (filterText) {
      const like = `%${filterText}%`;
      query.where(
        new Brackets((q) => {
          q.where('u.code LIKE :like', { like })
            .orWhere('u.name LIKE :like', { like })
            .orWhere('u.description LIKE :like', { like });
        }),
      );
    }

    // Total setelah filter
    const recordsFiltered = await query.getCount();

    const data = await query
      .orderBy('u.created_at', 'DESC')
      .offset(start)
      .limit(length)
      .getMany();

    return {
      RecordsTotal: recordsTotal,
      RecordsFiltered: recordsFiltered,
      Data: data,
    };
  }

  /**
   * Get single data  (firstOrFail -> 404 jika tidak ada)
   */
  @Get(p('getDataSelect'))
  async getDataSelect(@Req() req: Request) {
    const unit = await this.units.findOneBy({
      reference: input<string>(req, 'reference', '__none__'),
    });
    if (!unit) throw new NotFoundException('No query results for model [Units].');
    return unit;
  }

  /**
   * Insert
   */
  @Post(p('insert'))
  async insert(@Req() req: Request, @Res() res: Response) {
    const data = all(req);

    const validator = await this.validator.make(data, {
      code: 'required|unique:units,code|max:20',
      name: 'required|max:50',
      description: 'nullable|max:255',
      is_active: 'nullable|boolean',
    });

    if (validator.fails) {
      return res.status(422).json({
        result: 'VALIDATION_ERROR',
        errors: validator.errors,
      });
    }

    const uuid = this.uuid.generate();

    const reference = this.shortId.generate({ prefix: 'UN', length: 5 });

    await this.units.save(
      this.units.create({
        id: uuid,
        reference: reference,
        code: data.code as string,
        name: data.name as string,
        description: (data.description as string) ?? null,
        is_active: Number(data.is_active ?? 1),
      }),
    );

    return res.status(200).json({ result: 'OK' });
  }

  /**
   * Update
   */
  @Post(p('update'))
  async update(@Req() req: Request, @Res() res: Response) {
    const data = all(req);

    const validator = await this.validator.make(data, {
      id: 'required|max:36',
      code: 'required|max:20|unique:units,code,' + (data.id ?? '') + ',id',
      name: 'required|max:50',
      description: 'nullable|max:255',
      is_active: 'nullable|boolean',
    });

    if (validator.fails) {
      return res.status(422).json({
        result: 'VALIDATION_ERROR',
        errors: validator.errors,
      });
    }

    // findOrFail
    const unit = await this.units.findOneBy({ id: data.id as string });
    if (!unit) throw new NotFoundException('No query results for model [Units].');

    unit.code = data.code as string;
    unit.name = data.name as string;
    unit.description = (data.description as string) ?? null;
    unit.is_active = Number(data.is_active ?? 1);
    await this.units.save(unit);

    return res.status(200).json({ result: 'OK' });
  }

  /**
   * Delete  (soft delete: mengisi deleted_at)
   */
  @Delete(p('delete'))
  async destroy(@Req() req: Request) {
    const reference = input<string | null>(req, 'reference', null);
    if (reference) {
      await this.units.softDelete({ reference });
    }
    return { result: 'OK' };
  }
}
