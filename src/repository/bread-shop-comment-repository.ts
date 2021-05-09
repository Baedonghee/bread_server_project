import { BreadShop } from './../entity/bread-shop';
import { EntityRepository, Repository } from 'typeorm';
import { BreadShopComment } from '../entity/bread-shop-comment';
import { User } from '../entity/user';

@EntityRepository(BreadShopComment)
export class BreadShopCommentRepository extends Repository<BreadShopComment> {
  createAndSave(
    breadShop: BreadShop,
    user: User,
    content: string,
    comment?: BreadShopComment
  ) {
    const breadShopComment = new BreadShopComment();
    breadShopComment.breadShop = breadShop;
    breadShopComment.user = user;
    breadShopComment.content = content;
    if (comment) {
      breadShopComment.comment = comment;
    }
    return this.manager.save(breadShopComment);
  }

  list(page: number, limit: number, breadShopId: number) {
    const query = this.createQueryBuilder('breadShopComment')
      .leftJoinAndSelect('breadShopComment.comments', 'breadShopComments')
      .leftJoinAndSelect('breadShopComment.user', 'user')
      .leftJoinAndSelect('breadShopComments.user', 'reUser')
      .select([
        'breadShopComment',
        'breadShopComments',
        'user.id',
        'user.name',
        'user.imageUrl',
        'reUser.id',
        'reUser.name',
        'reUser.imageUrl',
      ])
      .where('breadShopComment.bread_shop_id = :breadShopId', { breadShopId })
      .andWhere('breadShopComment.comment_id IS NULL')
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('breadShopComment.id', 'DESC');
    return query.getManyAndCount();
  }

  findById(id: number) {
    return this.createQueryBuilder('breadShopComment')
      .select(['breadShopComment'])
      .where('breadShopComment.id = :id', { id })
      .getOne();
  }

  updateAndContent(id: number, content: string) {
    return this.update(id, { content });
  }

  deleteById(id: number) {
    return this.delete({ id });
  }
}
