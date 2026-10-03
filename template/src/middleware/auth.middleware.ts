// middleware/ : setara middleware 'auth' Laravel.
// Belum login -> halaman: redirect ke /login, AJAX/API: 401 JSON.
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly auth: AuthService) {}

  use(req: Request, res: Response, next: NextFunction): void {
    if (this.auth.check(req)) return next();

    const wantsJson =
      req.xhr ||
      req.method !== 'GET' ||
      (req.headers.accept ?? '').includes('application/json');

    if (wantsJson) {
      res.status(401).json({ message: 'Unauthenticated.' });
      return;
    }
    res.redirect('/login');
  }
}
