import { Gallery } from '../../models/Gallery';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { useCatch } from '../../app/utils/use-catch';
import { withPagination } from '../../app/utils/pagination/with-pagination';
import {
  CreateGalleriesOptions,
  GetGalleriesSelections,
  GetOneGalleriesSelections,
  UpdateGalleriesOptions,
  UpdateGalleriesSelections,
} from './galleries.type';

@Injectable()
export class GalleriesService {
  constructor(
    @InjectRepository(Gallery)
    private driver: Repository<Gallery>,
  ) {}

  async findAll(selections: GetGalleriesSelections): Promise<any> {
    const { search, userId, pagination } = selections;

    let query = this.driver
      .createQueryBuilder('gallery')
      .select('gallery.id', 'id')
      .addSelect('gallery.name', 'name')
      .addSelect('gallery.code', 'code')
      .addSelect('gallery.symbol', 'symbol')
      .where('gallery.deletedAt IS NULL');

    if (userId) {
      query = query.andWhere('gift.userId = :userId', {
        userId,
      });
    }

    if (search) {
      query = query.andWhere(
        new Brackets((qb) => {
          qb.where('gallery.title ::text ILIKE :search', {
            search: `%${search}%`,
          }).orWhere('gallery.description ::text ILIKE :search', {
            search: `%${search}%`,
          });
        }),
      );
    }

    const [errorRowCount, rowCount] = await useCatch(query.getCount());
    if (errorRowCount) throw new NotFoundException(errorRowCount);

    const [error, galleries] = await useCatch(
      query
        .orderBy('gallery.createdAt', pagination?.sort)
        .take(pagination.take)
        .skip(pagination.skip)
        .getRawMany(),
    );
    if (error) throw new NotFoundException(error);

    return withPagination({
      pagination,
      rowCount,
      value: galleries,
    });
  }

  async findOneBy(selections: GetOneGalleriesSelections): Promise<Gallery> {
    const { galleryId } = selections;
    let query = this.driver
      .createQueryBuilder('gallery')
      .select('gallery.id', 'id')
      .addSelect('gallery.name', 'name')
      .addSelect('gallery.code', 'code')
      .addSelect('gallery.symbol', 'symbol')
      .where('gallery.deletedAt IS NULL');

    if (galleryId) {
      query = query.andWhere('gallery.id = :id', { id: galleryId });
    }

    const [error, result] = await useCatch(query.getRawOne());
    if (error)
      throw new HttpException('gallery not found', HttpStatus.NOT_FOUND);

    return result;
  }

  /** Create one Galleries to the database. */
  async createOne(options: CreateGalleriesOptions): Promise<Gallery> {
    const { description, title, allowDownload, whoCanSee, userId } = options;

    const gallery = new Gallery();
    gallery.title = title;
    gallery.whoCanSee = whoCanSee;
    gallery.allowDownload = allowDownload;
    gallery.userId = userId;
    gallery.description = description;

    const query = this.driver.save(gallery);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one Galleries to the database. */
  async updateOne(
    selections: UpdateGalleriesSelections,
    options: UpdateGalleriesOptions,
  ): Promise<Gallery> {
    const { galleryId } = selections;
    const { description, title, allowDownload, whoCanSee, userId, deletedAt } =
      options;

    let findQuery = this.driver.createQueryBuilder('gallery');

    if (galleryId) {
      findQuery = findQuery.where('gallery.id = :id', { id: galleryId });
    }

    const [errorFind, findItem] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    findItem.title = title;
    findItem.whoCanSee = whoCanSee;
    findItem.allowDownload = allowDownload;
    findItem.userId = userId;
    findItem.description = description;
    findItem.deletedAt = deletedAt;

    const query = this.driver.save(findItem);

    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}
