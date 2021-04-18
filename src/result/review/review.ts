import { BreadShopReview } from '../../entity/bread-shop-review';

interface IUser {
  id: number;
  name: string;
  imageUrl: string;
}

export class BreadShopReviewResult {
  id!: number;
  content!: string;
  createdAt!: Date;
  images: string[] = [];
  user!: IUser;

  constructor(data: BreadShopReview) {
    this.id = data.id;
    this.content = data.content;
    this.createdAt = data.createdAt;
    data.images.forEach((breadShopReviewImage) =>
      this.images.push(breadShopReviewImage.imageUrl)
    );
    this.user = {
      id: data.user.id,
      name: data.user.name,
      imageUrl: data.user.imageUrl,
    };
  }
}
