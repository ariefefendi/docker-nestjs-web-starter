// setara App\Models\User (dipakai auth + RoleViewService)
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class Users {
  @PrimaryColumn({ type: 'char', length: 36 })
  id: string;

  @Column({ length: 100 })
  name: string;

  @Index({ unique: true })
  @Column({ length: 150 })
  email: string;

  /** bcrypt hash */
  @Column({ length: 255 })
  password: string;

  /** menentukan prefix URL & pemilihan view (lihat RoleViewService) */
  @Column({ length: 30, default: 'admin' })
  role: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
