import { Anggota } from 'src/anggota/anggota.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Anggota, { eager: true })
  @JoinColumn({ name: 'id_anggota' })
  id_anggota: Anggota;

  @Column()
  penerima: string;

  @Column()
  pengirim: string;

  @Column()
  pesan: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
