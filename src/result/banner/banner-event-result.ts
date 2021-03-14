import { Event } from '../../entity/event';

export class BannerEventResult {
  imageUrl!: string;
  link!: string;

  constructor(data: Event) {
    this.imageUrl = data.imageUrl;
    this.link = data.link;
  }
}
