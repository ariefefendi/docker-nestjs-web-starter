// setara auth()->check() / auth()->user() / Auth::attempt()  (berbasis session)
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { Users } from '../models/users.model';

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

declare module 'express-session' {
  interface SessionData {
    user?: SessionUser;
  }
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users) private readonly users: Repository<Users>,
  ) {}

  /** auth()->check() */
  check(req: Request): boolean {
    return !!req.session?.user;
  }

  /** auth()->user() */
  user(req: Request): SessionUser | null {
    return req.session?.user ?? null;
  }

  /** Auth::attempt(['email' => ..., 'password' => ...]) */
  async attempt(req: Request, email: string, password: string): Promise<boolean> {
    const u = await this.users.findOneBy({ email });
    if (!u || !(await bcrypt.compare(password, u.password))) return false;

    await new Promise<void>((resolve, reject) =>
      req.session.regenerate((err) => (err ? reject(err) : resolve())),
    );
    req.session.user = { id: u.id, name: u.name, email: u.email, role: u.role };
    return true;
  }

  /** Auth::logout() */
  logout(req: Request): Promise<void> {
    return new Promise((resolve) => req.session.destroy(() => resolve()));
  }
}
