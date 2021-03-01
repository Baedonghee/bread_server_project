import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Bread } from './bread';
import { User } from './user';

@Entity()
export class BreadUserFavorites {
  @ManyToOne(() => User, (user) => user.breadUserFavorites, {
    onDelete: 'CASCADE',
    primary: true,
  })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Bread, (bread) => bread.breadUserFavorites, {
    onDelete: 'CASCADE',
    primary: true,
  })
  @JoinColumn({ name: 'bread_id' })
  bread!: number;
}
