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
    return this.manager.save(adminUser);
  }
  findByEmail(email: string) {
    return this.findOne({ email });
  }
  findById(id: number) {
    return this.findOne({ id });
  }
}
