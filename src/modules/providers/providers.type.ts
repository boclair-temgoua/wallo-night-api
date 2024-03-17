import { Provider } from '../../models/Provider';

export type GetOneProviderSelections = {
  authProviderId?: Provider['id'];
  email?: Provider['email'];
  name?: Provider['name'];
  providerId?: Provider['providerId'];
};

export type UpdateProviderSelections = {
  authProviderId?: Provider['id'];
  email?: Provider['email'];
  providerId?: Provider['providerId'];
};

export type CreateProviderOptions = Partial<Provider>;

export type UpdateProviderOptions = Partial<Provider>;
