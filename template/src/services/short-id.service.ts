// setara App\Services\ShortIdService
import { randomInt } from 'crypto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ShortIdService {
  /** generate({ prefix: 'UN', length: 5 }) -> "UN7K2QX" */
  generate({ prefix = '', length = 5 }: { prefix?: string; length?: number } = {}): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let out = '';
    for (let i = 0; i < length; i++) out += chars[randomInt(chars.length)];
    return prefix + out;
  }
}
