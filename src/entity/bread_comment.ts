import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Bread } from './bread';
import { User } from './user';

@Entity()
export class BreadComment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  content!: string;

  @ManyToOne(() => User, (user) => user.breadComments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Bread, (bread) => bread.breadComments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'bread_id' })
  bread!: Bread;

  @ManyToOne(() => BreadComment, (breadComment) => breadComment.comments, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'comment_id' })
  comment!: BreadComment;

  @OneToMany(() => BreadComment, (breadComment) => breadComment.comment)
  comments!: BreadComment[];
}
