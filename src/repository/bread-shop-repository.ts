import { EntityRepository, Repository } from 'typeorm';
import { AdminUser } from '../entity/admin-user';
import { BreadShop } from '../entity/bread-shop';
import { BreadShopAddress } from '../entity/bread-shop-address';
import { ShopUser } from '../entity/shop-user';

@EntityRepository(BreadShop)
export class BreadShopRepository extends Repository<BreadShop> {
  createAndSave(
    title: string,
    link: string,
    parkingEnabled: boolean,
    openTime: string,
    closeTime: string,
    address: BreadShopAddress,
    shopUser: ShopUser,
    admin: AdminUser
  ) {
    const breadShop = new BreadShop();
    breadShop.title = title;
    breadShop.link = link;
    breadShop.parkingEnabled = parkingEnabled;
    breadShop.openTime = openTime;
    breadShop.closeTime = closeTime;
    breadShop.address = address;
    breadShop.shopUser = shopUser;
    breadShop.admin = admin;
    return this.manager.save(breadShop);
  }

  list() {
    return this.createQueryBuilder('breadShop')
      .leftJoin('breadShop.admin', 'admin')
      .leftJoin('breadShop.shopUser', 'shopUser')
      .leftJoin('breadShop.address', 'breadShopAddress')
      .leftJoin('breadShop.images', 'breadShopImage')
      .leftJoin('breadShop.menuImages', 'breadShopMenuImage')
      .leftJoin('breadShop.holidays', 'breadShopHoliday')
      .select([
        'breadShop',
        'breadShopAddress',
        'breadShopAddress.lat',
        'breadShopAddress.lon',
        'breadShopAddress.roadAddress',
        'breadShopAddress.zibunAddress',
        'breadShopImage.imageUrl',
        'breadShopMenuImage.imageUrl',
        'breadShopHoliday.day',
        'shopUser.name',
        'shopUser.imageUrl',
        'admin.email',
        'admin.name',
      ])
      .orderBy('breadShop.id', 'DESC')
      .getMany();
  }

  findById(id: number) {
    return this.createQueryBuilder('breadShop')
      .leftJoin('breadShop.admin', 'admin')
      .leftJoin('breadShop.shopUser', 'shopUser')
      .leftJoin('breadShop.address', 'breadShopAddress')
      .leftJoin('breadShop.images', 'BreadShopImage')
      .leftJoin('breadShop.menuImages', 'BreadShopMenuImage')
      .leftJoin('breadShop.holidays', 'BreadShopHoliday')
      .where('breadShop.id = :id', { id })
      .select([
        'breadShop',
        'breadShopAddress',
        'breadShopAddress.lat',
        'breadShopAddress.lon',
        'breadShopAddress.roadAddress',
        'breadShopAddress.zibunAddress',
        'BreadShopImage.imageUrl',
        'BreadShopMenuImage.imageUrl',
        'BreadShopHoliday.day',
        'shopUser.name',
        'shopUser.imageUrl',
        'admin.email',
        'admin.name',
      ])
      .getOne();
  }

  findByIdCheck(id: number) {
    return this.createQueryBuilder('breadShop')
      .leftJoin('breadShop.admin', 'admin')
      .leftJoin('breadShop.shopUser', 'shopUser')
      .leftJoin('breadShop.address', 'breadShopAddress')
      .leftJoin('breadShop.images', 'BreadShopImage')
      .leftJoin('breadShop.menuImages', 'BreadShopMenuImage')
      .leftJoin('breadShop.holidays', 'BreadShopHoliday')
      .where('breadShop.id = :id', { id })
      .select([
        'breadShop',
        'breadShopAddress',
        'BreadShopImage',
        'BreadShopMenuImage',
        'BreadShopHoliday',
        'shopUser.name',
        'shopUser.imageUrl',
        'admin.email',
        'admin.name',
      ])
      .getOne();
  }

  updateAndSave(
    id: number,
    title: string,
    link: string,
    parkingEnabled: boolean,
    openTime: string,
    closeTime: string,
    address: BreadShopAddress | null,
    shopUser: ShopUser,
    admin: AdminUser
  ) {
    const updateBreadShop = {
      title,
      link,
      parkingEnabled,
      openTime,
      closeTime,
      shopUser,
      admin,
    } as {
      title: string;
      link: string;
      parkingEnabled: boolean;
      openTime: string;
      closeTime: string;
      shopUser: ShopUser;
      admin: AdminUser;
      address: BreadShopAddress;
    };
    if (address) {
      updateBreadShop.address = address;
    }
    return this.update(id, updateBreadShop);
  }

  deleteById(id: number) {
    return this.delete({ id });
  }
}
