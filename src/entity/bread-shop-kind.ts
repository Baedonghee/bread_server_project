import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Bread } from './bread';
import { BreadShop } from './bread-shop';

@Entity()
export class BreadShopKind {
  @ManyToOne(() => BreadShop, (breadShop) => breadShop.breadShopKinds, {
    onDelete: 'CASCADE',
    primary: true,
  })
  @JoinColumn({ name: 'bread_shop_id' })
  breadShop!: BreadShop;

  @ManyToOne(() => Bread, (bread) => bread.breadShopKinds, {
    onDelete: 'CASCADE',
    primary: true,
  })
  @JoinColumn({ name: 'bread_id' })
  bread!: number;
}
