interface IRankBreadResult {
  id: number;
  title: string;
  image: string;
  like: string;
}

export class RankBreadResult {
  id!: number;
  title!: string;
  image!: string;
  like!: boolean;

  constructor(data: IRankBreadResult) {
    this.id = data.id;
    this.title = data.title;
    this.image = data.image;
    this.like = !!Number(data.like);
  }
}
