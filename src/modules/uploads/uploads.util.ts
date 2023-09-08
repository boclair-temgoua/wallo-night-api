import { generateLongUUID } from '../../app/utils/commons/generate-random';
import { formateNowDateYYMMDD } from '../../app/utils/commons/formate-date';
import { Injectable } from '@nestjs/common';
import { GetCommissionsSelections } from '../commissions/commissions.type';
import { awsS3ServiceAdapter } from '../integrations/aws/aws-s3-service-adapter';
import * as mime from 'mime-types';
import { UploadsService } from './uploads.service';

@Injectable()
export class UploadsUtil {
  constructor(private readonly uploadsService: UploadsService) {} // private driver: Repository<Commission>, // @InjectRepository(Commission)

  async saveOrUpdateAws(options: {
    productId?: string;
    commissionId?: string;
    folder: 'products' | 'commissions';
    files: Array<Express.Multer.File>;
  }): Promise<any> {
    const { files, commissionId, productId, folder } = options;

    Promise.all([
      files
        .filter((lk: any) => lk?.fieldname === 'attachmentImages')
        .map(async (file) => {
          const nameFile = `${formateNowDateYYMMDD(
            new Date(),
          )}${generateLongUUID(8)}`;

          const urlAWS = await awsS3ServiceAdapter({
            name: nameFile,
            mimeType: file?.mimetype,
            folder: folder,
            file: file.buffer,
          });
          const extension = mime.extension(file.mimetype);
          const fileName = `${nameFile}.${extension}`;

          await this.uploadsService.createOne({
            name: file?.originalname,
            path: fileName,
            status: 'success',
            url: urlAWS.Location,
            uploadType: 'IMAGE',
            commissionId: commissionId,
            productId: productId,
          });
        }),

      files
        .filter((lk: any) => lk?.fieldname === 'attachmentFiles')
        .map(async (file) => {
          const nameFile = `${formateNowDateYYMMDD(
            new Date(),
          )}${generateLongUUID(8)}`;

          const urlAWS = await awsS3ServiceAdapter({
            name: nameFile,
            mimeType: file?.mimetype,
            folder: folder,
            file: file.buffer,
          });
          const extension = mime.extension(file.mimetype);
          const fileName = `${nameFile}.${extension}`;

          await this.uploadsService.createOne({
            name: file?.originalname,
            path: fileName,
            status: 'success',
            url: urlAWS.Location,
            uploadType: 'FILE',
            commissionId: commissionId,
            productId: productId,
          });
        }),
    ]);

    return 'ok';
  }
}
