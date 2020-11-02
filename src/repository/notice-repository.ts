import { EntityRepository, Repository } from 'typeorm';
import { Notice } from '../entity/notice';
import { AdminUser } from '../entity/admin-user';

@EntityRepository(Notice)
export class NoticeRespository extends Repository<Notice> {
  createAndSave(
    title: string,
    content: string,
    startAt: Date,
    admin: AdminUser
  ) {
    const notice = new Notice();
    notice.title = title;
    notice.content = content;
    notice.startAt = startAt;
    notice.admin = admin;
    return this.manager.save(notice);
  }

  list() {
    return this.createQueryBuilder('notice')
      .leftJoin('notice.admin', 'admin')
      .select(['notice', 'admin.email', 'admin.name'])
      .getMany();
  }

  findById(id: number) {
    return this.createQueryBuilder('notice')
      .leftJoin('notice.admin', 'admin')
      .where('notice.id = :id', { id })
      .select(['notice', 'admin.email', 'admin.name'])
      .getOne();
  }
  updateAndSave(
    id: number,
    title: string,
    content: string,
    startAt: Date,
    admin: AdminUser
  ) {
    return this.update(id, { title, content, startAt, admin });
  }

  deleteById(id: number) {
    return this.delete({ id });
  }
}
