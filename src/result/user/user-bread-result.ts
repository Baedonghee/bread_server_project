import { Bread } from '../../entity/bread';

export class UserBreadResult {
  id!: number;
  title!: string;
  image: string;
  like = true;

  constructor(data: Bread) {
    this.id = data.id;
    this.title = data.title;
    this.image = data.images[0].imageUrl || '';
  }
}
