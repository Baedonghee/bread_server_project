import { EntityRepository, Repository } from 'typeorm';
import { AddressGu } from '../entity/address-gu';
import { AddressSi } from '../entity/address-si';

@EntityRepository(AddressGu)
export class AddressGuRepository extends Repository<AddressGu> {
  createAndSave(name: string, addressSi: AddressSi) {
    const addressGu = new AddressGu();
    addressGu.name = name;
    addressGu.addressSis = addressSi;
    return this.manager.save(addressGu);
  }

  list(siCode: number) {
    return this.createQueryBuilder('addressGu')
      .where('addressGu.address_si_id = :siCode', { siCode })
      .select(['addressGu'])
      .getMany();
  }

  findById(id: number) {
    return this.createQueryBuilder('addressGu')
      .where('addressGu.id = :id', { id })
      .select(['addressGu'])
      .getOne();
  }
}
