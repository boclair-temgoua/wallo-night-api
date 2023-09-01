import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from '../../models/Like';
import { Repository } from 'typeorm';
import {
  CreateLikeOptions,
  GetOneLikeSelections,
  UpdateLikeOptions,
  UpdateLikeSelections,
} from './likes.type';
import { useCatch } from '../../app/utils/use-catch';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private driver: Repository<Like>,
  ) {}

  /** Find all Like to the database. */
  async findAllBy(selections: GetOneLikeSelections): Promise<Like[]> {
    const { type, likeableId, userId } = selections;
    let query = this.driver
      .createQueryBuilder('like')
      .where('like.deletedAt IS NULL');

    if (type && likeableId && userId) {
      query = query
        .andWhere('like.type = :type', { type })
        .andWhere('like.userId = :userId', { userId })
        .andWhere('like.likeableId = :likeableId', { likeableId });
    }

    const [error, result] = await useCatch(query.getMany());
    if (error) throw new HttpException('like not found', HttpStatus.NOT_FOUND);

    return result;
  }

  /** Find one Like to the database. */
  async findOneBy(selections: GetOneLikeSelections): Promise<Like> {
    const { type, likeableId, userId } = selections;
    let query = this.driver
      .createQueryBuilder('like')
      .where('like.deletedAt IS NULL');

    if (type && likeableId && userId) {
      query = query
        .andWhere('like.type = :type', { type })
        .andWhere('like.userId = :userId', { userId })
        .andWhere('like.likeableId = :likeableId', { likeableId });
    }

    const [error, result] = await useCatch(query.getOne());
    if (error) throw new HttpException('like not found', HttpStatus.NOT_FOUND);

    return result;
  }

  /** Create one Like to the database. */
  async createOne(options: CreateLikeOptions): Promise<Like> {
    const { likeableId, type, userId } = options;

    const like = new Like();
    like.type = type;
    like.userId = userId;
    like.likeableId = likeableId;

    const query = this.driver.save(like);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one Like to the database. */
  async updateOne(
    selections: UpdateLikeSelections,
    options: UpdateLikeOptions,
  ): Promise<Like> {
    const { likeId } = selections;
    const { deletedAt } = options;

    let findQuery = this.driver.createQueryBuilder('like');

    if (likeId) {
      findQuery = findQuery.where('like.id = :id', { id: likeId });
    }

    const [errorFind, findItem] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    findItem.deletedAt = deletedAt;

    const query = this.driver.save(findItem);

    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}
