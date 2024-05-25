import { Anggota } from 'src/anggota/anggota.entity';
import { Buku } from 'src/book/book.entity';
import { Pengembalian } from 'src/pengembalian/pengembalian.entity';
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';

@Entity()
export class Peminjaman extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, type: 'boolean', default: false })
  is_return: boolean;

  @Column({ nullable: false, type: 'date' })
  tanggal_pinjam: Date;

  @Column({ nullable: false, type: 'date' })
  tanggal_kembali: Date;

  @ManyToOne(() => Anggota, (v) => v.peminjaman, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_anggota' })
  id_anggota: Anggota;

  @ManyToOne(() => Buku, (v) => v.peminjaman, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_buku' })
  id_buku: Buku;

  @OneToOne(() => Pengembalian, (pengembalian) => pengembalian.peminjaman_id)
  pengembalian: Pengembalian;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
