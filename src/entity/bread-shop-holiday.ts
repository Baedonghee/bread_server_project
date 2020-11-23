import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BreadShop } from './bread-shop';

@Entity()
export class BreadShopHoliday {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  day!: string;

  @ManyToOne(() => BreadShop, (breadShop) => breadShop.holidays, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'bread_shop_id' })
  breadShop!: BreadShop;
}
