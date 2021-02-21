import { EntityRepository, Repository } from 'typeorm';
import { BreadShopReview } from '../entity/bread-shop-review';
import { BreadShopReviewImage } from './../entity/bread-shop-review-image';

@EntityRepository(BreadShopReviewImage)
export class BreadShopReviewImageRepository extends Repository<
  BreadShopReviewImage
> {
  createAndSave(imageUrl: string, breadShopReview: BreadShopReview) {
    const breadShopReviewImage = new BreadShopReviewImage();
    breadShopReviewImage.imageUrl = imageUrl;
    breadShopReviewImage.breadShopReview = breadShopReview;
    return this.manager.save(breadShopReviewImage);
  }
  deleteById(ids: number[]) {
    return this.delete(ids);
  }
}
