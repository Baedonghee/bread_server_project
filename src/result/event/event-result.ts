import { format } from 'date-fns';
import { Event } from '../../entity/event';

export class EventResult {
  id!: number;
  title!: string;
  imageUrl!: string;
  link!: string;
  startAt!: Date;
  endAt!: Date;
  close = false;

  constructor(data: Event) {
    this.id = data.id;
    this.title = data.title;
    this.imageUrl = data.imageUrl;
    this.link = data.link;
    this.startAt = data.startAt;
    this.endAt = data.endAt;
    this.close =
      Number(format(new Date(), 'yyyyMMdd')) >
      Number(format(new Date(data.endAt), 'yyyyMMdd'));
  }
}
