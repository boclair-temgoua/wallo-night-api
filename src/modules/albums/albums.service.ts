import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Album } from '../../models/Album';
import { Repository, Brackets } from 'typeorm';
import {
  CreateAlbumsOptions,
  GetAlbumsSelections,
  GetOneAlbumsSelections,
  UpdateAlbumsOptions,
  UpdateAlbumsSelections,
} from './albums.type';
import * as Slug from 'slug';
import { useCatch } from '../../app/utils/use-catch';
import { withPagination } from '../../app/utils/pagination/with-pagination';
import { generateNumber } from '../../app/utils/commons';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectRepository(Album)
    private driver: Repository<Album>,
  ) {}

  async findAll(selections: GetAlbumsSelections): Promise<any> {
    const { search, pagination, userId, organizationId } = selections;

    let query = this.driver
      .createQueryBuilder('album')
      .select('album.id', 'id')
      .addSelect('album.slug', 'slug')
      .addSelect('album.name', 'name')
      .addSelect('album.userId', 'userId')
      .addSelect('album.createdAt', 'createdAt')
      .addSelect('album.description', 'description')
      .addSelect('album.organizationId', 'organizationId')
      .where('album.deletedAt IS NULL');

    if (userId) {
      query = query.andWhere('album.userId = :userId', { userId });
    }

    if (organizationId) {
      query = query.andWhere('album.organizationId = :organizationId', {
        organizationId,
      });
    }

    if (search) {
      query = query.andWhere(
        new Brackets((qb) => {
          qb.where('album.name ::text ILIKE :search', {
            search: `%${search}%`,
          });
        }),
      );
    }

    const [errorRowCount, rowCount] = await useCatch(query.getCount());
    if (errorRowCount) throw new NotFoundException(errorRowCount);

    if (pagination?.isPaginate === 'false') {
      const [error, albums] = await useCatch(
        query.orderBy('album.createdAt', pagination?.sort).getRawMany(),
      );
      if (error) throw new NotFoundException(error);

      return albums;
    } else {
      const [error, albums] = await useCatch(
        query
          .orderBy('album.createdAt', pagination?.sort)
          .limit(pagination.limit)
          .offset(pagination.offset)
          .getRawMany(),
      );
      if (error) throw new NotFoundException(error);

      return withPagination({
        pagination,
        rowCount,
        value: albums,
      });
    }
  }

  async findOneBy(selections: GetOneAlbumsSelections): Promise<Album> {
    const { albumId } = selections;
    let query = this.driver
      .createQueryBuilder('album')
      .where('album.deletedAt IS NULL');

    if (albumId) {
      query = query.andWhere('album.id = :id', { id: albumId });
    }

    const [error, result] = await useCatch(query.getOne());
    if (error)
      throw new HttpException('album not found', HttpStatus.NOT_FOUND);

    return result;
  }

  /** Create one Albums to the database. */
  async createOne(options: CreateAlbumsOptions): Promise<Album> {
    const { name, description, organizationId, userId } = options;

    const album = new Album();
    album.name = name;
    album.organizationId = organizationId;
    album.slug = `${Slug(name)}-${generateNumber(4)}`;
    album.description = description;
    album.userId = userId;

    const query = this.driver.save(album);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one Albums to the database. */
  async updateOne(
    selections: UpdateAlbumsSelections,
    options: UpdateAlbumsOptions,
  ): Promise<Album> {
    const { albumId } = selections;
    const { name, description, deletedAt } = options;

    let findQuery = this.driver.createQueryBuilder('album');

    if (albumId) {
      findQuery = findQuery.where('album.id = :id', { id: albumId });
    }

    const [errorFind, album] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    album.name = name;
    album.description = description;
    album.deletedAt = deletedAt;

    const query = this.driver.save(album);

    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}
