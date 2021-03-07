import { BreadShop } from '../../entity/bread-shop';

export class UserBreadShopResult {
  id!: number;
  title!: string;
  image: string;
  address: string;
  like = true;

  constructor(data: BreadShop) {
    this.id = data.id;
    this.title = data.title;
    this.image = data.images[0].imageUrl || '';
    const addressSplit = data.address.address.split(' ');
    this.address = addressSplit[0];
  }
}
