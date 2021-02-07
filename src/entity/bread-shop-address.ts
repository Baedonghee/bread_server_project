import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BreadShopAddress {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'double' })
  lat!: number;

  @Column({ type: 'double' })
  lon!: number;

  @Column({ name: 'address' })
  address!: string;

  @Column({ name: 'detail_address' })
  detailAddress!: string;
}
