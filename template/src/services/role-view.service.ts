// setara App\Services\RoleViewService::roleView('master_data', 'UnitsView')
//
// ASUMSI (belum melihat RoleViewService.php asli): view dipilih berdasarkan
// role user yang login.
//   1. views/<role>/<folder>/<view>.njk   (jika ada, khusus role tsb)
//   2. views/<folder>/<view>.njk          (default)
// Prefix URL role ("/admin") diteruskan ke view sebagai `rolePrefix`
// dan dipakai template sebagai model.role.
import { existsSync } from 'fs';
import { join } from 'path';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Request, Response } from 'express';
import { viewData } from '../config/view.config';
import { AuthService } from './auth.service';

@Injectable()
export class RoleViewService {
  constructor(private readonly auth: AuthService) {}

  roleView(
    req: Request,
    res: Response,
    folder: string,
    view: string,
    data: Record<string, unknown> = {},
  ): void {
    const user = this.auth.user(req);
    const role = user?.role ?? '';

    const candidates = [
      ...(role ? [`${role}/${folder}/${view}`] : []),
      `${folder}/${view}`,
    ];
    const name = candidates.find((c) =>
      existsSync(join(process.cwd(), 'views', `${c}.njk`)),
    );
    if (!name) throw new NotFoundException(`View [${folder}.${view}] not found.`);

    res.render(
      name,
      viewData(view, { rolePrefix: role ? `/${role}` : '', user, ...data }),
    );
  }
}
