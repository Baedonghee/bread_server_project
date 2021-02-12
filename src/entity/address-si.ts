import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { AddressGu } from './address-gu';

@Entity()
export class AddressSi {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  name!: string;

  @OneToMany(() => AddressGu, (addressGu) => addressGu.addressSis)
  addressGu!: AddressGu[];
}
