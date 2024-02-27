import { Injectable } from '@nestjs/common';
import * as mime from 'mime-types';
import { formateNowDateYYMMDD } from '../../app/utils/commons/formate-date';
import {
  Slug,
  generateLongUUID,
} from '../../app/utils/commons/generate-random';
import { KeyAsString } from '../../app/utils/commons/key-as-string';
import { FilterQueryType } from '../../app/utils/search-query';
import { awsS3ServiceAdapter } from '../integrations/aws/aws-s3-service-adapter';
import { UploadsService } from './uploads.service';
import { UploadType } from './uploads.type';

const fieldnameLists: KeyAsString = {
  attachmentImages: 'IMAGE',
  attachmentFiles: 'FILE',
};

type ExpressFile = Express.Multer.File;
@Injectable()
export class UploadsUtil {
  constructor(private readonly uploadsService: UploadsService) {} // private driver: Repository<Commission>, // @InjectRepository(Commission)

  async saveOrUpdateAws(options: {
    userId?: string;
    model: FilterQueryType;
    uploadableId: string;
    organizationId: string;
    postId?: string;
    productId?: string;
    commissionId?: string;
    membershipId?: string;

    folder: 'products' | 'commissions' | 'posts' | 'memberships';
    files: Array<ExpressFile>;
    file?: ExpressFile;
  }): Promise<any> {
    const {
      file,
      files,
      userId,
      organizationId,
      model,
      uploadableId,
      folder,
      postId,
      productId,
      commissionId,
      membershipId,
    } = options;

    if (file) {
      await this.uploadOne({
        file,
        folder,
        model,
        userId,
        postId,
        productId,
        commissionId,
        membershipId,
        organizationId,
        uploadableId,
      });
    }

    if (files.length > 0) {
      for (const file of files) {
        await this.uploadOne({
          file,
          folder,
          model,
          userId,
          postId,
          productId,
          commissionId,
          membershipId,
          organizationId,
          uploadableId,
        });
      }
    }

    return 'ok';
  }

  async uploadOne(options: {
    file: ExpressFile;
    folder: string;
    model: FilterQueryType;
    userId: string;
    postId: string;
    productId: string;
    commissionId: string;
    membershipId: string;
    organizationId: string;
    uploadableId: string;
  }) {
    const {
      file,
      folder,
      model,
      userId,
      postId,
      productId,
      commissionId,
      membershipId,
      organizationId,
      uploadableId,
    } = options;

    const extension = mime.extension(file.mimetype);
    const nameFile = `${Slug(file?.originalname)}${formateNowDateYYMMDD(
      new Date(),
    )}-${generateLongUUID(4)}`;
    const fileName = `${`${nameFile}.${
      extension === 'mpga' ? 'mp3' : extension
    }`}`;

    const urlAWS = await awsS3ServiceAdapter({
      fileName: fileName,
      mimeType: file?.mimetype,
      folder: folder,
      file: file.buffer,
    });

    await this.uploadsService.createOne({
      name: file?.originalname,
      path: fileName,
      size: Number(file?.size),
      status: 'success',
      url: urlAWS.Location,
      uploadType: fieldnameLists[file?.fieldname] as UploadType,
      model: model,
      userId: userId,
      postId: postId,
      productId: productId,
      commissionId: commissionId,
      membershipId: membershipId,
      organizationId: organizationId,
      uploadableId: uploadableId,
    });
  }
}
