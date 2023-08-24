import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Upload } from '../../models/Upload';
import { Repository } from 'typeorm';
import {
  CreateUploadOptions,
  GetOneUploadSelections,
  GetUploadsSelections,
  UpdateUploadOptions,
  UpdateUploadSelections,
} from './uploads.type';
import { useCatch } from '../../app/utils/use-catch';

@Injectable()
export class UploadsService {
  constructor(
    @InjectRepository(Upload)
    private driver: Repository<Upload>,
  ) {}

  async findAll(selections: GetUploadsSelections): Promise<any> {
    const { productId } = selections;

    let query = this.driver
      .createQueryBuilder('upload')
      .select('upload.id', 'id')
      .addSelect('upload.name', 'name')
      .addSelect('upload.status', 'status')
      .addSelect('upload.url', 'url')
      .addSelect('upload.productId', 'productId')
      .where('upload.deletedAt IS NULL');

    if (productId) {
      query = query.andWhere('upload.productId = :productId', { productId });
    }

    const [errors, results] = await useCatch(
      query.orderBy('upload.createdAt', 'DESC').getRawMany(),
    );
    if (errors) throw new NotFoundException(errors);

    return results;
  }

  /** Create one Upload to the database. */
  async createOne(options: CreateUploadOptions): Promise<Upload> {
    const { name, status, url, productId } = options;

    const upload = new Upload();
    upload.url = url;
    upload.name = name;
    upload.status = status;
    upload.productId = productId;

    const query = this.driver.save(upload);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one Upload to the database. */
  async updateOne(
    selections: UpdateUploadSelections,
    options: UpdateUploadOptions,
  ): Promise<Upload> {
    const { uploadId } = selections;
    const { deletedAt } = options;

    let findQuery = this.driver.createQueryBuilder('Upload');

    if (uploadId) {
      findQuery = findQuery.where('upload.id = :id', { id: uploadId });
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
