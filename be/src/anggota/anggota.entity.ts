import { ResetPassword } from 'src/auth/resetpw.entity';
import { Message } from 'src/chat/msg.entity';
import { Peminjaman } from 'src/peminjaman/peminjaman.entity';
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';

@Entity()
export class Anggota extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nama: string;

  @Column({ nullable: false })
  alamat: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: true })
  refresh_token: string;

  @OneToMany(() => Peminjaman, (v) => v.id_anggota, {
    cascade: ['insert', 'update'],
  })
  peminjaman: Peminjaman[];

  @OneToMany(() => ResetPassword, (reset) => reset.anggota_id)
  reset_password: ResetPassword;

  @OneToMany(() => Message, (message) => message.penerima)
  receivedMessages: Message[];

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
