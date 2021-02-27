/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { BreadShop } from '../../entity/bread-shop';

interface IShop {
  id: number;
  name: string;
}

export class BreadShopListResult {
  id!: number;
  title!: string;
  link!: string;
  imageUrl: string;
  shopUser!: IShop;

  constructor(data: BreadShop) {
    this.id = data.id;
    this.title = data.title;
    this.link = data.link;
    this.shopUser = {
      id: data.shopUser.id,
      name: data.shopUser.name,
    };
    this.imageUrl = data.images[0].imageUrl;
  }
}
