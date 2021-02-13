import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { BreadShop } from './bread-shop';
import { User } from './user';

@Entity()
export class BreadShopComment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  content!: string;

  @ManyToOne(() => User, (user) => user.breadComments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => BreadShop, (breadShop) => breadShop.breadShopComments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'bread_shop_id' })
  breadShop!: BreadShop;

  @ManyToOne(
    () => BreadShopComment,
    (breadShopComment) => breadShopComment.comments,
    {
      nullable: true,
      onDelete: 'CASCADE',
    }
  )
  @JoinColumn({ name: 'comment_id' })
  comment!: BreadShopComment;

  @OneToMany(
    () => BreadShopComment,
    (breadShopComment) => breadShopComment.comment
  )
  comments!: BreadShopComment[];
}
