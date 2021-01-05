/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { BreadShop } from '../../entity/bread-shop';

interface IShop {
  id: number;
  name: string;
}

interface IBread {
  id: number;
  title: string;
}

export class BreadShopListResult {
  id!: number;
  title!: string;
  link!: string;
  shopUser!: IShop;
  bread: IBread[] = [];

  constructor(data: BreadShop) {
    this.id = data.id;
    this.title = data.title;
    this.link = data.link;
    this.shopUser = {
      id: data.shopUser.id,
      name: data.shopUser.name,
    };
    data.breadShopKinds.forEach((breadInfo: any) => {
      const breadData = {
        id: breadInfo.bread.id,
        title: breadInfo.bread.title,
      };
      this.bread.push(breadData);
    });
  }
}
