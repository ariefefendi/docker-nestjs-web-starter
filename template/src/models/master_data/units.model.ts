// models/ : setara App\Models\master_data\Units (Eloquent)
//   - SoftDeletes        -> @DeleteDateColumn (kolom deleted_at)
//   - $incrementing=false, $keyType='string' -> primary key char(36) (UUID)
//   - $timestamps        -> created_at / updated_at
//   - $fillable          -> id, reference, code, name, description, is_active
// Nama properti sengaja snake_case agar JSON sama dengan Eloquent.
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('units')
export class Units {
  @PrimaryColumn({ type: 'char', length: 36 })
  id: string;

  @Index({ unique: true })
  @Column({ length: 20 })
  reference: string;

  @Index({ unique: true })
  @Column({ length: 20 })
  code: string;

  @Column({ length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string | null;

  @Column({ type: 'tinyint', default: 1 })
  is_active: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date | null;
}
