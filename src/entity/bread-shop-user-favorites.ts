import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BreadShop } from './bread-shop';
import { User } from './user';

@Entity()
export class BreadShopUserFavorites {
  @ManyToOne(() => User, (user) => user.breadShopFavorites, {
    onDelete: 'CASCADE',
    primary: true,
  })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => BreadShop, (breadShop) => breadShop.breadShopFavorites, {
    onDelete: 'CASCADE',
    primary: true,
  })
  @JoinColumn({ name: 'bread_shop_id' })
  breadShop!: number;
}
