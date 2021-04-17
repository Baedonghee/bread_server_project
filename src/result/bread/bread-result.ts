import { Bread } from '../../entity/bread';

export class BreadResult {
  id!: number;
  title!: string;
  content!: string;
  image: string[] = [];
  like!: boolean;

  constructor(data: Bread, like: boolean) {
    this.id = data.id;
    this.title = data.title;
    this.content = data.content;
    data.images.forEach((breadImage) => {
      this.image.push(breadImage.imageUrl);
    });
    this.like = like;
  }
}
