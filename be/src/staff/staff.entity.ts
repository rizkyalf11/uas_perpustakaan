import { Message } from 'src/chat/msg.entity';
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';

export enum StaffRole {
  ADMIN = 'admin',
  PUSTAKAWAN = 'pustakawan',
}

@Entity()
export class Staff extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nama: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false, type: 'enum', enum: StaffRole })
  role: StaffRole;

  @Column({ nullable: false, type: 'decimal', precision: 10, scale: 2 })
  gaji: number;

  @Column({ nullable: true })
  refresh_token: string;

  @OneToMany(() => Message, (message) => message.penerima)
  sentMessages: Message[];

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
