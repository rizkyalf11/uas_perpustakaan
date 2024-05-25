import { Peminjaman } from 'src/peminjaman/peminjaman.entity';
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
} from 'typeorm';

@Entity()
export class Pengembalian extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, type: 'date' })
  tanggal_pengembalian: Date;

  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2 })
  denda: number;

  @OneToOne(() => Peminjaman, (peminjaman) => peminjaman.pengembalian)
  @JoinColumn({ name: 'peminjaman_id' })
  peminjaman_id: Peminjaman;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
