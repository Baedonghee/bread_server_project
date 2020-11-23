import { EntityRepository, Repository } from 'typeorm';
import { BreadShop } from '../entity/bread-shop';
import { BreadShopImage } from './../entity/bread-shop-image';

@EntityRepository(BreadShopImage)
export class BreadShopImageRepository extends Repository<BreadShopImage> {
  createAndSave(imageUrl: string, breadShop: BreadShop) {
    const breadShopImage = new BreadShopImage();
    breadShopImage.imageUrl = imageUrl;
    breadShopImage.breadShop = breadShop;
    return this.manager.save(breadShopImage);
  }
  deleteById(ids: number[]) {
    return this.delete(ids);
  }
}
