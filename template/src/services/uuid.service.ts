// services/ : setara App\Services\UuidService
import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UuidService {
  /** app(UuidService::class)->generate() */
  generate(): string {
    return randomUUID();
  }
}
