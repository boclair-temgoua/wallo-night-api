import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Document } from '../../models/Document';
import { Repository, Brackets } from 'typeorm';
import {
  CreateDocumentOptions,
  GetDocumentsSelections,
  GetOneDocumentSelections,
  UpdateDocumentOptions,
  UpdateDocumentSelections,
} from './documents.type';
import { useCatch } from '../../app/utils/use-catch';
import { withPagination } from '../../app/utils/pagination/with-pagination';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private driver: Repository<Document>,
  ) {}

  async findAll(selections: GetDocumentsSelections): Promise<any> {
    const {
      search,
      pagination,
      organizationId,
      projectId,
      subProjectId,
      type,
    } = selections;

    let query = this.driver
      .createQueryBuilder('document')
      .where('document.deletedAt IS NULL')
      .andWhere('document.type = :type', { type });

    if (organizationId) {
      query = query.andWhere('document.organizationId = :organizationId', {
        organizationId,
      });
    }

    if (projectId) {
      query = query.andWhere('document.projectId = :projectId', {
        projectId,
      });
    }

    if (subProjectId) {
      query = query.andWhere('document.subProjectId = :subProjectId', {
        subProjectId,
      });
    }

    if (search) {
      query = query.andWhere(
        new Brackets((qb) => {
          qb.where('document.title ::text ILIKE :search', {
            search: `%${search}%`,
          });
        }),
      );
    }

    const [errorRowCount, rowCount] = await useCatch(query.getCount());
    if (errorRowCount) throw new NotFoundException(errorRowCount);

    const [error, Documents] = await useCatch(
      query
        .orderBy('document.createdAt', pagination?.sort)
        .limit(pagination.limit)
        .offset(pagination.offset)
        .getMany(),
    );
    if (error) throw new NotFoundException(error);

    return withPagination({
      pagination,
      rowCount,
      value: Documents,
    });
  }

  async findOneBy(selections: GetOneDocumentSelections): Promise<Document> {
    const { option1 } = selections;
    let query = this.driver
      .createQueryBuilder('document')
      .where('document.deletedAt IS NULL');

    if (option1) {
      const { documentId } = option1;
      query = query.andWhere('document.id = :id', { id: documentId });
    }

    const [error, result] = await useCatch(query.getOne());
    if (error)
      throw new HttpException('document not found', HttpStatus.NOT_FOUND);

    return result;
  }

  /** Create one Document to the database. */
  async createOne(options: CreateDocumentOptions): Promise<Document> {
    const {
      title,
      url,
      type,
      typeFile,
      description,
      organizationId,
      projectId,
      subProjectId,
    } = options;

    const document = new Document();
    document.title = title;
    document.url = url;
    document.type = type;
    document.typeFile = typeFile;
    document.description = description;
    document.organizationId = organizationId;
    document.projectId = projectId;
    document.subProjectId = subProjectId;

    const query = this.driver.save(document);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one Document to the database. */
  async updateOne(
    selections: UpdateDocumentSelections,
    options: UpdateDocumentOptions,
  ): Promise<Document> {
    const { option1 } = selections;
    const { deletedAt } = options;

    let findQuery = this.driver.createQueryBuilder('document');

    if (option1) {
      findQuery = findQuery.where('document.id = :id', {
        id: option1.documentId,
      });
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
