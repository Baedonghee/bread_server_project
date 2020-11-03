import { EntityRepository, Repository } from 'typeorm';
import { AdminUser } from '../entity/admin-user';
import { Youtube } from '../entity/youtube';

@EntityRepository(Youtube)
export class YoutubeRespository extends Repository<Youtube> {
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

  list() {
    return this.createQueryBuilder('youtube')
      .leftJoin('youtube.admin', 'admin')
      .select(['youtube', 'admin.email', 'admin.name'])
      .getMany();
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
