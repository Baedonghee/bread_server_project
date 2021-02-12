import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AddressSi } from './address-si';

@Entity()
export class AddressGu {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  name!: string;

  @ManyToOne(() => AddressSi, (addressSi) => addressSi.addressGu)
  @JoinColumn({ name: 'address_si_id' })
  addressSis!: AddressSi;
}
