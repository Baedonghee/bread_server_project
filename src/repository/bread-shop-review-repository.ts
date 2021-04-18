import { EntityRepository, Repository } from 'typeorm';
import { BreadShop } from '../entity/bread-shop';
import { User } from '../entity/user';
import { BreadShopReview } from './../entity/bread-shop-review';

@EntityRepository(BreadShopReview)
export class BreadShopReviewRepository extends Repository<BreadShopReview> {
  createAndSave(content: string, user: User, breadShop: BreadShop) {
    const breadShopReview = new BreadShopReview();
    breadShopReview.content = content;
    breadShopReview.user = user;
    breadShopReview.breadShop = breadShop;
    return this.manager.save(breadShopReview);
  }

  list(breadShopId: number) {
    return this.createQueryBuilder('breadShopReview')
      .innerJoin('breadShopReview.images', 'breadShopReviewImage')
      .innerJoin('breadShopReview.user', 'user')
      .select(['breadShopReview', 'breadShopReviewImage', 'user'])
      .where('breadShopReview.bread_shop_id = :breadShopId', { breadShopId })
      .orderBy('breadShopReview.createdAt', 'DESC')
      .getMany();
  }

  findById(id: number) {
    return this.createQueryBuilder('breadShopReview')
      .select(['breadShopReview', 'breadShopReviewImage'])
      .innerJoin('breadShopReview.images', 'breadShopReviewImage')
      .where('breadShopReview.id =:id', { id })
      .getOne();
  }

  updateAndSave(id: number, content: string) {
    return this.update(id, {
      content,
    });
  }

  deleteById(id: number) {
    return this.delete({ id });
  }
}
