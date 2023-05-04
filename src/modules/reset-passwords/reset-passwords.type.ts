import { ResetPassword } from '../../models/ResetPassword';

export type GetOneResetPasswordSelections = {
  token: ResetPassword['token'];
};

export type UpdateResetPasswordSelections = {
  token: ResetPassword['token'];
};

export type UpdateResetPasswordOptions = Partial<ResetPassword>;

export type CreateResetPasswordOptions = Partial<ResetPassword>;
