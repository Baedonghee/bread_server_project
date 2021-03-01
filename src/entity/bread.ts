import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AdminUser } from './admin-user';
import { BreadImage } from './bread-image';
import { BreadShopKind } from './bread-shop-kind';
import { BreadComment } from './bread-comment';
import { BreadUserFavorites } from './bread-user-favorites';

@Entity()
export class Bread {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  content!: string;

  @Column({ name: 'rank', nullable: false, default: 0 })
  rank!: number;

  @ManyToOne(() => AdminUser, (user) => user.breads)
  @JoinColumn({ name: 'admin_id' })
  admin!: AdminUser;

  @OneToMany(() => BreadImage, (breadImage) => breadImage.bread, {
    eager: true,
  })
  images!: BreadImage[];

  @OneToMany(() => BreadShopKind, (breadShopKind) => breadShopKind.bread)
  breadShopKinds!: BreadShopKind[];

  @OneToMany(() => BreadComment, (breadComment) => breadComment.bread)
  breadComments!: BreadComment[];

  @OneToMany(
    () => BreadUserFavorites,
    (breadUserFavorites) => breadUserFavorites.bread
  )
  breadUserFavorites!: BreadUserFavorites[];
}
