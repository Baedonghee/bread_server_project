import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Bread } from './bread';

@Entity()
export class BreadImage {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'image_url' })
  imageUrl!: string;

  @ManyToOne(() => Bread, (bread) => bread.images, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'bread_id' })
  bread!: Bread;
}
