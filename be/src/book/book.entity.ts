import { Peminjaman } from 'src/peminjaman/peminjaman.entity';
import { Staff } from 'src/staff/staff.entity';
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Buku extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  judul: string;

  @Column({ nullable: false })
  pengarang: string;

  @Column({ nullable: false })
  tahun_terbit: number;

  @Column({ nullable: false })
  jumlah_kopi: number;

  @Column({ nullable: false })
  cover: string;

  @OneToMany(() => Peminjaman, (v) => v.id_buku, {
    cascade: ['insert', 'update'],
  })
  peminjaman: Peminjaman[];

  @ManyToOne(() => Staff)
  @JoinColumn({ name: 'created_by' })
  created_by: Staff;

  @ManyToOne(() => Staff)
  @JoinColumn({ name: 'updated_by' })
  updated_by: Staff;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
