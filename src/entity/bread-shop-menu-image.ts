import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BreadShop } from './bread-shop';

@Entity()
export class BreadShopMenuImage {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'image_url' })
  imageUrl!: string;

  @ManyToOne(() => BreadShop, (breadShop) => breadShop.menuImages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'bread_shop_id' })
  breadShop!: BreadShop;
}
