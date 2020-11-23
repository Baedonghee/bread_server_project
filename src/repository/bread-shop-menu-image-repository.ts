import { EntityRepository, Repository } from 'typeorm';
import { BreadShop } from '../entity/bread-shop';
import { BreadShopMenuImage } from '../entity/bread-shop-menu-image';

@EntityRepository(BreadShopMenuImage)
export class BreadShopMenuImageRepository extends Repository<
  BreadShopMenuImage
> {
  createAndSave(imageUrl: string, breadShop: BreadShop) {
    const breadShopMenuImage = new BreadShopMenuImage();
    breadShopMenuImage.imageUrl = imageUrl;
    breadShopMenuImage.breadShop = breadShop;
    return this.manager.save(breadShopMenuImage);
  }
  deleteById(ids: number[]) {
    return this.delete(ids);
  }
}
