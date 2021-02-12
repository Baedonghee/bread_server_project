import { EntityRepository, Repository } from 'typeorm';
import { AddressSi } from '../entity/address-si';

@EntityRepository(AddressSi)
export class AddressSiRepository extends Repository<AddressSi> {
  createAndSave(name: string) {
    const addressSi = new AddressSi();
    addressSi.name = name;
    return this.manager.save(addressSi);
  }

  list() {
    return this.createQueryBuilder('addressSi').select(['addressSi']).getMany();
  }

  findById(id: number) {
    return this.createQueryBuilder('addressSi')
      .where('addressSi.id = :id', { id })
      .select(['addressSi'])
      .getOne();
  }
}
