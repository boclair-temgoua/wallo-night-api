import { AuthProvider } from '../../models/AuthProvider';

export type GetOneAuthProviderSelections = {
  authProviderId?: AuthProvider['id'];
  email?: AuthProvider['email'];
  providerId?: AuthProvider['providerId'];
};

export type UpdateAuthProviderSelections = {
  authProviderId?: AuthProvider['id'];
  email?: AuthProvider['email'];
  providerId?: AuthProvider['providerId'];
};

export type CreateAuthProviderOptions = Partial<AuthProvider>;

export type UpdateAuthProviderOptions = Partial<AuthProvider>;
