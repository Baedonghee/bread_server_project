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
    storeNumber: string,
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
    breadShop.storeNumber = storeNumber;
    breadShop.parkingEnabled = parkingEnabled;
    breadShop.openTime = openTime;
    breadShop.closeTime = closeTime;
    breadShop.address = address;
    breadShop.shopUser = shopUser;
    breadShop.admin = admin;
    return this.manager.save(breadShop);
  }

  list(page: number, limit: number, title?: string) {
    const query = this.createQueryBuilder('breadShop')
      .leftJoinAndSelect('breadShop.address', 'breadShopAddress')
      .leftJoinAndSelect('breadShop.shopUser', 'shopUser')
      .leftJoinAndSelect('breadShop.images', 'breadShopImage')
      .leftJoinAndSelect('breadShop.breadShopKinds', 'breadShopKinds')
      .leftJoinAndSelect('breadShopKinds.bread', 'bread')
      .offset((page - 1) * limit)
      .take(limit)
      .orderBy('breadShop.id', 'DESC');
    if (title) {
      query.andWhere('breadShop.title like :title', { title: `%${title}%` });
    }
    return query.getManyAndCount();
  }

  breadShopList(
    page: number,
    limit: number,
    userId: number,
    title?: string,
    address?: string
  ) {
    const query = this.createQueryBuilder('breadShop')
      .leftJoinAndSelect('breadShop.address', 'breadShopAddress')
      .leftJoinAndSelect('breadShop.images', 'breadShopImage')
      .select([
        'breadShop.id AS id',
        'title',
        'breadShopImage.imageUrl AS image',
        'breadShopAddress.address AS address',
      ]);
    if (title) {
      query.andWhere('breadShop.title like :title', { title: `%${title}%` });
    }
    if (address) {
      query.andWhere('breadShopAddress.address like :address', {
        address: `%${address}%`,
      });
    }
    if (!userId) {
      query.addSelect('0', 'like');
    }
    query
      .offset((page - 1) * limit)
      .limit(limit)
      .orderBy('breadShop.id', 'DESC')
      .groupBy('breadShop.id');
    return query.getRawMany();
  }

  rankList(
    page: number,
    limit: number,
    userId: number,
    title?: string,
    address?: string
  ) {
    const query = this.createQueryBuilder('breadShop')
      .leftJoinAndSelect('breadShop.address', 'breadShopAddress')
      .leftJoinAndSelect('breadShop.images', 'breadShopImage')
      .select([
        'breadShop.id AS id',
        'title',
        'breadShopImage.imageUrl AS image',
        'breadShopAddress.address AS address',
      ]);
    if (title) {
      query.andWhere('breadShop.title like :title', { title: `%${title}%` });
    }
    if (address) {
      query.andWhere('breadShopAddress.address like :address', {
        address: `%${address}%`,
      });
    }
    if (!userId) {
      query.addSelect('0', 'like');
    }
    query
      .offset((page - 1) * limit)
      .limit(limit)
      .orderBy('breadShop.rank', 'DESC')
      .groupBy('breadShop.id');
    return query.getRawMany();
  }

  userBreadShopList(page: number, limit: number, userId: number) {
    const query = this.createQueryBuilder('breadShop')
      .leftJoinAndSelect('breadShop.address', 'breadShopAddress')
      .leftJoinAndSelect('breadShop.images', 'breadShopImage')
      .leftJoinAndSelect(
        'breadShop.breadShopFavorites',
        'breadShopUserFavorites'
      )
      .where('breadShopUserFavorites.user.id = :userId', { userId })
      .offset((page - 1) * limit)
      .limit(limit)
      .orderBy('breadShop.id', 'DESC');
    return query.getManyAndCount();
  }

  findById(id: number) {
    return this.createQueryBuilder('breadShop')
      .innerJoin('breadShop.admin', 'admin')
      .innerJoin('breadShop.shopUser', 'shopUser')
      .innerJoin('breadShop.address', 'breadShopAddress')
      .innerJoin('breadShop.images', 'BreadShopImage')
      .innerJoin('breadShop.menuImages', 'BreadShopMenuImage')
      .innerJoin('breadShop.holidays', 'BreadShopHoliday')
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

  findByIdWithBread(id: number) {
    return this.createQueryBuilder('breadShop')
      .innerJoinAndSelect('breadShop.shopUser', 'shopUser')
      .innerJoinAndSelect('breadShop.address', 'breadShopAddress')
      .innerJoinAndSelect('breadShop.images', 'BreadShopImage')
      .innerJoinAndSelect('breadShop.menuImages', 'BreadShopMenuImage')
      .innerJoinAndSelect('breadShop.holidays', 'BreadShopHoliday')
      .where('breadShop.id = :id', { id })
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

  findByIdInfo(id: number) {
    return this.createQueryBuilder('breadShop')
      .select(['breadShop'])
      .where('breadShop.id = :id', { id })
      .getOne();
  }

  updateAndSave(
    id: number,
    title: string,
    storeNumber: string,
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
      storeNumber,
      parkingEnabled,
      openTime,
      closeTime,
      shopUser,
      admin,
    } as {
      title: string;
      link: string;
      storeNumber: string;
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

  updateAndRank(id: number, rank: number) {
    return this.update(id, { rank });
  }

  deleteById(id: number) {
    return this.delete({ id });
  }

  findAllCount(title?: string, address?: string) {
    const query = this.createQueryBuilder('breadShop')
      .leftJoinAndSelect('breadShop.address', 'breadShopAddress')
      .leftJoinAndSelect('breadShop.images', 'breadShopImage')
      .select([
        'breadShop.id AS id',
        'title',
        'breadShopImage.imageUrl AS image',
        'breadShopAddress.address AS address',
      ]);
    if (title) {
      query.andWhere('breadShop.title like :title', { title: `%${title}%` });
    }
    if (address) {
      query.andWhere('breadShopAddress.address like :address', {
        address: `%${address}%`,
      });
    }
    return query.getCount();
  }
}
