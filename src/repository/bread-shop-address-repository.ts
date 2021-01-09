import { EntityRepository, Repository } from 'typeorm';
import { BreadShopAddress } from '../entity/bread-shop-address';

@EntityRepository(BreadShopAddress)
export class BreadShopAddressRepository extends Repository<BreadShopAddress> {
  createAndSave(
    lat: number,
    lon: number,
    roadAddress: string,
    zibunAddress: string,
    detailAddress: string
  ) {
    const breadShopAddress = new BreadShopAddress();
    breadShopAddress.lat = lat;
    breadShopAddress.lon = lon;
    breadShopAddress.roadAddress = roadAddress || '';
    breadShopAddress.zibunAddress = zibunAddress;
    breadShopAddress.detailAddress = detailAddress;
    return this.manager.save(breadShopAddress);
  }
  deleteById(id: number) {
    return this.delete({ id });
  }
}
