import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BreadShopReview } from './bread-shop-review';

@Entity()
export class BreadShopReviewImage {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'image_url' })
  imageUrl!: string;

  @ManyToOne(
    () => BreadShopReview,
    (breadShopReview) => breadShopReview.images,
    {
      onDelete: 'CASCADE',
    }
  )
  @JoinColumn({ name: 'bread_shop_review_id' })
  breadShopReview!: BreadShopReview;
}
