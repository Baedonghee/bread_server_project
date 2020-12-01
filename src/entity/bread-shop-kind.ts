import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Bread } from './bread';
import { BreadShop } from './bread-shop';

@Entity()
export class BreadShopKind {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => BreadShop, (breadShop) => breadShop.breadShopKinds, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'bread_shop_id' })
  breadShop!: BreadShop;

  @ManyToOne(() => Bread, (breadShop) => breadShop.breadShopKinds, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'bread_id' })
  bread!: number;
}
