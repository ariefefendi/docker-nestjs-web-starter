import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

@Controller()
export class HomeController {
  constructor(private readonly auth: AuthService) {}

  /** "/" -> halaman utama sesuai role, atau login. */
  @Get()
  index(@Req() req: Request, @Res() res: Response) {
    const user = this.auth.user(req);
    if (!user) return res.redirect('/login');
    return res.redirect(`/${user.role}/units`);
  }
}
