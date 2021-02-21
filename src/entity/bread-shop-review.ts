import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BreadShop } from './bread-shop';
import { BreadShopReviewImage } from './bread-shop-review-image';
import { User } from './user';

@Entity()
export class BreadShopReview {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  content!: string;

  @Column({
    type: 'timestamp',
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;

  @ManyToOne(() => User, (user) => user.breadShopReviews, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => BreadShop, (breadShop) => breadShop.breadShopReviews, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'bread_shop_id' })
  breadShop!: BreadShop;

  @OneToMany(
    () => BreadShopReviewImage,
    (breadShopReviewImage) => breadShopReviewImage.breadShopReview
  )
  images!: BreadShopReviewImage[];
}
