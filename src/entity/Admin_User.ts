import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class AdminUser {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true, unique: true })
  email!: string;

  @Column({ nullable: true })
  password!: string;

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
}
