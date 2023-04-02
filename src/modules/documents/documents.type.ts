import { Document } from '../../models/Document';
import { PaginationType } from '../../app/utils/pagination/with-pagination';

export enum DocumentType {
  ORGANIZATION = 'ORGANIZATION',
  PROJECT = 'PROJECT',
  SUBPROJECT = 'SUBPROJECT',
}

export type GetDocumentsSelections = {
  search?: string;
  type: Document['type'];
  organizationId: Document['organizationId'];
  projectId: Document['projectId'];
  subProjectId: Document['subProjectId'];
  pagination?: PaginationType;
};

export type GetOneDocumentSelections = {
  option1?: { documentId: Document['id'] };
};

export type UpdateDocumentSelections = {
  option1?: { documentId: Document['id'] };
};

export type CreateDocumentOptions = Partial<Document>;

export type UpdateDocumentOptions = Partial<Document>;
