import { EntityRepository, Repository } from 'typeorm';
import { Bread } from '../entity/bread';
import { BreadComment } from '../entity/bread-comment';
import { User } from '../entity/user';

@EntityRepository(BreadComment)
export class BreadCommentRepository extends Repository<BreadComment> {
  createAndSave(
    bread: Bread,
    user: User,
    content: string,
    comment?: BreadComment
  ) {
    const breadComment = new BreadComment();
    breadComment.bread = bread;
    breadComment.user = user;
    breadComment.content = content;
    if (comment) {
      breadComment.comment = comment;
    }
    return this.manager.save(breadComment);
  }

  list(page: number, limit: number, breadId: number) {
    const query = this.createQueryBuilder('breadComment')
      .innerJoinAndSelect('breadComment.comments', 'breadComments')
      .select(['breadComment', 'breadComments'])
      .where('breadComment.bread_id = :breadId', { breadId })
      .offset((page - 1) * limit)
      .take(limit)
      .orderBy('breadComment.id', 'DESC');
    return query.getManyAndCount();
  }

  findById(id: number) {
    return this.createQueryBuilder('breadComment')
      .select(['breadComment'])
      .where('breadComment.id = :id', { id })
      .getOne();
  }

  updateAndContent(id: number, content: string) {
    return this.update(id, { content });
  }

  deleteById(id: number) {
    return this.delete({ id });
  }
}
