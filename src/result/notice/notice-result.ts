import { Notice } from '../../entity/notice';

export class NoticeResult {
  id!: number;
  title!: string;
  content!: string;
  createdAt!: Date;

  constructor(data: Notice) {
    this.id = data.id;
    this.title = data.title;
    this.content = data.content;
    this.createdAt = data.createdAt;
  }
}
