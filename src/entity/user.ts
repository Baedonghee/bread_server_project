import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false, unique: true })
  email!: string;

  @Column({ nullable: true, select: false })
  password!: string;

  @Column({ nullable: false })
  name!: string;

  @Column({ nullable: false })
  imageUrl!: string;

  @Column({ nullable: true })
  age!: number;

  @Column({ nullable: true })
  gender!: boolean;

  @Column({ default: true })
  enabled!: boolean;

  @Column({ default: 0 })
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
