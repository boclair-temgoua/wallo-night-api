import mime from 'mime-types';
import {
  S3Client,
  PutObjectCommandInput,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { S3 } from 'aws-sdk';
import { configurations } from '../../../app/configurations';

const awsClient = new S3({
  region: configurations.implementations.aws.region,
  accessKeyId: configurations.implementations.aws.accessKey,
  secretAccessKey: configurations.implementations.aws.secretKey,
});

export const awsS3ServiceAdapter = async (data: {
  file: PutObjectCommandInput['Body'];
  name: string;
  mimeType: string;
  folder: string;
}): Promise<any> => {
  const { file, name, mimeType, folder } = data;

  const params = {
    Bucket: `${configurations.implementations.aws.bucket}/${folder}`,
    Key: name,
    Body: file,
    ACL: 'public-read',
    ContentType: mimeType,
    ContentDisposition: 'inline',
    CreateBucketConfiguration: {
      LocationConstraint: configurations.implementations.aws.region,
    },
  };

  const responseAws = await awsClient.upload(params).promise();
  const response = { ...responseAws };
  return response;
};

export const getFile = async (key: string, folder: string) => {
  const awsClient = new S3Client({
    credentials: {
      accessKeyId: configurations.implementations.aws.accessKey,
      secretAccessKey: configurations.implementations.aws.secretKey,
    },
    region: configurations.implementations.aws.region,
  });

  const command = new GetObjectCommand({
    Bucket: configurations.implementations.aws.bucket,
    Key: key,
  });
  const response = await awsClient.send(command);
  return response.Body;
};
