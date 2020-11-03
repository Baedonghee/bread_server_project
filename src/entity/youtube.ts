import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AdminUser } from './admin-user';

@Entity()
export class Youtube {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  title!: string;

  @Column({ nullable: false })
  content!: string;

  @Column({ nullable: false })
  link!: string;

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

  @Column({ nullable: false })
  breadId!: number;

  @ManyToOne(() => AdminUser, (user) => user.notices)
  @JoinColumn({ name: 'admin_id' })
  admin!: AdminUser;
}
