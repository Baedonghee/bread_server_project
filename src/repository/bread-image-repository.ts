import { EntityRepository, Repository } from 'typeorm';
import { Bread } from '../entity/bread';
import { BreadImage } from '../entity/bread-image';

@EntityRepository(BreadImage)
export class BreadImageRepository extends Repository<BreadImage> {
  createAndSave(imageUrl: string, bread: Bread) {
    const breadImage = new BreadImage();
    breadImage.imageUrl = imageUrl;
    breadImage.bread = bread;
    return this.manager.save(breadImage);
  }
  deleteById(ids: number[]) {
    return this.delete(ids);
  }
}
