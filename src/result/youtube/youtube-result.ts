import { Youtube } from './../../entity/youtube';

interface IBreadShop {
  id: number;
  title: string;
  imageUrl: string;
}

export class YoutubeResult {
  id!: number;
  title!: string;
  link!: string;
  content!: string;
  createdAt!: Date;
  updatedAt!: Date;
  breadShop!: IBreadShop;

  constructor(data: Youtube) {
    this.id = data.id;
    this.title = data.title;
    this.link = data.link;
    this.content = data.content;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.breadShop = {
      id: data.breadShop.id,
      title: data.breadShop.title,
      imageUrl: data.breadShop.images[0].imageUrl,
    };
  }
}
