import { formateNowDateYYMMDD } from './../../app/utils/commons/formate-date';
import { Injectable } from '@nestjs/common';
import { OrderEventsService } from './order-events.service';
import * as fs from 'fs';
import * as PdfPrinter from 'pdfmake';
import { config } from '../../app/config';
import {
  generateUUID,
  generateNumber,
  generateLongUUID,
} from '../../app/utils/commons/generate-random';
import { Writable } from 'stream';
import { awsS3ServiceAdapter } from '../integrations/aws/aws-s3-service-adapter';
import { UploadsService } from '../uploads/uploads.service';

@Injectable()
export class OrderEventsUtil {
  constructor(
    private readonly orderEventsService: OrderEventsService,
    private readonly uploadsService: UploadsService,
  ) {}

  async createAndGeneratePDF(options: { transaction: any }): Promise<any> {
    const { transaction } = options;

    const orderEvent = await this.orderEventsService.createOne({
      userId: transaction?.userId,
      transactionId: transaction?.id,
      organizationId: transaction?.organizationId,
      ourEventId: transaction?.ourEventId,
      currency: transaction?.currency,
      priceEvent: Number(
        Number(transaction?.amount) / Number(transaction?.quantity),
      ),
      title: transaction?.title,
    });

    const printer = new PdfPrinter({
      Helvetica: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique',
      },
    });

    const docDefinition = {
      content: [
        {
          columns: [
            {
              qr: `${config.url.client}/events/${orderEvent?.id}/validate`,
              fit: '100',
              alignment: 'center',
              margin: [0, 0, 0, 30],
            },
          ],
        },
      ],
      styles: {
        policyText: {
          fontSize: 9,
        },
      },
      defaultStyle: {
        columnGap: 20,
        font: 'Helvetica',
      },
    };

    const nameFile = `${formateNowDateYYMMDD(new Date())}-${generateUUID()}`;
    const fileName = `${nameFile}.pdf`;
    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    pdfDoc.compress = true;
    const chunks = [] as any;
    await new Promise((resolve, reject) => {
      const stream = new Writable({
        write: (chunk, _, next) => {
          chunks.push(chunk);
          next();
        },
      });
      stream.once('error', (err) => reject(err));
      stream.once('close', () => resolve('ok'));

      pdfDoc.pipe(stream);
      pdfDoc.end();
    });

    const urlAWS = await awsS3ServiceAdapter({
      fileName: fileName,
      mimeType: 'application/pdf',
      folder: 'order-events',
      file: Buffer.concat(chunks),
    });

    await this.uploadsService.createOne({
      name: nameFile,
      path: fileName,
      status: 'success',
      url: urlAWS.Location,
      uploadType: 'FILE',
      model: 'ORDER-EVENT',
      uploadableId: orderEvent?.id,
      organizationId: transaction?.organizationId,
    });

    return { orderEvent };
  }
}
