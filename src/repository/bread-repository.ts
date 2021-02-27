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

  list(page: number, limit: number, title?: string) {
    const query = this.createQueryBuilder('bread')
      .leftJoin('bread.admin', 'admin')
      .leftJoin('bread.images', 'breadImage')
      .select(['bread', 'breadImage'])
      .offset((page - 1) * limit)
      .limit(limit)
      .orderBy('bread.id', 'DESC');
    if (title) {
      query.andWhere('bread.title like :title', { title: `%${title}%` });
    }
    return query.getManyAndCount();
  }

  rankList(page: number, limit: number) {
    const query = this.createQueryBuilder('bread')
      .leftJoin('bread.images', 'breadImage')
      .select(['bread', 'breadImage'])
      .offset((page - 1) * limit)
      .limit(limit)
      .orderBy('bread.rank', 'DESC')
      .groupBy('bread.id');
    return query.getManyAndCount();
  }

  findByIdInfo(id: number) {
    return this.createQueryBuilder('bread')
      .select(['bread'])
      .where('bread.id = :id', { id })
      .getOne();
  }

  findById(id: number) {
    return this.createQueryBuilder('bread')
      .select(['bread', 'breadImage.imageUrl'])
      .leftJoin('bread.images', 'breadImage')
      .where('bread.id = :id', { id })
      .getOne();
  }

  findByIdCheck(id: number) {
    return this.createQueryBuilder('bread')
      .select(['bread', 'breadImage'])
      .leftJoin('bread.images', 'breadImage')
      .where('bread.id = :id', { id })
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
