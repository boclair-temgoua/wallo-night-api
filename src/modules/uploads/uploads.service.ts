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
    const { productId, uploadType } = selections;

    let query = this.driver
      .createQueryBuilder('upload')
      .select('upload.id', 'uid')
      .addSelect('upload.name', 'name')
      .addSelect('upload.path', 'path')
      .addSelect('upload.status', 'status')
      .addSelect('upload.url', 'url')
      .addSelect('upload.uploadType', 'uploadType')
      .addSelect('upload.productId', 'productId')
      .where('upload.deletedAt IS NULL');

    if (productId) {
      query = query.andWhere('upload.productId = :productId', { productId });
    }

    if (uploadType) {
      query = query.andWhere('upload.uploadType = :uploadType', { uploadType });
    }

    const [errors, results] = await useCatch(
      query.orderBy('upload.createdAt', 'ASC').getRawMany(),
    );
    if (errors) throw new NotFoundException(errors);

    return results;
  }

  /** Create one Upload to the database. */
  async createOne(options: CreateUploadOptions): Promise<Upload> {
    const { name, status, uploadType, url, path, productId } = options;

    const upload = new Upload();
    upload.url = url;
    upload.path = path;
    upload.name = name;
    upload.status = status;
    upload.uploadType = uploadType;
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

    let findQuery = this.driver.createQueryBuilder('upload');

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
  /** Delete one Upload to the database. */
  async deleteOne(
    selections: UpdateUploadSelections,
  ): Promise<any> {
    const { uploadId } = selections;

    let findQuery = this.driver.createQueryBuilder('upload').delete();

    if (uploadId) {
      findQuery = findQuery.where('upload.id = :id', { id: uploadId });
    }

    const [errorFind, findItem] = await useCatch(findQuery.execute());
    if (errorFind) throw new NotFoundException(errorFind);

    return findItem;
  }
}
