import { EntityRepository, Repository } from 'typeorm';
import { BreadShop } from '../entity/bread-shop';
import { BreadShopHoliday } from '../entity/bread-shop-holiday';

@EntityRepository(BreadShopHoliday)
export class BreadShopHolidayRepository extends Repository<BreadShopHoliday> {
  createAndSave(day: string, breadShop: BreadShop) {
    const breadShopHoliday = new BreadShopHoliday();
    breadShopHoliday.day = day;
    breadShopHoliday.breadShop = breadShop;
    return this.manager.save(breadShopHoliday);
  }
  deleteById(ids: number[]) {
    return this.delete(ids);
  }
}
