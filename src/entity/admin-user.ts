import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Notice } from './notice';

@Entity()
export class AdminUser {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true, unique: true })
  email!: string;

  @Column({ nullable: true })
  password!: string;

  @Column({ nullable: false })
  name!: string;

  @Column()
  type!: number;

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

  @OneToMany(() => Notice, (notice) => notice.admin)
  notices!: Notice[];
}
