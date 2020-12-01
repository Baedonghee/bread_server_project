import { EntityRepository, Repository } from 'typeorm';
import { BreadShop } from '../entity/bread-shop';
import { BreadShopKind } from '../entity/bread-shop-kind';

@EntityRepository(BreadShopKind)
export class BreadShopKindRepository extends Repository<BreadShopKind> {
  createAndSave(breadShop: BreadShop, breadId: number) {
    const breadShopKind = new BreadShopKind();
    breadShopKind.breadShop = breadShop;
    breadShopKind.bread = breadId;
    return this.manager.save(breadShopKind);
  }

  listAndShopId(id: number) {
    return this.createQueryBuilder('breadShopKind')
      .leftJoin('breadShopKind.bread', 'bread')
      .where('breadShopKind.bread_shop_id = :id', { id })
      .select(['breadShopKind', 'bread'])
      .getMany();
  }
  deleteById(ids: number[]) {
    return this.delete(ids);
  }
}
