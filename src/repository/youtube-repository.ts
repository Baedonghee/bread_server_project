import { EntityRepository, Repository } from 'typeorm';
import { AdminUser } from '../entity/admin-user';
import { BreadShop } from '../entity/bread-shop';
import { Youtube } from '../entity/youtube';

@EntityRepository(Youtube)
export class YoutubeRepository extends Repository<Youtube> {
  createAndSave(
    title: string,
    content: string,
    link: string,
    breadShop: BreadShop,
    admin: AdminUser
  ) {
    const youtube = new Youtube();
    youtube.title = title;
    youtube.content = content;
    youtube.link = link;
    youtube.breadShop = breadShop;
    youtube.admin = admin;
    return this.manager.save(youtube);
  }

  list(page: number, limit: number, title?: string) {
    const query = this.createQueryBuilder('youtube')
      .leftJoin('youtube.admin', 'admin')
      .select(['youtube', 'admin.email', 'admin.name'])
      .offset((page - 1) * limit)
      .take(limit)
      .orderBy('youtube.id', 'DESC');
    if (title) {
      query.andWhere('youtube.title like :title', { title: `%${title}%` });
    }
    return query.getManyAndCount();
  }

  listAndPick(page: number, limit: number) {
    const query = this.createQueryBuilder('youtube')
      .offset((page - 1) * limit)
      .take(limit)
      .orderBy('youtube.id', 'DESC');
    return query.getManyAndCount();
  }

  findById(id: number) {
    return this.createQueryBuilder('youtube')
      .leftJoin('youtube.admin', 'admin')
      .leftJoin('youtube.breadShop', 'breadShop')
      .leftJoin('breadShop.images', 'breadShopImage')
      .where('youtube.id = :id', { id })
      .select([
        'youtube',
        'admin.email',
        'admin.name',
        'breadShop',
        'breadShopImage',
      ])
      .getOne();
  }

  updateAndSave(
    id: number,
    title: string,
    content: string,
    link: string,
    breadShop: BreadShop,
    admin: AdminUser
  ) {
    return this.update(id, { title, content, link, breadShop, admin });
  }

  deleteById(id: number) {
    return this.delete({ id });
  }
}
