import { Bread } from '../../entity/bread';

export class BreadResult {
  id!: number;
  title!: string;
  content!: string;
  image: string[] = [];

  constructor(data: Bread) {
    this.id = data.id;
    this.title = data.title;
    this.content = data.content;
    data.images.forEach((breadImage) => {
      this.image.push(breadImage.imageUrl);
    });
  }
}
