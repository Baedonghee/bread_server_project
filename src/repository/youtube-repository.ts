import { EntityRepository, Repository } from 'typeorm';
import { AdminUser } from '../entity/admin-user';
import { Youtube } from '../entity/youtube';

@EntityRepository(Youtube)
export class YoutubeRepository extends Repository<Youtube> {
  createAndSave(
    title: string,
    content: string,
    link: string,
    breadId: number,
    admin: AdminUser
  ) {
    const youtube = new Youtube();
    youtube.title = title;
    youtube.content = content;
    youtube.link = link;
    youtube.breadId = breadId;
    youtube.admin = admin;
    return this.manager.save(youtube);
  }

  list(page: number, limit: number, title?: string) {
    const query = this.createQueryBuilder('youtube')
      .leftJoin('youtube.admin', 'admin')
      .select(['youtube', 'admin.email', 'admin.name'])
      .offset((page - 1) * limit)
      .limit(limit)
      .orderBy('youtube.id', 'DESC');
    if (title) {
      query.andWhere('youtube.title like :title', { title: `%${title}%` });
    }
    return query.getManyAndCount();
  }

  findById(id: number) {
    return this.createQueryBuilder('youtube')
      .leftJoin('youtube.admin', 'admin')
      .where('youtube.id = :id', { id })
      .select(['youtube', 'admin.email', 'admin.name'])
      .getOne();
  }

  updateAndSave(
    id: number,
    title: string,
    content: string,
    link: string,
    breadId: number,
    admin: AdminUser
  ) {
    return this.update(id, { title, content, link, breadId, admin });
  }

  deleteById(id: number) {
    return this.delete({ id });
  }
}
