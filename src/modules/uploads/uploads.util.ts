import { generateLongUUID } from '../../app/utils/commons/generate-random';
import { formateNowDateYYMMDD } from '../../app/utils/commons/formate-date';
import { Injectable } from '@nestjs/common';
import { GetCommissionsSelections } from '../commissions/commissions.type';
import { awsS3ServiceAdapter } from '../integrations/aws/aws-s3-service-adapter';
import * as mime from 'mime-types';
import { UploadsService } from './uploads.service';
import { FilterQueryType } from '../../app/utils/search-query';

@Injectable()
export class UploadsUtil {
  constructor(private readonly uploadsService: UploadsService) {} // private driver: Repository<Commission>, // @InjectRepository(Commission)

  async saveOrUpdateAws(options: {
    userId?: string;
    model: FilterQueryType;
    uploadableId: string;
    folder: 'products' | 'commissions' | 'posts' | 'memberships';
    files: Array<Express.Multer.File>;
  }): Promise<any> {
    const { files, userId, model, uploadableId, folder } = options;

    for (const file of files) {
      const nameFile = `${formateNowDateYYMMDD(new Date())}${generateLongUUID(
        8,
      )}`;
      const urlAWS = await awsS3ServiceAdapter({
        name: nameFile,
        mimeType: file?.mimetype,
        folder: folder,
        file: file.buffer,
      });
      const extension = mime.extension(file.mimetype);
      const fileName = `${nameFile}.${extension}`;

      if (file?.fieldname === 'attachmentImages') {
        await this.uploadsService.createOne({
          name: file?.originalname,
          path: fileName,
          status: 'success',
          url: urlAWS.Location,
          uploadType: 'IMAGE',
          model: model,
          userId: userId,
          uploadableId: uploadableId,
        });
      }

      if (file?.fieldname === 'attachmentFiles') {
        await this.uploadsService.createOne({
          name: file?.originalname,
          path: fileName,
          status: 'success',
          url: urlAWS.Location,
          uploadType: 'FILE',
          model: model,
          userId: userId,
          uploadableId: uploadableId,
        });
      }
    }

    return 'ok';
  }
}
