import { EntityRepository, Repository } from 'typeorm';
import { BreadShopUserFavorites } from '../entity/bread-shop-user-favorites';
import { User } from '../entity/user';

@EntityRepository(BreadShopUserFavorites)
export class BreadShopUserFavoriteRepository extends Repository<
  BreadShopUserFavorites
> {
  createAndSave(user: User, breadShopId: number) {
    const breadShopUserFavorites = new BreadShopUserFavorites();
    breadShopUserFavorites.user = user;
    breadShopUserFavorites.breadShop = breadShopId;
    return this.manager.save(breadShopUserFavorites);
  }

  findById(userId: number, breadShopId: number) {
    return this.createQueryBuilder('breadShopUserFavorites')
      .innerJoinAndSelect('breadShopUserFavorites.user', 'user')
      .innerJoinAndSelect('breadShopUserFavorites.breadShop', 'bread')
      .where('breadShopUserFavorites.user_id =:userId', { userId })
      .andWhere('breadShopUserFavorites.bread_shop_id =:breadShopId', {
        breadShopId,
      })
      .getOne();
  }

  checkId(userId: number, breadShopId: number) {
    return this.createQueryBuilder('breadShopUserFavorites')
      .where('breadShopUserFavorites.user_id =:userId', { userId })
      .andWhere('breadShopUserFavorites.bread_shop_id =:breadShopId', {
        breadShopId,
      })
      .getRawOne();
  }

  deleteById(user: User, breadShopId: number) {
    return this.delete({
      user,
      breadShop: breadShopId,
    });
  }
}
