import { Organization } from '../../models';

export type GetOneOrganizationSelections = {
  organizationId: Organization['id'];
};

export type UpdateOrganizationSelections = {
  organizationId: Organization['id'];
};

export type CreateOrganizationOptions = Partial<Organization>;

export type UpdateOrganizationOptions = Partial<Organization>;
