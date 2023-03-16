import { Application } from '../../models/Application';

export type GetApplicationsSelections = {
  search?: string;
  option1?: { userId: Application['userId'] };
};

export type GetOneApplicationSelections = {
  option1?: { applicationId: Application['id'] };
};

export type UpdateApplicationSelections = {
  option1?: { applicationId: Application['id'] };
};

export type CreateApplicationOptions = Partial<Application>;

export type UpdateApplicationOptions = Partial<Application>;
