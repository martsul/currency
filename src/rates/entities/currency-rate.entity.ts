import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class CurrencyRate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  from: string;

  @Column()
  to: string;

  @Column('decimal', { precision: 18, scale: 8 })
  rate: number;

  @CreateDateColumn()
  createdAt: Date;
}
