import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { BreadComment } from './bread-comment';
import { BreadShopComment } from './bread-shop-comment';
import { BreadShopReview } from './bread-shop-review';
import { BreadShopUserFavorites } from './bread-shop-user-favorites';
import { BreadUserFavorites } from './bread-user-favorites';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false, unique: true })
  email!: string;

  @Column({ nullable: true, select: false })
  password!: string;

  @Column({ nullable: false })
  name!: string;

  @Column({ nullable: false })
  imageUrl!: string;

  @Column({ nullable: true })
  age!: number;

  @Column({ nullable: true })
  gender!: boolean;

  @Column({ default: true })
  enabled!: boolean;

  @Column({ default: 0 })
  type!: number;

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

  @OneToMany(() => BreadComment, (breadComment) => breadComment.user)
  breadComments!: BreadComment[];

  @OneToMany(
    () => BreadShopComment,
    (breadShopComment) => breadShopComment.user
  )
  breadShopComments!: BreadShopComment[];

  @OneToMany(() => BreadShopReview, (breadShopReview) => breadShopReview.user)
  breadShopReviews!: BreadShopReview[];

  @OneToMany(
    () => BreadUserFavorites,
    (breadUserFavorites) => breadUserFavorites.user
  )
  breadUserFavorites!: BreadUserFavorites[];

  @OneToMany(
    () => BreadShopUserFavorites,
    (breadShopUserFavorites) => breadShopUserFavorites.user
  )
  breadShopFavorites!: BreadUserFavorites[];
}
