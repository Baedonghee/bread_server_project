import { EntityRepository, Repository } from 'typeorm';
import { AdminUser } from '../entity/admin-user';
import { ShopUser } from '../entity/shop-user';

@EntityRepository(ShopUser)
export class ShopUserRepository extends Repository<ShopUser> {
  createAndSave(
    name: string,
    phoneNumber: string,
    imageUrl: string,
    admin: AdminUser
  ) {
    const shopUser = new ShopUser();
    shopUser.name = name;
    shopUser.phoneNumber = phoneNumber;
    shopUser.imageUrl =
      imageUrl ||
      'https://s3.ap-northeast-2.amazonaws.com/image.mercuryeunoia.com/images/shop/default_image.jpeg';
    shopUser.admin = admin;
    return this.manager.save(shopUser);
  }

  list() {
    return this.createQueryBuilder('shopUser')
      .leftJoin('shopUser.admin', 'admin')
      .select(['shopUser', 'admin.email', 'admin.name'])
      .getMany();
  }

  findById(id: number) {
    return this.createQueryBuilder('shopUser')
      .leftJoin('shopUser.admin', 'admin')
      .where('shopUser.id = :id', { id })
      .select(['shopUser', 'admin.email', 'admin.name'])
      .getOne();
  }

  updateAndSave(
    id: number,
    name: string,
    phoneNumber: string,
    imageUrl: string,
    admin: AdminUser
  ) {
    const updateShop = {
      name,
      phoneNumber,
      admin,
    } as {
      name: string;
      phoneNumber: string;
      imageUrl?: string;
      admin: AdminUser;
    };
    if (imageUrl) {
      updateShop.imageUrl = imageUrl;
    }

    return this.update(id, updateShop);
  }

  updateAndEnable(id: number, enabled: boolean) {
    return this.update(id, { enabled });
  }
}