import { Bread } from '../../entity/bread';

export class RankBreadResult {
  id!: number;
  title!: string;
  image!: string;
  star!: boolean;

  constructor(data: Bread) {
    this.id = data.id;
    this.title = data.title;
    this.image = data.images.length ? data.images[0].imageUrl : '';
    this.star = false;
  }
}
