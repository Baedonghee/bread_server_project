import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AdminUser } from './admin-user';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  title!: string;

  @Column({ nullable: false, name: 'image_url' })
  imageUrl!: string;

  @Column({ nullable: false })
  link!: string;

  @Column({ nullable: false, default: false })
  banner!: boolean;

  @Column({
    type: 'timestamp',
    name: 'start_at',
    nullable: false,
  })
  startAt!: Date;

  @Column({
    type: 'timestamp',
    name: 'end_at',
    nullable: false,
  })
  endAt!: Date;

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
