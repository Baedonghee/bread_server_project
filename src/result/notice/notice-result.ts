import { Notice } from '../../entity/notice';

export class NoticeResult {
  id!: number;
  title!: string;
  content!: string;
  startAt!: Date;

  constructor(data: Notice) {
    this.id = data.id;
    this.title = data.title;
    this.content = data.content;
    this.startAt = data.startAt;
  }
}
