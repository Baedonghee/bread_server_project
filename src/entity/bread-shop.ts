import { Youtube } from './youtube';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AdminUser } from './admin-user';
import { BreadShopAddress } from './bread-shop-address';
import { BreadShopHoliday } from './bread-shop-holiday';
import { BreadShopImage } from './bread-shop-image';
import { BreadShopKind } from './bread-shop-kind';
import { BreadShopMenuImage } from './bread-shop-menu-image';
import { ShopUser } from './shop-user';

@Entity()
export class BreadShop {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  title!: string;

  @Column({ nullable: false })
  link!: string;

  @Column({ nullable: false })
  storeNumber!: string;

  @Column({ name: 'parking_enabled', nullable: false })
  parkingEnabled!: boolean;

  @Column({ name: 'open_time', nullable: false })
  openTime!: string;

  @Column({ name: 'close_time', nullable: false })
  closeTime!: string;

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

  @ManyToOne(() => ShopUser, (shopUser) => shopUser.breadShops, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'shop_user_id' })
  shopUser!: ShopUser;

  @ManyToOne(() => AdminUser, (user) => user.breadShops)
  @JoinColumn({ name: 'admin_id' })
  admin!: AdminUser;

  @OneToOne(() => BreadShopAddress)
  @JoinColumn({ name: 'bread_shop_address_id' })
  address!: BreadShopAddress;

  @OneToMany(() => BreadShopImage, (breadShopImage) => breadShopImage.breadShop)
  images!: BreadShopImage[];

  @OneToMany(
    () => BreadShopMenuImage,
    (breadShopMenuImage) => breadShopMenuImage.breadShop
  )
  menuImages!: BreadShopMenuImage[];

  @OneToMany(
    () => BreadShopHoliday,
    (breadShopHoliday) => breadShopHoliday.breadShop
  )
  holidays!: BreadShopHoliday[];

  @OneToMany(() => BreadShopKind, (breadShopKind) => breadShopKind.breadShop)
  breadShopKinds!: BreadShopKind[];

  @OneToMany(() => Youtube, (youtube) => youtube.breadShop)
  youtubes!: Youtube[];
}
