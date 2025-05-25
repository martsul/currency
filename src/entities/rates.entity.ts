import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity()
@Index(['from', 'to'], { unique: true })
export class Rates {
  @PrimaryColumn()
  id: string;

  @Column()
  from: string;

  @Column()
  to: string;

  @Column('decimal', { precision: 18, scale: 8, nullable: false, default: 0 })
  rate: number;

  @Column('decimal', { precision: 18, scale: 8, nullable: true })
  staticRate: number;

  @Column({ nullable: true })
  percent: number;

  @Column({ default: false })
  isAffect: boolean;

  @Column('varchar', { nullable: true })
  error: string | null;
}
