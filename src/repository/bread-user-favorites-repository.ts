import { EntityRepository, Repository } from 'typeorm';
import { BreadUserFavorites } from '../entity/bread-user-favorites';
import { User } from '../entity/user';

@EntityRepository(BreadUserFavorites)
export class BreadUserFavoritesRepository extends Repository<
  BreadUserFavorites
> {
  createAndSave(user: User, breadId: number) {
    const breadUserFavorites = new BreadUserFavorites();
    breadUserFavorites.user = user;
    breadUserFavorites.bread = breadId;
    return this.manager.save(breadUserFavorites);
  }
  findById(userId: number, breadId: number) {
    return this.createQueryBuilder('breadUserFavorites')
      .innerJoinAndSelect('breadUserFavorites.user', 'user')
      .innerJoinAndSelect('breadUserFavorites.bread', 'bread')
      .where('breadUserFavorites.user_id =:userId', { userId })
      .andWhere('breadUserFavorites.bread_id =:breadId', { breadId })
      .getOne();
  }

  deleteById(user: User, breadId: number) {
    return this.delete({
      user,
      bread: breadId,
    });
  }
}
