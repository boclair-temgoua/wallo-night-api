import { Organization } from '../../models/Organization';

export type GetOneOrganizationSelections = {
  organizationId: Organization['id'];
};

export type UpdateOrganizationSelections = {
  organizationId: Organization['id'];
};

export type CreateOrganizationOptions = Partial<Organization>;

export type UpdateOrganizationOptions = Partial<Organization>;
