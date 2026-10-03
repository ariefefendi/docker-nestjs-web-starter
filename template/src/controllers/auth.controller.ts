// Login / logout minimal (session). Ganti dengan auth milik Anda bila sudah ada.
import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { viewData } from '../config/view.config';
import { input } from '../helpers/request';
import { AuthService } from '../services/auth.service';

@Controller()
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Get('login')
  showLogin(@Req() req: Request, @Res() res: Response) {
    if (this.auth.check(req)) return res.redirect('/');
    return res.render('auth/login', viewData('Login'));
  }

  @Post('login')
  async login(@Req() req: Request, @Res() res: Response) {
    const email = input<string>(req, 'email', '');
    const password = input<string>(req, 'password', '');

    if (await this.auth.attempt(req, email, password)) {
      return res.redirect('/');
    }
    return res
      .status(422)
      .render('auth/login', viewData('Login', { error: 'Email atau password salah.', email }));
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    await this.auth.logout(req);
    return res.redirect('/login');
  }
}
