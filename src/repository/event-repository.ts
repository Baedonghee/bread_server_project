import { EntityRepository, Repository } from 'typeorm';
import { AdminUser } from '../entity/admin-user';
import { Event } from '../entity/event';

@EntityRepository(Event)
export class EventRespository extends Repository<Event> {
  createAndSave(
    title: string,
    imageUrl: string,
    link: string,
    startAt: Date,
    endAt: Date,
    admin: AdminUser
  ) {
    const event = new Event();
    event.title = title;
    event.imageUrl = imageUrl;
    event.link = link;
    event.startAt = startAt;
    event.endAt = endAt;
    event.admin = admin;
    return this.manager.save(event);
  }

  list() {
    return this.createQueryBuilder('event')
      .leftJoin('event.admin', 'admin')
      .select(['event', 'admin.email', 'admin.name'])
      .getMany();
  }

  findById(id: number) {
    return this.createQueryBuilder('event')
      .leftJoin('event.admin', 'admin')
      .where('event.id = :id', { id })
      .select(['event', 'admin.email', 'admin.name'])
      .getOne();
  }

  updateAndSave(
    id: number,
    title: string,
    imageUrl: string,
    link: string,
    startAt: Date,
    endAt: Date,
    admin: AdminUser
  ) {
    const updateEvent = {
      title,
      link,
      startAt,
      endAt,
      admin,
    } as {
      title: string;
      link: string;
      startAt: Date;
      endAt: Date;
      admin: AdminUser;
      imageUrl?: string;
    };
    if (imageUrl) {
      updateEvent.imageUrl = imageUrl;
    }
    return this.update(id, updateEvent);
  }

  deleteById(id: number) {
    return this.delete({ id });
  }
}
