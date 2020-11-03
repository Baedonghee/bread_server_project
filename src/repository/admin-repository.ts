import { EntityRepository, Repository } from 'typeorm';
import { AdminUser } from '../entity/admin-user';

@EntityRepository(AdminUser)
export class AdminRespository extends Repository<AdminUser> {
  createAndSave(email: string, password: string, type: number, name: string) {
    const adminUser = new AdminUser();
    adminUser.email = email;
    adminUser.password = password;
    adminUser.type = type;
    adminUser.name = name;
    adminUser.imageUrl =
      'https://s3.ap-northeast-2.amazonaws.com/image.mercuryeunoia.com/images/user/default_image.jpeg';
    return this.manager.save(adminUser);
  }
  findByEmail(email: string) {
    return this.findOne({
      where: { email },
      select: ['id', 'password', 'enabled'],
    });
  }
  findById(id: number) {
    return this.findOne({ id });
  }
  updateAndProfile(id: number, updateProfile: any) {
    return this.update(id, updateProfile);
  }
  updateAndEnabled(id: number) {
    return this.update(id, { enabled: false });
  }
}
