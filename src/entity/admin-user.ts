import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

import { Youtube } from './youtube';
import { Event } from './event';
import { Notice } from './notice';
import { ShopUser } from './shop-user';
import { BreadShop } from './bread-shop';
import { Bread } from './bread';

@Entity()
export class AdminUser {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true, unique: true })
  email!: string;

  @Column({ nullable: true, select: false })
  password!: string;

  @Column({ nullable: false })
  name!: string;

  @Column()
  type!: number;

  @Column()
  imageUrl!: string;

  @Column({ default: true })
  enabled!: boolean;

  @Column({
    type: 'timestamp',
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;

  @Column({
    type: 'timestamp',
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt!: Date;

  @OneToMany(() => Notice, (notice) => notice.admin)
  notices!: Notice[];

  @OneToMany(() => Event, (event) => event.admin)
  events!: Event[];

  @OneToMany(() => ShopUser, (shopUser) => shopUser.admin)
  shopUsers!: ShopUser[];

  @OneToMany(() => Youtube, (youtube) => youtube.admin)
  youtubes!: Youtube[];

  @OneToMany(() => BreadShop, (breadShop) => breadShop.admin)
  breadShops!: BreadShop[];

  @OneToMany(() => Bread, (bread) => bread.admin)
  breads!: Bread[];
}
