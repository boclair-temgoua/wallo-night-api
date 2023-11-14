import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Upload } from '../../models/Upload';
import { Repository } from 'typeorm';
import {
  CreateUploadOptions,
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
    const { model, uploadableId, organizationId, uploadType } = selections;

    let query = this.driver
      .createQueryBuilder('upload')
      .where('upload.deletedAt IS NULL');

    if (uploadableId) {
      query = query.andWhere('upload.uploadableId = :uploadableId', {
        uploadableId,
      });
    }

    if (organizationId) {
      query = query.andWhere('upload.organizationId = :organizationId', {
        organizationId,
      });
    }

    if (model) {
      query = query.andWhere('upload.model = :model', { model });
    }

    if (uploadType) {
      query = query.andWhere('upload.uploadType = :uploadType', { uploadType });
    }

    const [errors, results] = await useCatch(
      query.orderBy('upload.createdAt', 'ASC').getMany(),
    );
    if (errors) throw new NotFoundException(errors);

    return results;
  }

  /** Create one Upload to the database. */
  async createOne(options: CreateUploadOptions): Promise<Upload> {
    const {
      name,
      status,
      uploadType,
      url,
      path,
      model,
      userId,
      postId,
      productId,
      commissionId,
      membershipId,
      organizationId,
      uploadableId,
    } = options;

    const upload = new Upload();
    upload.url = url;
    upload.path = path;
    upload.name = name;
    upload.status = status;
    upload.userId = userId;
    upload.model = model;
    upload.organizationId = organizationId;
    upload.uploadType = uploadType;
    upload.uploadableId = uploadableId;
    upload.postId = postId;
    upload.productId = productId;
    upload.commissionId = commissionId;
    upload.membershipId = membershipId;

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

    const [errorFind, upload] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    upload.deletedAt = deletedAt;

    const query = this.driver.save(upload);

    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
  /** Delete one Upload to the database. */
  async deleteOne(selections: UpdateUploadSelections): Promise<any> {
    const { uploadId } = selections;

    let findQuery = this.driver.createQueryBuilder('upload').delete();

    if (uploadId) {
      findQuery = findQuery.where('upload.id = :id', { id: uploadId });
    }

    const [errorFind, upload] = await useCatch(findQuery.execute());
    if (errorFind) throw new NotFoundException(errorFind);

    return upload;
  }
}
