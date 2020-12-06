import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AdminUser } from './admin-user';

@Entity()
export class Notice {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  title!: string;

  @Column({ type: 'text', nullable: false })
  content!: string;

  @Column({
    type: 'timestamp',
    name: 'start_at',
    nullable: false,
  })
  startAt!: Date;

  @Column({
    type: 'timestamp',
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;

  @Column({
    type: 'timestamp',
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt!: Date;

  @ManyToOne(() => AdminUser, (user) => user.notices)
  @JoinColumn({ name: 'admin_id' })
  admin!: AdminUser;
}
