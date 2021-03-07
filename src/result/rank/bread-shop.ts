interface IRankBreadShopResult {
  id: number;
  title: string;
  image: string;
  address: string;
  like: string;
}

export class RankBreadShopResult {
  id!: number;
  title!: string;
  image!: string;
  address!: string;
  like!: boolean;

  constructor(data: IRankBreadShopResult) {
    this.id = data.id;
    this.title = data.title;
    this.image = data.image;
    const addressSplit = data.address.split(' ');
    this.address = addressSplit[0];
    this.like = !!Number(data.like);
  }
}
