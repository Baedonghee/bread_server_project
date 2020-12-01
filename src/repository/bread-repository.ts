import { EntityRepository, Repository } from 'typeorm';
import { AdminUser } from '../entity/admin-user';
import { Bread } from '../entity/bread';

@EntityRepository(Bread)
export class BreadRepository extends Repository<Bread> {
  createAndSave(title: string, content: string, admin: AdminUser) {
    const bread = new Bread();
    bread.title = title;
    bread.content = content;
    bread.admin = admin;
    return this.manager.save(bread);
  }

  list() {
    return this.createQueryBuilder('bread')
      .leftJoin('bread.admin', 'admin')
      .leftJoin('bread.images', 'breadImage')
      .select(['bread', 'breadImage'])
      .getMany();
  }

  findById(id: number) {
    return this.createQueryBuilder('bread')
      .leftJoin('bread.images', 'breadImage')
      .where('bread.id = :id', { id })
      .select(['bread', 'breadImage.imageUrl'])
      .getOne();
  }

  findByIdCheck(id: number) {
    return this.createQueryBuilder('bread')
      .leftJoin('bread.images', 'breadImage')
      .where('bread.id = :id', { id })
      .select(['bread', 'breadImage'])
      .getOne();
  }

  updateAndSave(id: number, title: string, content: string, admin: AdminUser) {
    return this.update(id, {
      title,
      content,
      admin,
    });
  }

  deleteById(id: number) {
    return this.delete({ id });
  }
}
