/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { BreadShop } from '../../entity/bread-shop';

interface IBread {
  title: string;
  image: string;
}

interface IShop {
  id: number;
  name: string;
}

interface IAddress {
  lat: number;
  lon: number;
  address: string;
  detailAddress: string;
}

export class BreadShopDetailResult {
  id!: number;
  title!: string;
  storeNumber!: string;
  link!: string;
  parkingEnabled!: boolean;
  openTime!: string;
  closeTime!: string;
  bread: IBread[] = [];
  shopUser!: IShop;
  address!: IAddress;
  images: string[] = [];
  menuImages: string[] = [];
  holidays: string[] = [];

  constructor(data: BreadShop) {
    this.id = data.id;
    this.title = data.title;
    this.storeNumber = data.storeNumber;
    this.link = data.link;
    this.parkingEnabled = data.parkingEnabled;
    this.openTime = data.openTime;
    this.closeTime = data.closeTime;
    data.breadShopKinds.forEach((breadInfo: any) => {
      const breadData = {
        title: breadInfo.bread.title,
        image: breadInfo.bread.images[0].imageUrl,
      };
      this.bread.push(breadData);
    });
    this.shopUser = {
      id: data.shopUser.id,
      name: data.shopUser.name,
    };
    this.address = {
      lat: data.address.lat,
      lon: data.address.lon,
      address: data.address.address,
      detailAddress: data.address.detailAddress,
    };
    data.images.forEach((breadShopImage) =>
      this.images.push(breadShopImage.imageUrl)
    );
    data.menuImages.forEach((breadShopMenuImage) =>
      this.menuImages.push(breadShopMenuImage.imageUrl)
    );
    data.holidays.forEach((breadShopHoliday) =>
      this.holidays.push(breadShopHoliday.day)
    );
  }
}
