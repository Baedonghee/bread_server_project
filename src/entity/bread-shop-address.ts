import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BreadShopAddress {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'double' })
  lat!: number;

  @Column({ type: 'double' })
  lon!: number;

  @Column({ name: 'road_address' })
  roadAddress!: string;

  @Column({ name: 'zibun_address' })
  zibunAddress!: string;
}
